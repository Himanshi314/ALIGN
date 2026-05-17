"use client";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

const qoqData = [
  { quarter: "Q1 FY24", achievement: 62 },
  { quarter: "Q2 FY24", achievement: 71 },
  { quarter: "Q3 FY24", achievement: 68 },
  { quarter: "Q4 FY24", achievement: 78 },
  { quarter: "Q1 FY25", achievement: 72 },
];

const teamData = [
  { name: "Rahul K.", completion: 78, goals: 5 },
  { name: "Neha G.", completion: 0, goals: 4 },
  { name: "Vikram S.", completion: 65, goals: 4 },
];

const radarData = [
  { area: "Revenue", score: 70 },
  { area: "Innovation", score: 60 },
  { area: "Customer", score: 92 },
  { area: "Operations", score: 85 },
  { area: "People", score: 88 },
  { area: "Strategic", score: 55 },
];

const heatmapData = [
  { employee: "Rahul", Q1M1: 80, Q1M2: 72, Q1M3: 70 },
  { employee: "Neha", Q1M1: 0, Q1M2: 0, Q1M3: 0 },
  { employee: "Vikram", Q1M1: 75, Q1M2: 68, Q1M3: 65 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-3 shadow-lg border border-black/[0.04]">
      <div className="text-xs text-graphite-muted mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-sm font-medium text-graphite">{p.name}: <span className="metric-value">{p.value}%</span></div>
      ))}
    </div>
  );
};

function HeatCell({ value }: { value: number }) {
  const bg = value === 0 ? "bg-black/[0.02]" : value >= 80 ? "bg-sage/30" : value >= 60 ? "bg-gold/25" : value >= 30 ? "bg-gold/15" : "bg-rose/20";
  return (
    <div className={`w-16 h-12 rounded-lg ${bg} flex items-center justify-center text-xs metric-value`}>
      {value > 0 ? `${value}%` : "—"}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-2 mb-2"><BarChart3 size={20} className="text-gold" /><span className="text-sm text-gold font-medium">Analytics Hub</span></div>
        <h1 className="page-title">Performance Analytics</h1>
        <p className="page-subtitle">Visual intelligence across your organization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* QoQ Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="font-outfit font-semibold text-graphite mb-4">QoQ Achievement Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={qoqData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C6A969" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C6A969" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: "#8B8B8B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8B8B8B" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="achievement" name="Achievement" stroke="#C6A969" strokeWidth={2.5} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Radar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
          <h3 className="font-outfit font-semibold text-graphite mb-4">Department Performance Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(0,0,0,0.06)" />
              <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: "#4A4A4A" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#8B8B8B" }} />
              <Radar name="Score" dataKey="score" stroke="#7A8F6A" fill="#7A8F6A" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Completion */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-outfit font-semibold text-graphite mb-4">Team Completion Rates</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={teamData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8B8B8B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8B8B8B" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completion" name="Completion" fill="#C6A969" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Heatmap */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
          <h3 className="font-outfit font-semibold text-graphite mb-4">Achievement Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs text-graphite-muted font-medium pb-3">Employee</th>
                  <th className="text-center text-xs text-graphite-muted font-medium pb-3">Month 1</th>
                  <th className="text-center text-xs text-graphite-muted font-medium pb-3">Month 2</th>
                  <th className="text-center text-xs text-graphite-muted font-medium pb-3">Month 3</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map(row => (
                  <tr key={row.employee}>
                    <td className="py-1 text-sm font-medium text-graphite pr-4">{row.employee}</td>
                    <td className="py-1 text-center"><HeatCell value={row.Q1M1} /></td>
                    <td className="py-1 text-center"><HeatCell value={row.Q1M2} /></td>
                    <td className="py-1 text-center"><HeatCell value={row.Q1M3} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-4 text-[10px] text-graphite-muted">
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose/20" /> &lt;30%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gold/15" /> 30-59%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gold/25" /> 60-79%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-sage/30" /> 80%+</span>
          </div>
        </motion.div>
      </div>

      {/* Manager Effectiveness */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-outfit font-semibold text-graphite mb-4">Manager Effectiveness</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Avg Approval Time", value: "2.3 days", benchmark: "Target: <3 days", status: "sage" },
            { label: "Check-in Review Rate", value: "87%", benchmark: "Target: 90%", status: "gold" },
            { label: "Team Goal Completion", value: "72%", benchmark: "Org avg: 68%", status: "sage" },
          ].map((m, i) => (
            <div key={m.label} className="bg-ivory rounded-xl p-4 text-center">
              <div className="text-2xl font-outfit font-bold metric-value text-graphite">{m.value}</div>
              <div className="text-sm font-medium text-graphite-soft mt-1">{m.label}</div>
              <div className={`text-xs mt-2 ${m.status === "sage" ? "text-sage" : "text-gold"}`}>{m.benchmark}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
