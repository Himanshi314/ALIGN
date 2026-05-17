import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allGoals = await prisma.goal.findMany({
    include: { goalSheet: { include: { user: { select: { name: true, department: true } }, cycle: true } }, checkins: true },
  });

  const users = await prisma.user.findMany({
    include: { goalSheets: { include: { goals: true } } },
  });

  // Calculate insights
  const insights: Array<{ id: string; type: string; severity: string; title: string; message: string; metric?: string }> = [];
  let riskCount = 0;
  let completedCount = 0;
  let totalGoals = allGoals.length;

  for (const goal of allGoals) {
    const pct = goal.target > 0 ? (goal.achievement / goal.target) * 100 : 0;
    if (pct < 30 && goal.progressStatus !== "COMPLETED" && goal.progressStatus !== "NOT_STARTED") {
      riskCount++;
    }
    if (goal.progressStatus === "COMPLETED") completedCount++;
  }

  // Risk detection
  const atRiskGoals = allGoals.filter(g => {
    const pct = g.target > 0 ? (g.achievement / g.target) * 100 : 0;
    return pct < 40 && g.progressStatus !== "COMPLETED" && g.progressStatus !== "NOT_STARTED";
  });

  if (atRiskGoals.length > 0) {
    insights.push({
      id: "risk-1",
      type: "risk",
      severity: "critical",
      title: "At-Risk Goals Detected",
      message: `${atRiskGoals.length} of ${totalGoals} goals are trending below 40% achievement. Immediate attention recommended.`,
      metric: `${atRiskGoals.length} goals`,
    });
  }

  // Pending approvals
  const pendingSheets = await prisma.goalSheet.findMany({ where: { status: "SUBMITTED" } });
  if (pendingSheets.length > 0) {
    const oldestPending = pendingSheets.reduce((oldest, s) => (!oldest || (s.submittedAt && s.submittedAt < oldest) ? s.submittedAt : oldest), null as Date | null);
    const daysOld = oldestPending ? Math.floor((Date.now() - new Date(oldestPending).getTime()) / 86400000) : 0;
    insights.push({
      id: "approval-1",
      type: "approval",
      severity: daysOld > 3 ? "warning" : "info",
      title: "Pending Manager Approvals",
      message: `${pendingSheets.length} goal sheet(s) awaiting approval. Oldest pending for ${daysOld} days.`,
      metric: `${pendingSheets.length} pending`,
    });
  }

  // Weightage optimization
  const sheetsWithIssues = allGoals.filter(g => g.weightage >= 25 && g.progressStatus === "COMPLETED");
  if (sheetsWithIssues.length > 0) {
    insights.push({
      id: "optimize-1",
      type: "optimization",
      severity: "info",
      title: "Weightage Optimization Opportunity",
      message: `${sheetsWithIssues.length} high-weight goals are already completed. Consider redistributing focus to at-risk objectives.`,
    });
  }

  // Performance prediction
  const onTrackPct = totalGoals > 0 ? Math.round(((totalGoals - riskCount) / totalGoals) * 100) : 0;
  insights.push({
    id: "predict-1",
    type: "prediction",
    severity: onTrackPct < 60 ? "warning" : "info",
    title: "Quarterly Performance Forecast",
    message: `Based on current trajectory, ${onTrackPct}% of organizational goals are projected to meet Q1 targets.`,
    metric: `${onTrackPct}%`,
  });

  // Check-in summary
  const totalCheckins = await prisma.checkin.count();
  insights.push({
    id: "summary-1",
    type: "summary",
    severity: "info",
    title: "Check-in Activity Summary",
    message: `${totalCheckins} check-ins recorded across the organization. ${completedCount} goals completed, ${riskCount} at risk.`,
    metric: `${totalCheckins} check-ins`,
  });

  // Pulse score
  const pulseScore = Math.min(100, Math.max(0, Math.round(
    (completedCount / Math.max(totalGoals, 1)) * 40 +
    ((totalGoals - riskCount) / Math.max(totalGoals, 1)) * 40 +
    (pendingSheets.length === 0 ? 20 : Math.max(0, 20 - pendingSheets.length * 5))
  )));

  return NextResponse.json({ insights, pulseScore, stats: { totalGoals, completedCount, riskCount, onTrackPct } });
}
