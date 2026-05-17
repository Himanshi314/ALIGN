import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count(),
  ]);
  return NextResponse.json({ logs, total, page, pages: Math.ceil(total / limit) });
}
