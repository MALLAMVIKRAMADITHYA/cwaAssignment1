import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const logs = await prisma.commandLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const log = await prisma.commandLog.create({
    data: {
      username: body.username ?? null,
      owner: body.owner ?? null,
      repo: body.repo ?? null,
      command: body.command ?? "execute",
      status: body.status ?? "OK",
      output: body.output ?? null,
    },
  });
  return NextResponse.json(log, { status: 201 });
}
