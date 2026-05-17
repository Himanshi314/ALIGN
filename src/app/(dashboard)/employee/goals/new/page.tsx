"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, AlertCircle, Send, Save, ChevronRight } from "lucide-react";
import { THRUST_AREAS, UOM_OPTIONS } from "@/lib/utils";

interface GoalEntry {
  thrustArea: string; title: string; description: string; uom: string; target: number; weightage: number;
}

const emptyGoal = (): GoalEntry => ({ thrustArea: "", title: "", description: "", uom: "NUMERIC", target: 0, weightage: 0 });

export default function NewGoalSheet() {
  const router = useRouter();
  const [goals, setGoals] = useState<GoalEntry[]>([emptyGoal()]);
  const [cycles, setCycles] = useState<Array<{ id: string; name: string; quarter: string; status: string }>>([]);
  const [cycleId, setCycleId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    fetch("/api/cycles").then(r => r.json()).then(d => {
      const activeCycles = (d.cycles || []).filter((c: { status: string }) => c.status === "ACTIVE");
      setCycles(activeCycles);
      if (activeCycles.length > 0) setCycleId(activeCycles[0].id);
    });
  }, []);

  const totalWeight = goals.reduce((s, g) => s + g.weightage, 0);

  const updateGoal = (i: number, field: string, value: string | number) => {
    const next = [...goals];
    (next[i] as unknown as Record<string, string | number>)[field] = value;
    setGoals(next);
  };

  const addGoal = () => {
    if (goals.length >= 8) return;
    setGoals([...goals, emptyGoal()]);
  };

  const removeGoal = (i: number) => {
    if (goals.length <= 1) return;
    setGoals(goals.filter((_, idx) => idx !== i));
  };

  const validate = (): string | null => {
    if (!cycleId) return "Please select a cycle.";
    for (const g of goals) {
      if (!g.thrustArea) return "All goals must have a thrust area.";
      if (!g.title.trim()) return "All goals must have a title.";
      if (g.weightage < 10) return `Minimum weightage is 10% ("${g.title}").`;
      if (g.target <= 0) return `Target must be positive ("${g.title}").`;
    }
    if (Math.abs(totalWeight - 100) > 0.01) return "Total weightage must equal exactly 100%.";
    return null;
  };

  const handleSubmit = async (submit: boolean) => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycleId, goals, submit }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); setSaving(false); return; }
      router.push("/employee");
    } catch { setError("Network error"); setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-2 text-sm text-graphite-muted mb-2">
          <span>Goals</span><ChevronRight size={14} /><span className="text-graphite">New Goal Sheet</span>
        </div>
        <h1 className="page-title">Create Goal Sheet</h1>
        <p className="page-subtitle">Define your objectives for the quarter</p>
      </div>

      {/* Cycle Selector */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6">
        <label className="label">Performance Cycle</label>
        <select className="select max-w-xs" value={cycleId} onChange={e => setCycleId(e.target.value)}>
          {cycles.map(c => <option key={c.id} value={c.id}>{c.name} — {c.quarter}</option>)}
        </select>
      </motion.div>

      {/* Weightage Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-graphite">Total Weightage</span>
          <span className={`metric-value text-lg ${Math.abs(totalWeight - 100) < 0.01 ? "text-sage" : totalWeight > 100 ? "text-rose" : "text-gold"}`}>
            {totalWeight}%
          </span>
        </div>
        <div className="progress-bar h-3 rounded-lg">
          <div className="progress-fill rounded-lg transition-all duration-300"
            style={{ width: `${Math.min(totalWeight, 100)}%`, background: Math.abs(totalWeight - 100) < 0.01 ? "var(--color-sage)" : totalWeight > 100 ? "var(--color-rose)" : "var(--color-gold)" }} />
        </div>
        <div className="flex justify-between text-xs text-graphite-muted mt-1.5">
          <span>{goals.length} of 8 goals</span>
          <span>{Math.abs(totalWeight - 100) < 0.01 ? "✓ Balanced" : `${100 - totalWeight}% remaining`}</span>
        </div>
      </motion.div>

      {/* Goals */}
      <AnimatePresence>
        {goals.map((goal, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            transition={{ delay: i * 0.03 }} className="card p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-outfit font-semibold text-graphite">Goal {i + 1}</h3>
              {goals.length > 1 && (
                <button onClick={() => removeGoal(i)} className="text-slate hover:text-rose transition-colors p-1"><Trash2 size={16} /></button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Thrust Area</label>
                <select className="select" value={goal.thrustArea} onChange={e => updateGoal(i, "thrustArea", e.target.value)}>
                  <option value="">Select area...</option>
                  {THRUST_AREAS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Unit of Measure</label>
                <select className="select" value={goal.uom} onChange={e => updateGoal(i, "uom", e.target.value)}>
                  {UOM_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label} — {u.description}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">Goal Title</label>
                <input className="input" value={goal.title} onChange={e => updateGoal(i, "title", e.target.value)} placeholder="e.g., Increase API throughput by 40%" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Description</label>
                <textarea className="textarea" value={goal.description} onChange={e => updateGoal(i, "description", e.target.value)} placeholder="Describe the objective and success criteria..." />
              </div>
              <div>
                <label className="label">Target</label>
                <input type="number" className="input" value={goal.target || ""} onChange={e => updateGoal(i, "target", parseFloat(e.target.value) || 0)} placeholder="e.g., 40" />
              </div>
              <div>
                <label className="label">Weightage (%)</label>
                <input type="number" className="input" value={goal.weightage || ""} onChange={e => updateGoal(i, "weightage", parseFloat(e.target.value) || 0)}
                  min={10} max={100} placeholder="Min 10%" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {goals.length < 8 && (
        <button onClick={addGoal} className="btn-outline w-full py-3 justify-center mb-6">
          <Plus size={16} /> Add Goal
        </button>
      )}

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose text-sm bg-rose/5 px-4 py-3 rounded-xl mb-4">
          <AlertCircle size={16} />{error}
        </motion.div>
      )}

      <div className="flex items-center gap-3 justify-end">
        <button onClick={() => handleSubmit(false)} disabled={saving} className="btn-outline">
          <Save size={16} /> Save Draft
        </button>
        <button onClick={() => handleSubmit(true)} disabled={saving} className="btn-gold">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Submit for Approval</>}
        </button>
      </div>
    </div>
  );
}
