import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const row = await prisma.commandLog.findUnique({ where: { id: params.id } });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const row = await prisma.commandLog.update({
    where: { id: params.id },
    data: {
      username: body.username ?? undefined,
      owner: body.owner ?? undefined,
      repo: body.repo ?? undefined,
      command: body.command ?? undefined,
      status: body.status ?? undefined,
      output: body.output ?? undefined,
    },
  });
  return NextResponse.json(row);
}

export async function DELETE(_: Request, { params }: Params) {
  await prisma.commandLog.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
