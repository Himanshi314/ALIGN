"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, CheckCircle2, AlertTriangle, Clock, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { getStatusColor, getStatusLabel, getProgressColor } from "@/lib/utils";

interface Goal {
  id: string; title: string; thrustArea: string; weightage: number;
  achievement: number; target: number; progressStatus: string; uom: string;
}
interface GoalSheet {
  id: string; status: string; goals: Goal[]; cycle: { name: string; quarter: string };
  createdAt: string; submittedAt: string | null; approvedAt: string | null; returnNote: string | null;
}

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.05, duration: 0.4 },
});

export default function EmployeeDashboard() {
  const [sheets, setSheets] = useState<GoalSheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/goals").then(r => r.json()).then(d => { setSheets(d.goalSheets || []); setLoading(false); });
  }, []);

  const activeSheet = sheets.find(s => s.status === "APPROVED") || sheets[0];
  const goals = activeSheet?.goals || [];
  const completed = goals.filter(g => g.progressStatus === "COMPLETED").length;
  const atRisk = goals.filter(g => g.progressStatus === "AT_RISK").length;
  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + (g.target > 0 ? (g.achievement / g.target) * 100 : 0), 0) / goals.length) : 0;

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Track your goals and quarterly progress</p>
        </div>
        <Link href="/employee/goals/new" className="btn-gold">
          <Plus size={16} /> New Goal Sheet
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Target, label: "Total Goals", value: goals.length, color: "text-graphite" },
          { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%`, color: "text-gold" },
          { icon: CheckCircle2, label: "Completed", value: completed, color: "text-sage" },
          { icon: AlertTriangle, label: "At Risk", value: atRisk, color: "text-rose" },
        ].map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i)} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={20} className={s.color} />
              <span className={`badge ${i === 0 ? "badge-slate" : i === 1 ? "badge-gold" : i === 2 ? "badge-sage" : "badge-rose"}`}>
                {activeSheet?.cycle?.quarter || "Q1"}
              </span>
            </div>
            <div className={`text-2xl font-outfit font-bold metric-value ${s.color}`}>{s.value}</div>
            <div className="text-xs text-graphite-muted mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Goal Sheets */}
      {sheets.length === 0 ? (
        <motion.div {...fadeUp(4)} className="card p-12 text-center">
          <Target size={40} className="mx-auto text-slate mb-4" />
          <h3 className="text-lg font-outfit font-semibold text-graphite mb-2">No goal sheets yet</h3>
          <p className="text-sm text-graphite-muted mb-6">Create your first goal sheet to start tracking your objectives.</p>
          <Link href="/employee/goals/new" className="btn-gold">
            <Plus size={16} /> Create Goal Sheet
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sheets.map((sheet, i) => (
            <motion.div key={sheet.id} {...fadeUp(4 + i)}>
              <Link href={`/employee/goals/${sheet.id}`} className="card p-6 block hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-outfit font-semibold text-graphite">{sheet.cycle.name} • {sheet.cycle.quarter}</h3>
                    <span className={`badge ${getStatusColor(sheet.status)}`}>{getStatusLabel(sheet.status)}</span>
                  </div>
                  <ArrowRight size={18} className="text-slate" />
                </div>
                {sheet.returnNote && sheet.status === "RETURNED" && (
                  <div className="mb-4 px-4 py-2.5 bg-rose/5 rounded-xl text-sm text-rose">
                    <strong>Manager Note:</strong> {sheet.returnNote}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sheet.goals.slice(0, 4).map((goal) => {
                    const pct = goal.target > 0 ? Math.round((goal.achievement / goal.target) * 100) : 0;
                    return (
                      <div key={goal.id} className="bg-ivory rounded-xl p-3">
                        <div className="text-xs text-graphite-muted mb-1">{goal.thrustArea}</div>
                        <div className="text-sm font-medium text-graphite mb-2 line-clamp-1">{goal.title}</div>
                        <div className="progress-bar mb-1">
                          <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: getProgressColor(pct) }} />
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-graphite-muted">{goal.weightage}% weight</span>
                          <span className="metric-value" style={{ color: getProgressColor(pct) }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {sheet.goals.length > 4 && <div className="text-xs text-slate mt-3 text-center">+{sheet.goals.length - 4} more goals</div>}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
