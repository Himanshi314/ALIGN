"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Settings } from "lucide-react";
import { getStatusColor } from "@/lib/utils";

interface Cycle { id: string; name: string; quarter: string; startDate: string; endDate: string; status: string; }

export default function CyclesPage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "FY 2025-26", quarter: "Q2", startDate: "2025-07-01", endDate: "2025-09-30", status: "DRAFT" });

  useEffect(() => {
    fetch("/api/cycles").then(r => r.json()).then(d => { setCycles(d.cycles || []); setLoading(false); });
  }, []);

  const createCycle = async () => {
    const res = await fetch("/api/cycles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    setCycles([d.cycle, ...cycles]);
    setShowForm(false);
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "ACTIVE" ? "LOCKED" : current === "LOCKED" ? "COMPLETED" : current === "DRAFT" ? "ACTIVE" : "ACTIVE";
    const res = await fetch("/api/cycles", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: next }) });
    const d = await res.json();
    setCycles(cycles.map(c => c.id === id ? d.cycle : c));
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div><h1 className="page-title">Cycle Management</h1><p className="page-subtitle">Create and manage performance cycles</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold"><Plus size={16} /> New Cycle</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
          <h3 className="font-outfit font-semibold mb-4">Create New Cycle</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className="label">Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Quarter</label>
              <select className="select" value={form.quarter} onChange={e => setForm({ ...form, quarter: e.target.value })}>
                {["Q1","Q2","Q3","Q4"].map(q => <option key={q}>{q}</option>)}
              </select>
            </div>
            <div><label className="label">Start Date</label><input type="date" className="input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
            <div><label className="label">End Date</label><input type="date" className="input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
            <button onClick={createCycle} className="btn-primary btn-sm">Create Cycle</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {cycles.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold/8 flex items-center justify-center text-gold font-outfit font-bold text-sm">{c.quarter}</div>
              <div>
                <div className="font-medium text-graphite">{c.name} — {c.quarter}</div>
                <div className="text-xs text-graphite-muted">{new Date(c.startDate).toLocaleDateString()} → {new Date(c.endDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${getStatusColor(c.status === "ACTIVE" ? "APPROVED" : c.status === "LOCKED" ? "SUBMITTED" : "DRAFT")} text-xs`}>{c.status}</span>
              <button onClick={() => toggleStatus(c.id, c.status)} className="btn-outline btn-sm" title="Toggle Status"><Settings size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
