import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goalSheet = await prisma.goalSheet.findUnique({
    where: { id },
    include: {
      cycle: true,
      user: { select: { id: true, name: true, email: true, department: true, designation: true } },
      goals: {
        include: {
          checkins: { orderBy: { createdAt: "desc" } },
          sharedSource: true,
          sharedCopies: true,
        },
      },
    },
  });

  if (!goalSheet) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ goalSheet });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Manager approval/return
  if (body.action === "approve") {
    await prisma.goalSheet.update({
      where: { id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "GOAL_SHEET_APPROVED", entity: "GoalSheet", entityId: id, details: JSON.stringify({ status: "APPROVED" }) },
    });
    return NextResponse.json({ success: true });
  }

  if (body.action === "return") {
    await prisma.goalSheet.update({
      where: { id },
      data: { status: "RETURNED", returnNote: body.note || "Please revise your goals." },
    });
    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "GOAL_SHEET_RETURNED", entity: "GoalSheet", entityId: id, details: JSON.stringify({ status: "RETURNED", note: body.note }) },
    });
    return NextResponse.json({ success: true });
  }

  // Update goal targets/weightage (manager inline edit)
  if (body.action === "updateGoal" && body.goalId) {
    await prisma.goal.update({
      where: { id: body.goalId },
      data: { target: body.target, weightage: body.weightage },
    });
    return NextResponse.json({ success: true });
  }

  // Submit
  if (body.action === "submit") {
    await prisma.goalSheet.update({
      where: { id },
      data: { status: "SUBMITTED", submittedAt: new Date() },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
