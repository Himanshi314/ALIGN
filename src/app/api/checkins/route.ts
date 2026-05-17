import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { goalId, quarter, planned, achieved, status, comment } = body;

  const checkin = await prisma.checkin.create({
    data: { goalId, userId: session.user.id, quarter, planned, achieved, status, comment },
  });

  // Update goal achievement and status
  await prisma.goal.update({
    where: { id: goalId },
    data: { achievement: achieved, progressStatus: status },
  });

  // Auto-sync shared goals
  const goal = await prisma.goal.findUnique({ where: { id: goalId }, include: { sharedCopies: true } });
  if (goal?.isShared && goal.sharedCopies.length > 0) {
    for (const copy of goal.sharedCopies) {
      await prisma.goal.update({
        where: { id: copy.id },
        data: { achievement: achieved, progressStatus: status },
      });
    }
  }

  await prisma.auditLog.create({
    data: { userId: session.user.id, action: "CHECKIN_SUBMITTED", entity: "Goal", entityId: goalId, details: JSON.stringify({ quarter, achieved }) },
  });

  return NextResponse.json({ checkin });
}
