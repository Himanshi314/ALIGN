"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

export default function GoalsListPage() {
  const [sheets, setSheets] = useState<Array<{ id: string; status: string; goals: Array<{ id: string }>; cycle: { name: string; quarter: string }; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/goals").then(r => r.json()).then(d => { setSheets(d.goalSheets || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">My Goals</h1>
          <p className="page-subtitle">All your goal sheets across cycles</p>
        </div>
        <Link href="/employee/goals/new" className="btn-gold"><Plus size={16} /> New Goal Sheet</Link>
      </div>
      <div className="space-y-3">
        {sheets.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link href={`/employee/goals/${s.id}`} className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/8 flex items-center justify-center text-gold font-outfit font-bold text-sm">{s.cycle.quarter}</div>
                <div>
                  <div className="font-medium text-graphite">{s.cycle.name} — {s.cycle.quarter}</div>
                  <div className="text-xs text-graphite-muted">{s.goals.length} goals • Created {new Date(s.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${getStatusColor(s.status)}`}>{getStatusLabel(s.status)}</span>
                <ArrowRight size={16} className="text-slate" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
