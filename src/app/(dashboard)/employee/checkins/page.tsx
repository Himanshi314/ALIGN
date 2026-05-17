"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck } from "lucide-react";
import { getStatusColor, getStatusLabel, getProgressColor } from "@/lib/utils";

export default function EmployeeCheckinsPage() {
  const [sheets, setSheets] = useState<Array<{ id: string; status: string; cycle: { name: string; quarter: string }; goals: Array<{ id: string; title: string; target: number; achievement: number; checkins: Array<{ quarter: string; planned: number; achieved: number; status: string; comment: string }> }> }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/goals").then(r => r.json()).then(d => { setSheets((d.goalSheets || []).filter((s: { status: string }) => s.status === "APPROVED")); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  const allGoals = sheets.flatMap(s => s.goals);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Check-ins</h1>
        <p className="page-subtitle">Your quarterly progress updates</p>
      </div>
      {allGoals.length === 0 ? (
        <div className="card p-12 text-center"><ClipboardCheck size={40} className="mx-auto text-slate mb-4" /><p className="text-graphite-muted">No approved goals to check in on yet.</p></div>
      ) : (
        <div className="space-y-4">
          {allGoals.map((goal, i) => {
            const pct = goal.target > 0 ? Math.round((goal.achievement / goal.target) * 100) : 0;
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-graphite">{goal.title}</h3>
                  <span className="metric-value text-sm" style={{ color: getProgressColor(pct) }}>{pct}%</span>
                </div>
                <div className="progress-bar mb-4"><div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: getProgressColor(pct) }} /></div>
                {goal.checkins.length > 0 ? (
                  <div className="space-y-2">
                    {goal.checkins.map((c, ci) => (
                      <div key={ci} className="bg-ivory rounded-lg px-4 py-2.5 flex items-center gap-4 text-sm">
                        <span className="badge badge-slate text-[10px]">{c.quarter}</span>
                        <span className="text-graphite-muted">Plan: <b>{c.planned}</b></span>
                        <span className="text-graphite-muted">Actual: <b className="metric-value">{c.achieved}</b></span>
                        <span className={`badge ${getStatusColor(c.status)} text-[10px]`}>{getStatusLabel(c.status)}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-slate">No check-ins yet</p>}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
