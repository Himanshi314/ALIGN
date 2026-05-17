"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, BarChart3 } from "lucide-react";
import { getProgressColor } from "@/lib/utils";

interface User { id: string; name: string; role: string; department: string; goalSheets: Array<{ status: string; goals: Array<{ title: string; target: number; achievement: number; progressStatus: string; weightage: number; thrustArea: string }> }>; }

export default function ReportsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  }, []);

  const exportCSV = () => {
    const rows = [["Name", "Department", "Role", "Goal", "Thrust Area", "Target", "Achievement", "Weightage", "Status"]];
    for (const u of users) {
      for (const gs of u.goalSheets) {
        for (const g of gs.goals) {
          rows.push([u.name, u.department, u.role, g.title, g.thrustArea, String(g.target), String(g.achievement), String(g.weightage), g.progressStatus]);
        }
      }
    }
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "align-report.csv"; a.click();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  const departments = [...new Set(users.map(u => u.department))];

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div><h1 className="page-title">Reports & Export</h1><p className="page-subtitle">Organizational performance reports</p></div>
        <button onClick={exportCSV} className="btn-gold"><Download size={16} /> Export CSV</button>
      </div>

      {/* Dept Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {departments.map((dept, i) => {
          const deptUsers = users.filter(u => u.department === dept);
          const deptGoals = deptUsers.flatMap(u => u.goalSheets.flatMap(gs => gs.goals));
          const avgPct = deptGoals.length > 0 ? Math.round(deptGoals.reduce((s, g) => s + (g.target > 0 ? (g.achievement / g.target) * 100 : 0), 0) / deptGoals.length) : 0;
          const completed = deptGoals.filter(g => g.progressStatus === "COMPLETED").length;
          return (
            <motion.div key={dept} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-outfit font-semibold text-graphite">{dept}</h3>
                <span className="metric-value text-lg" style={{ color: getProgressColor(avgPct) }}>{avgPct}%</span>
              </div>
              <div className="progress-bar mb-2"><div className="progress-fill" style={{ width: `${avgPct}%`, background: getProgressColor(avgPct) }} /></div>
              <div className="flex justify-between text-xs text-graphite-muted">
                <span>{deptUsers.length} members</span><span>{completed}/{deptGoals.length} completed</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* User Table */}
      <div className="card overflow-hidden">
        <div className="table-container">
          <table>
            <thead><tr><th>Employee</th><th>Department</th><th>Goals</th><th>Completed</th><th>Progress</th></tr></thead>
            <tbody>
              {users.filter(u => u.role !== "ADMIN").map((u, i) => {
                const goals = u.goalSheets.flatMap(gs => gs.goals);
                const avgPct = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + (g.target > 0 ? (g.achievement / g.target) * 100 : 0), 0) / goals.length) : 0;
                const completed = goals.filter(g => g.progressStatus === "COMPLETED").length;
                return (
                  <tr key={u.id}>
                    <td className="font-medium text-graphite">{u.name}</td>
                    <td className="text-sm text-graphite-muted">{u.department}</td>
                    <td className="text-sm">{goals.length}</td>
                    <td className="text-sm">{completed}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar w-20"><div className="progress-fill" style={{ width: `${avgPct}%`, background: getProgressColor(avgPct) }} /></div>
                        <span className="metric-value text-xs" style={{ color: getProgressColor(avgPct) }}>{avgPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
