"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Target, CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getStatusColor, getStatusLabel, getProgressColor } from "@/lib/utils";

interface TeamMember {
  id: string; name: string; email: string; designation: string;
  goalSheets: Array<{ id: string; status: string; goals: Array<{ progressStatus: string; achievement: number; target: number; weightage: number }> }>;
}

export default function ManagerDashboard() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setTeam(d.team || []); setLoading(false); });
  }, []);

  const pendingApprovals = team.filter(m => m.goalSheets.some(s => s.status === "SUBMITTED")).length;
  const totalGoals = team.reduce((s, m) => s + m.goalSheets.reduce((ss, gs) => ss + gs.goals.length, 0), 0);
  const completedGoals = team.reduce((s, m) => s + m.goalSheets.reduce((ss, gs) => ss + gs.goals.filter(g => g.progressStatus === "COMPLETED").length, 0), 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manager Dashboard</h1>
        <p className="page-subtitle">Oversee your team&apos;s goals and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Team Members", value: team.length, badge: "badge-slate" },
          { icon: Clock, label: "Pending Approvals", value: pendingApprovals, badge: "badge-gold" },
          { icon: Target, label: "Total Goals", value: totalGoals, badge: "badge-blue" },
          { icon: CheckCircle2, label: "Completed", value: completedGoals, badge: "badge-sage" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={20} className="text-graphite-soft" />
              <span className={`badge ${s.badge} text-xs`}>Q1</span>
            </div>
            <div className="text-2xl font-outfit font-bold metric-value">{s.value}</div>
            <div className="text-xs text-graphite-muted mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-outfit font-semibold text-lg text-graphite">Team Members</h2>
        <Link href="/manager/review" className="btn-outline btn-sm"><span>Review All</span><ArrowRight size={14} /></Link>
      </div>

      <div className="space-y-3">
        {team.map((member, i) => {
          const activeSheet = member.goalSheets[0];
          const goals = activeSheet?.goals || [];
          const avgPct = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + (g.target > 0 ? (g.achievement / g.target) * 100 : 0), 0) / goals.length) : 0;
          return (
            <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
              <Link href="/manager/review" className="card p-5 flex items-center gap-5 hover:shadow-md transition-shadow block">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark font-outfit font-semibold text-sm">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-graphite">{member.name}</div>
                  <div className="text-xs text-graphite-muted">{member.designation}</div>
                </div>
                <div className="flex items-center gap-4">
                  {activeSheet && <span className={`badge ${getStatusColor(activeSheet.status)} text-xs`}>{getStatusLabel(activeSheet.status)}</span>}
                  <div className="text-right">
                    <div className="metric-value text-sm" style={{ color: getProgressColor(avgPct) }}>{avgPct}%</div>
                    <div className="text-[10px] text-graphite-muted">{goals.length} goals</div>
                  </div>
                  <ArrowRight size={16} className="text-slate" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
