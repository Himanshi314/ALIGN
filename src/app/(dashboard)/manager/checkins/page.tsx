"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProgressColor } from "@/lib/utils";

interface TeamMember {
  id: string; name: string; designation: string;
  goalSheets: Array<{ status: string; goals: Array<{ title: string; target: number; achievement: number; progressStatus: string;
    checkins: Array<{ quarter: string; planned: number; achieved: number; comment: string; managerNote: string | null }> }> }>;
}

export default function ManagerCheckinsPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setTeam(d.team || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Team Check-ins</h1>
        <p className="page-subtitle">Monitor quarterly progress across your team</p>
      </div>

      {team.map((member, mi) => {
        const approvedSheet = member.goalSheets.find(s => s.status === "APPROVED");
        if (!approvedSheet) return null;
        return (
          <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.05 }} className="card p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark font-outfit font-semibold text-sm">
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-medium text-graphite">{member.name}</div>
                <div className="text-xs text-graphite-muted">{member.designation}</div>
              </div>
            </div>
            <div className="space-y-3">
              {approvedSheet.goals.map(goal => {
                const pct = goal.target > 0 ? Math.round((goal.achievement / goal.target) * 100) : 0;
                return (
                  <div key={goal.title} className="bg-ivory rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-graphite">{goal.title}</span>
                      <span className="metric-value text-sm" style={{ color: getProgressColor(pct) }}>{pct}%</span>
                    </div>
                    <div className="progress-bar mb-2"><div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: getProgressColor(pct) }} /></div>
                    {goal.checkins.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {goal.checkins.slice(0, 3).map((c, ci) => (
                          <div key={ci} className="text-xs text-graphite-muted flex items-center gap-3">
                            <span className="font-mono">{c.quarter}</span>
                            <span>Plan: {c.planned} → Actual: <b className="text-graphite">{c.achieved}</b></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
