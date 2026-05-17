import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goalSheets = await prisma.goalSheet.findMany({
    where: { userId: session.user.id },
    include: {
      cycle: true,
      goals: { include: { checkins: { orderBy: { createdAt: "desc" } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ goalSheets });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { cycleId, goals } = body;

  // Validate
  if (!goals || goals.length === 0) return NextResponse.json({ error: "At least one goal required" }, { status: 400 });
  if (goals.length > 8) return NextResponse.json({ error: "Maximum 8 goals allowed" }, { status: 400 });

  const totalWeight = goals.reduce((s: number, g: { weightage: number }) => s + g.weightage, 0);
  if (Math.abs(totalWeight - 100) > 0.01) return NextResponse.json({ error: "Total weightage must equal 100%" }, { status: 400 });

  for (const g of goals) {
    if (g.weightage < 10) return NextResponse.json({ error: `Minimum weightage per goal is 10% ("${g.title}")` }, { status: 400 });
  }

  const goalSheet = await prisma.goalSheet.create({
    data: {
      userId: session.user.id,
      cycleId,
      status: body.submit ? "SUBMITTED" : "DRAFT",
      submittedAt: body.submit ? new Date() : null,
      goals: {
        create: goals.map((g: { thrustArea: string; title: string; description: string; uom: string; target: number; weightage: number }) => ({
          thrustArea: g.thrustArea,
          title: g.title,
          description: g.description,
          uom: g.uom,
          target: g.target,
          weightage: g.weightage,
        })),
      },
    },
    include: { goals: true },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: body.submit ? "GOAL_SHEET_SUBMITTED" : "GOAL_SHEET_CREATED",
      entity: "GoalSheet",
      entityId: goalSheet.id,
      details: JSON.stringify({ status: goalSheet.status, goalsCount: goals.length }),
    },
  });

  return NextResponse.json({ goalSheet });
}
