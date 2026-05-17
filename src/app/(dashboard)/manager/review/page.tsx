"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, RotateCcw, ChevronDown, ChevronUp, Edit3, Save } from "lucide-react";
import { getStatusColor, getStatusLabel, getProgressColor } from "@/lib/utils";

interface Goal { id: string; title: string; thrustArea: string; description: string; weightage: number; target: number; achievement: number; progressStatus: string; uom: string; isShared: boolean; }
interface GoalSheet { id: string; status: string; goals: Goal[]; cycle: { name: string; quarter: string }; }
interface TeamMember { id: string; name: string; email: string; designation: string; goalSheets: GoalSheet[]; }

export default function ManagerReviewPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [returnNote, setReturnNote] = useState("");
  const [returnId, setReturnId] = useState<string | null>(null);
  const [editGoal, setEditGoal] = useState<{ id: string; target: number; weightage: number } | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setTeam(d.team || []); setLoading(false); });
  }, []);

  const approve = async (sheetId: string) => {
    await fetch(`/api/goals/${sheetId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve" }) });
    setTeam(t => t.map(m => ({ ...m, goalSheets: m.goalSheets.map(s => s.id === sheetId ? { ...s, status: "APPROVED" } : s) })));
  };

  const returnSheet = async (sheetId: string) => {
    await fetch(`/api/goals/${sheetId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "return", note: returnNote }) });
    setTeam(t => t.map(m => ({ ...m, goalSheets: m.goalSheets.map(s => s.id === sheetId ? { ...s, status: "RETURNED" } : s) })));
    setReturnId(null); setReturnNote("");
  };

  const saveGoalEdit = async (sheetId: string) => {
    if (!editGoal) return;
    await fetch(`/api/goals/${sheetId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "updateGoal", goalId: editGoal.id, target: editGoal.target, weightage: editGoal.weightage }) });
    setTeam(t => t.map(m => ({ ...m, goalSheets: m.goalSheets.map(s => s.id === sheetId ? { ...s, goals: s.goals.map(g => g.id === editGoal.id ? { ...g, target: editGoal.target, weightage: editGoal.weightage } : g) } : s) })));
    setEditGoal(null);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Team Review</h1>
        <p className="page-subtitle">Review, edit, and approve team goal sheets</p>
      </div>

      <div className="space-y-4">
        {team.map((member, i) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
            {member.goalSheets.map(sheet => (
              <div key={sheet.id}>
                <button onClick={() => setExpanded(expanded === sheet.id ? null : sheet.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-ivory/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark font-outfit font-semibold text-sm">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-graphite">{member.name}</div>
                      <div className="text-xs text-graphite-muted">{member.designation} • {sheet.cycle.quarter}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${getStatusColor(sheet.status)}`}>{getStatusLabel(sheet.status)}</span>
                    {expanded === sheet.id ? <ChevronUp size={16} className="text-slate" /> : <ChevronDown size={16} className="text-slate" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === sheet.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-black/[0.03] overflow-hidden">
                      <div className="p-5 space-y-3">
                        {sheet.goals.map(goal => {
                          const pct = goal.target > 0 ? Math.round((goal.achievement / goal.target) * 100) : 0;
                          const isEditing = editGoal?.id === goal.id;
                          return (
                            <div key={goal.id} className="bg-ivory rounded-xl p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="badge badge-gold text-[10px]">{goal.thrustArea}</span>
                                    <span className={`badge ${getStatusColor(goal.progressStatus)} text-[10px]`}>{getStatusLabel(goal.progressStatus)}</span>
                                  </div>
                                  <div className="font-medium text-graphite text-sm">{goal.title}</div>
                                  <div className="text-xs text-graphite-muted mt-0.5">{goal.description}</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="metric-value text-lg" style={{ color: getProgressColor(pct) }}>{pct}%</div>
                                </div>
                              </div>
                              {isEditing ? (
                                <div className="flex items-end gap-3 mt-3 pt-3 border-t border-black/[0.04]">
                                  <div><label className="label">Target</label><input type="number" className="input w-28" value={editGoal.target} onChange={e => setEditGoal({ ...editGoal, target: +e.target.value })} /></div>
                                  <div><label className="label">Weight %</label><input type="number" className="input w-28" value={editGoal.weightage} onChange={e => setEditGoal({ ...editGoal, weightage: +e.target.value })} /></div>
                                  <button onClick={() => saveGoalEdit(sheet.id)} className="btn-sage btn-sm"><Save size={14} /> Save</button>
                                  <button onClick={() => setEditGoal(null)} className="btn-outline btn-sm">Cancel</button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-4 mt-2 text-xs text-graphite-muted">
                                  <span>Target: <b>{goal.target}</b></span>
                                  <span>Weight: <b>{goal.weightage}%</b></span>
                                  <span>Achieved: <b>{goal.achievement}</b></span>
                                  {sheet.status === "SUBMITTED" && (
                                    <button onClick={() => setEditGoal({ id: goal.id, target: goal.target, weightage: goal.weightage })} className="text-gold hover:text-gold-dark ml-auto"><Edit3 size={13} /></button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {sheet.status === "SUBMITTED" && (
                        <div className="p-5 pt-0">
                          {returnId === sheet.id ? (
                            <div className="space-y-3">
                              <textarea className="textarea" value={returnNote} onChange={e => setReturnNote(e.target.value)} placeholder="Reason for returning..." />
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => setReturnId(null)} className="btn-outline btn-sm">Cancel</button>
                                <button onClick={() => returnSheet(sheet.id)} className="btn-rose btn-sm"><RotateCcw size={14} /> Confirm Return</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setReturnId(sheet.id)} className="btn-outline btn-sm text-rose border-rose/20 hover:bg-rose/5"><RotateCcw size={14} /> Return</button>
                              <button onClick={() => approve(sheet.id)} className="btn-sage btn-sm"><CheckCircle size={14} /> Approve</button>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
