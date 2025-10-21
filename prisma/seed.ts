import prisma from "../app/lib/prisma";
async function main() {
  await prisma.commandLog.create({
    data: { command: "seed", status: "OK", output: "Seeded", orm: "Prisma", result: "ok" }
  });
  console.log("Seed complete");
}
main().finally(()=>process.exit(0));
