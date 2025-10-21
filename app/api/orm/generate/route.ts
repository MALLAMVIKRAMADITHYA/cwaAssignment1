// Ensure this runs in Node.js (not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { putFileToGithub } from "@/app/lib/github";

/**
 * This route:
 * - Generates Prisma or Sequelize files from the UI
 * - Commits them to GitHub
 * - Logs the command in the database (CommandLog)
 */

// ---------- Types ----------
type Column = { name: string; type: "string" | "int" | "boolean" | "date"; required?: boolean };
type TableDef = { name: string; columns: Column[] };

// ---------- Prisma schema builder ----------
function prismaField(col: Column) {
  const map: Record<Column["type"], string> = {
    string: "String",
    int: "Int",
    boolean: "Boolean",
    date: "DateTime",
  };
  const t = map[col.type] || "String";
  const opt = col.required ? "" : "?";
  return `  ${col.name} ${t}${opt}`;
}

function prismaSchema(tables: TableDef[]) {
  const models = tables.map((t) => {
    const fields = [
      `  id String @id @default(cuid())`,
      ...t.columns.map(prismaField),
      `  createdAt DateTime @default(now())`,
      `  updatedAt DateTime @updatedAt`,
    ].join("\n");

    const modelName = t.name.replace(/[^a-zA-Z0-9]/g, "_");
    return `model ${modelName} {\n${fields}\n}`;
  });

  return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = env("PRISMA_PROVIDER")
  url      = env("DATABASE_URL")
}

${models.join("\n\n")}
`;
}

// ---------- Sequelize model builder ----------
function sequelizeModel(t: TableDef) {
  const attrs = t.columns
    .map((c) => {
      const typeMap: Record<Column["type"], string> = {
        string: "DataTypes.STRING",
        int: "DataTypes.INTEGER",
        boolean: "DataTypes.BOOLEAN",
        date: "DataTypes.DATE",
      };
      const allowNull = c.required ? "false" : "true";
      const safe = c.name.replace(/[^a-zA-Z0-9_]/g, "_");
      return `    ${safe}: { type: ${typeMap[c.type]}, allowNull: ${allowNull} },`;
    })
    .join("\n");

  const className = t.name.replace(/[^a-zA-Z0-9_]/g, "_");

  return `import { DataTypes, Model, Sequelize } from "sequelize";

export class ${className} extends Model {}

export function init${className}(sequelize: Sequelize) {
  ${className}.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
${attrs}
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, modelName: "${className}" }
  );

  return ${className};
}
`;
}

const sequelizeIndex = `import { Sequelize } from "sequelize";

// DATABASE_URL examples:
//  - sqlite: "sqlite:dev.sqlite"
//  - postgres: "postgres://appuser:apppass@db:5432/appdb"
export const sequelize = new Sequelize(process.env.DATABASE_URL as string, { logging: false });

// import and init models here, e.g.
// import { initCommandLog } from "./models/CommandLog";
// initCommandLog(sequelize);

// Usage at startup:
// await sequelize.authenticate();
// await sequelize.sync();
`;

// ---------- MAIN POST FUNCTION ----------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orm: ormChoice,   // renamed to avoid clash with data.orm field
      tables,
      github,
      userInput,
    } = body as {
      orm: "prisma" | "sequelize";
      tables: TableDef[];
      github: { token: string; owner: string; repo: string; branch?: string; commitMessage?: string };
      userInput?: { username?: string; owner?: string; repo?: string; command?: string };
    };

    // 🔸 Validate
    if (!github?.token || !github?.owner || !github?.repo) {
      return NextResponse.json({ error: "Missing GitHub credentials" }, { status: 400 });
    }
    if (!tables?.length) {
      return NextResponse.json({ error: "No table definitions provided" }, { status: 400 });
    }

    const branch = github.branch || "main";
    const commitMessage = github.commitMessage || `feat(${ormChoice}): auto-generate schema & files`;

    // 🔸 Generate files (RICH set so GitHub shows more changes)
    const files: { path: string; content: string }[] = [];

    // Common helper contents
    const dockerignore = `node_modules
.next
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist
.env
.prisma
.git
`;

    const dockerfile = `# Multi-stage Dockerfile for Next.js app
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If Prisma exists, generate client (no-op for Sequelize)
RUN npx prisma generate || echo "no prisma"
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["npm","start"]
`;

    const compose = `version: "3.9"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      PRISMA_PROVIDER: "postgresql"
      DATABASE_URL: "postgresql://appuser:apppass@db:5432/appdb?schema=public"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppass
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - dbdata:/var/lib/postgresql/data
volumes:
  dbdata:
`;

    const readmeCommon = (ormName: "Prisma" | "Sequelize") => `# ${ormName} Scaffold

This repository was scaffolded from the web UI.

## Quick start (local)
\`\`\`bash
npm i
npm run dev
\`\`\`

## Docker (with Postgres)
\`\`\`bash
docker compose up --build
\`\`\`
`;

    if (ormChoice === "prisma") {
      // Prisma files
      const schema = prismaSchema(tables);
      files.push({ path: "prisma/schema.prisma", content: schema });

      const envExample = `# local sqlite
PRISMA_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"

# docker postgres (matches docker-compose.yml)
# PRISMA_PROVIDER="postgresql"
# DATABASE_URL="postgresql://appuser:apppass@db:5432/appdb?schema=public"
`;
      files.push({ path: ".env.example", content: envExample });

      // Prisma client singleton (useful to have in repo)
      const prismaLib = `import { PrismaClient } from "@prisma/client";
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["warn", "error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
`;
      files.push({ path: "app/lib/prisma.ts", content: prismaLib });

      // Optional seed script
      const seed = `import prisma from "../app/lib/prisma";
async function main() {
  await prisma.commandLog.create({
    data: { command: "seed", status: "OK", output: "Seeded", orm: "Prisma", result: "ok" }
  });
  console.log("Seed complete");
}
main().finally(()=>process.exit(0));
`;
      files.push({ path: "prisma/seed.ts", content: seed });

      // README
      files.push({ path: "README.md", content: readmeCommon("Prisma") });

    } else {
      // Sequelize files
      files.push({ path: "sequelize/index.ts", content: sequelizeIndex });

      for (const t of tables) {
        const content = sequelizeModel(t);
        const safe = t.name.replace(/[^a-zA-Z0-9_]/g, "_");
        files.push({ path: `sequelize/models/${safe}.ts`, content });
      }

      const seqReadme = `# Sequelize Scaffold

DATABASE_URL examples:
- sqlite: \`sqlite:dev.sqlite\`
- postgres: \`postgres://appuser:apppass@localhost:5432/appdb\`

Run locally:
\`\`\`bash
npm i
npm run dev
\`\`\`
`;
      files.push({ path: "sequelize/README.md", content: seqReadme });

      const seedSeq = `import { sequelize } from "./index";
async function main() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Sequelize ready");
  process.exit(0);
}
main();
`;
      files.push({ path: "sequelize/seed.ts", content: seedSeq });

      // Minimal .env.example
      files.push({ path: ".env.example", content: `DATABASE_URL="sqlite:dev.sqlite"` });

      // README
      files.push({ path: "README.md", content: readmeCommon("Sequelize") });
    }

    // Common infra files (so GitHub diff is richer)
    files.push({ path: ".dockerignore", content: dockerignore });
    files.push({ path: "Dockerfile", content: dockerfile });
    files.push({ path: "docker-compose.yml", content: compose });

    // 🔸 Commit to GitHub
    const results: any[] = [];
    for (const f of files) {
      const res = await putFileToGithub({
        token: github.token,
        owner: github.owner,
        repo: github.repo,
        branch,
        path: f.path,
        content: f.content,
        message: commitMessage,
      });
      results.push(res);
    }

    // 🔸 Save log in DB
    await prisma.commandLog.create({
      data: {
        username: userInput?.username ?? null,
        owner:    userInput?.owner ?? null,
        repo:     userInput?.repo ?? null,
        command:  `${ormChoice.toUpperCase()} GENERATE & COMMIT`,
        status:   "OK",
        output:   `Committed ${files.length} file(s)`,
        orm:      ormChoice === "prisma" ? "Prisma" : "Sequelize",
        result:   "ok",
      },
    });

    const commitHtmlUrl = results?.[results.length - 1]?.commit?.html_url ?? null;

    return NextResponse.json({
      ok: true,
      orm: ormChoice,
      filesCommitted: files.map((f) => f.path),
      commitHtmlUrl,
    });
  } catch (err: any) {
    // 🔸 Capture and log errors
    try {
      await prisma.commandLog.create({
        data: {
          command: "ORM GENERATE & COMMIT",
          status: "ERROR",
          output: String(err?.message || err),
          orm: undefined,
          result: "failed",
        },
      });
    } catch {}
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
