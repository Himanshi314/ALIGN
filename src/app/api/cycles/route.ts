import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cycles = await prisma.cycle.findMany({ orderBy: { startDate: "desc" } });
  return NextResponse.json({ cycles });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const cycle = await prisma.cycle.create({
    data: { name: body.name, quarter: body.quarter, startDate: new Date(body.startDate), endDate: new Date(body.endDate), status: body.status || "DRAFT" },
  });
  return NextResponse.json({ cycle });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const cycle = await prisma.cycle.update({ where: { id: body.id }, data: { status: body.status } });
  return NextResponse.json({ cycle });
}
