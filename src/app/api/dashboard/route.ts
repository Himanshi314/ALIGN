import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // For manager: get team goal sheets
  if (session.user.role === "MANAGER") {
    const team = await prisma.user.findMany({
      where: { managerId: session.user.id },
      include: {
        goalSheets: {
          include: { cycle: true, goals: { include: { checkins: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return NextResponse.json({ team });
  }

  // For admin: get all
  if (session.user.role === "ADMIN") {
    const users = await prisma.user.findMany({
      include: {
        goalSheets: { include: { cycle: true, goals: { include: { checkins: true } } } },
        manager: { select: { name: true } },
      },
    });
    const cycles = await prisma.cycle.findMany({ orderBy: { startDate: "desc" } });
    return NextResponse.json({ users, cycles });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
