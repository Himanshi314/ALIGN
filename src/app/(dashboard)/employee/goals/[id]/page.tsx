"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpDown, Send } from "lucide-react";
import { getStatusColor, getStatusLabel, getProgressColor } from "@/lib/utils";

interface Checkin { id: string; quarter: string; planned: number; achieved: number; status: string; comment: string; managerNote: string | null; createdAt: string; }
interface Goal { id: string; title: string; thrustArea: string; description: string; weightage: number; achievement: number; target: number; progressStatus: string; uom: string; isShared: boolean; checkins: Checkin[]; }
interface GoalSheet { id: string; status: string; goals: Goal[]; cycle: { name: string; quarter: string }; user: { name: string }; returnNote: string | null; }

export default function GoalDetailPage() {
  const params = useParams();
  const [sheet, setSheet] = useState<GoalSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinGoalId, setCheckinGoalId] = useState<string | null>(null);
  const [checkinData, setCheckinData] = useState({ quarter: "Q1-M1", planned: 0, achieved: 0, status: "ON_TRACK", comment: "" });

  useEffect(() => {
    fetch(`/api/goals/${params.id}`).then(r => r.json()).then(d => { setSheet(d.goalSheet); setLoading(false); });
  }, [params.id]);

  const submitCheckin = async () => {
    if (!checkinGoalId) return;
    await fetch("/api/checkins", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: checkinGoalId, ...checkinData }),
    });
    // Refresh
    const d = await fetch(`/api/goals/${params.id}`).then(r => r.json());
    setSheet(d.goalSheet);
    setCheckinGoalId(null);
    setCheckinData({ quarter: "Q1-M1", planned: 0, achieved: 0, status: "ON_TRACK", comment: "" });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;
  if (!sheet) return <div className="text-center py-20 text-graphite-muted">Goal sheet not found.</div>;

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-2 text-sm text-graphite-muted mb-2">
          <span>Goals</span><ChevronRight size={14} /><span className="text-graphite">{sheet.cycle.name} — {sheet.cycle.quarter}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="page-title">Goal Sheet</h1>
          <span className={`badge ${getStatusColor(sheet.status)}`}>{getStatusLabel(sheet.status)}</span>
        </div>
      </div>

      {sheet.returnNote && sheet.status === "RETURNED" && (
        <div className="mb-6 px-5 py-4 bg-rose/5 border border-rose/10 rounded-2xl text-sm text-rose">
          <strong>Returned by Manager:</strong> {sheet.returnNote}
        </div>
      )}

      <div className="space-y-4">
        {sheet.goals.map((goal, i) => {
          const pct = goal.target > 0 ? Math.round((goal.achievement / goal.target) * 100) : 0;
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-gold text-xs">{goal.thrustArea}</span>
                    {goal.isShared && <span className="badge badge-blue text-xs"><ArrowUpDown size={10} className="mr-1" />Shared</span>}
                    <span className={`badge ${getStatusColor(goal.progressStatus)} text-xs`}>{getStatusLabel(goal.progressStatus)}</span>
                  </div>
                  <h3 className="font-outfit font-semibold text-graphite text-lg">{goal.title}</h3>
                  <p className="text-sm text-graphite-muted mt-1">{goal.description}</p>
                </div>
                <div className="text-right ml-6">
                  <div className="text-2xl font-outfit font-bold metric-value" style={{ color: getProgressColor(pct) }}>{pct}%</div>
                  <div className="text-xs text-graphite-muted">{goal.achievement} / {goal.target} {goal.uom === "PERCENTAGE" ? "%" : ""}</div>
                  <div className="text-xs text-slate mt-1">{goal.weightage}% weight</div>
                </div>
              </div>
              <div className="progress-bar mb-4">
                <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: getProgressColor(pct) }} />
              </div>

              {/* Checkins */}
              {goal.checkins.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-graphite-muted uppercase tracking-wider mb-3">Check-in History</h4>
                  <div className="space-y-2">
                    {goal.checkins.map(c => (
                      <div key={c.id} className="bg-ivory rounded-xl px-4 py-3 flex items-start gap-4">
                        <span className="badge badge-slate text-[10px] mt-0.5">{c.quarter}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-graphite-muted">Planned: <b className="text-graphite">{c.planned}</b></span>
                            <span className="text-graphite-muted">Achieved: <b className="metric-value" style={{ color: getProgressColor(c.achieved / Math.max(c.planned, 1) * 100) }}>{c.achieved}</b></span>
                          </div>
                          <p className="text-xs text-graphite-soft mt-1">{c.comment}</p>
                          {c.managerNote && <p className="text-xs text-gold-dark mt-1 italic">Manager: {c.managerNote}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Checkin */}
              {sheet.status === "APPROVED" && (
                checkinGoalId === goal.id ? (
                  <div className="bg-ivory rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div><label className="label">Quarter</label>
                        <select className="select" value={checkinData.quarter} onChange={e => setCheckinData({ ...checkinData, quarter: e.target.value })}>
                          {["Q1-M1","Q1-M2","Q1-M3","Q2-M1","Q2-M2","Q2-M3","Q3-M1","Q3-M2","Q3-M3","Q4-M1","Q4-M2","Q4-M3"].map(q => <option key={q}>{q}</option>)}
                        </select>
                      </div>
                      <div><label className="label">Planned</label><input type="number" className="input" value={checkinData.planned||""} onChange={e => setCheckinData({ ...checkinData, planned: +e.target.value })} /></div>
                      <div><label className="label">Achieved</label><input type="number" className="input" value={checkinData.achieved||""} onChange={e => setCheckinData({ ...checkinData, achieved: +e.target.value })} /></div>
                      <div><label className="label">Status</label>
                        <select className="select" value={checkinData.status} onChange={e => setCheckinData({ ...checkinData, status: e.target.value })}>
                          <option value="NOT_STARTED">Not Started</option><option value="ON_TRACK">On Track</option><option value="AT_RISK">At Risk</option><option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div><label className="label">Comment</label><textarea className="textarea" value={checkinData.comment} onChange={e => setCheckinData({ ...checkinData, comment: e.target.value })} placeholder="Describe your progress..." /></div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setCheckinGoalId(null)} className="btn-outline btn-sm">Cancel</button>
                      <button onClick={submitCheckin} className="btn-sage btn-sm"><Send size={14} /> Submit Check-in</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCheckinGoalId(goal.id)} className="btn-outline btn-sm text-xs">+ Add Check-in</button>
                )
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
