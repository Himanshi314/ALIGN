"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Target, FileText, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

export default function AdminDashboard() {
  const [data, setData] = useState<{ users: Array<{ id: string; name: string; role: string; department: string; goalSheets: Array<{ status: string; goals: Array<{ progressStatus: string }> }> }>; cycles: Array<{ id: string; name: string; quarter: string; status: string }> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  const users = data?.users || [];
  const totalSheets = users.reduce((s, u) => s + u.goalSheets.length, 0);
  const approvedSheets = users.reduce((s, u) => s + u.goalSheets.filter(gs => gs.status === "APPROVED").length, 0);
  const pendingSheets = users.reduce((s, u) => s + u.goalSheets.filter(gs => gs.status === "SUBMITTED").length, 0);
  const totalGoals = users.reduce((s, u) => s + u.goalSheets.reduce((ss, gs) => ss + gs.goals.length, 0), 0);
  const completed = users.reduce((s, u) => s + u.goalSheets.reduce((ss, gs) => ss + gs.goals.filter(g => g.progressStatus === "COMPLETED").length, 0), 0);

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-2 mb-2"><Shield size={20} className="text-gold" /><span className="text-sm text-gold font-medium">Admin Console</span></div>
        <h1 className="page-title">Organization Overview</h1>
        <p className="page-subtitle">Enterprise-wide goal management and compliance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { icon: Users, label: "Users", value: users.length },
          { icon: FileText, label: "Goal Sheets", value: totalSheets },
          { icon: Clock, label: "Pending", value: pendingSheets },
          { icon: Target, label: "Approved", value: approvedSheets },
          { icon: TrendingUp, label: "Total Goals", value: totalGoals },
          { icon: TrendingUp, label: "Completed", value: completed },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-4 text-center">
            <s.icon size={18} className="mx-auto text-graphite-soft mb-2" />
            <div className="text-xl font-outfit font-bold metric-value">{s.value}</div>
            <div className="text-[11px] text-graphite-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-outfit font-semibold">Active Cycles</h3>
            <Link href="/admin/cycles" className="text-xs text-gold hover:text-gold-dark">Manage →</Link>
          </div>
          <div className="space-y-2">
            {(data?.cycles || []).map(c => (
              <div key={c.id} className="bg-ivory rounded-xl px-4 py-3 flex items-center justify-between">
                <div><div className="font-medium text-sm">{c.name} — {c.quarter}</div></div>
                <span className={`badge ${getStatusColor(c.status === "ACTIVE" ? "APPROVED" : c.status === "DRAFT" ? "DRAFT" : "RETURNED")} text-xs`}>{c.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-outfit font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Cycles", href: "/admin/cycles", icon: "⚙️" },
              { label: "Audit Logs", href: "/admin/audit", icon: "📋" },
              { label: "Export Reports", href: "/admin/reports", icon: "📊" },
              { label: "Organization", href: "/admin/org", icon: "🏢" },
            ].map(a => (
              <Link key={a.label} href={a.href} className="bg-ivory rounded-xl p-4 hover:bg-ivory-dark transition-colors text-center">
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="text-sm font-medium text-graphite">{a.label}</div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
