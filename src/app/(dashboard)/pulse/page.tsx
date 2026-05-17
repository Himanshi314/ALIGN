"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, TrendingUp, Clock, Lightbulb, Activity, Shield } from "lucide-react";

interface Insight {
  id: string; type: string; severity: string; title: string; message: string; metric?: string;
}

const typeIcons: Record<string, React.ElementType> = {
  risk: AlertTriangle, approval: Clock, optimization: Lightbulb, prediction: TrendingUp, summary: Activity,
};
const severityColors: Record<string, { bg: string; border: string; icon: string }> = {
  critical: { bg: "bg-rose/5", border: "border-rose/15", icon: "text-rose" },
  warning: { bg: "bg-gold/5", border: "border-gold/15", icon: "text-gold" },
  info: { bg: "bg-blue/5", border: "border-blue/15", icon: "text-blue" },
};

export default function PulsePage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [pulseScore, setPulseScore] = useState(0);
  const [stats, setStats] = useState({ totalGoals: 0, completedCount: 0, riskCount: 0, onTrackPct: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pulse").then(r => r.json()).then(d => {
      setInsights(d.insights || []); setPulseScore(d.pulseScore || 0); setStats(d.stats || {}); setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  const scoreColor = pulseScore >= 70 ? "text-sage" : pulseScore >= 40 ? "text-gold" : "text-rose";

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Brain size={18} className="text-gold" />
          </div>
          <span className="font-outfit font-semibold text-gold text-lg">Pulse AI</span>
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        </div>
        <h1 className="page-title">Intelligence Dashboard</h1>
        <p className="page-subtitle">AI-powered insights for organizational performance</p>
      </div>

      {/* Pulse Score */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card card-gold p-8 mb-8">
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke={pulseScore >= 70 ? "var(--color-sage)" : pulseScore >= 40 ? "var(--color-gold)" : "var(--color-rose)"}
                strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pulseScore / 100) }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-outfit font-bold metric-value ${scoreColor}`}>{pulseScore}</span>
              <span className="text-[10px] text-graphite-muted uppercase tracking-wider">Score</span>
            </div>
          </div>
          <div>
            <h2 className="font-outfit font-bold text-xl text-graphite mb-1">Organizational Pulse</h2>
            <p className="text-sm text-graphite-muted mb-4">
              {pulseScore >= 70 ? "Your organization is performing well. Most goals are on track." :
               pulseScore >= 40 ? "Mixed performance. Some areas need attention." :
               "Critical attention needed. Multiple goals are at risk."}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div><span className="metric-value text-graphite text-lg">{stats.totalGoals}</span> <span className="text-graphite-muted">Goals</span></div>
              <div><span className="metric-value text-sage text-lg">{stats.completedCount}</span> <span className="text-graphite-muted">Done</span></div>
              <div><span className="metric-value text-rose text-lg">{stats.riskCount}</span> <span className="text-graphite-muted">At Risk</span></div>
              <div><span className="metric-value text-gold text-lg">{stats.onTrackPct}%</span> <span className="text-graphite-muted">On Track</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <h2 className="font-outfit font-semibold text-lg text-graphite mb-4">Active Insights</h2>
      <div className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = typeIcons[insight.type] || Activity;
          const colors = severityColors[insight.severity] || severityColors.info;
          return (
            <motion.div key={insight.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
              className={`card p-5 ${colors.bg} border ${colors.border}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                  <Icon size={20} className={colors.icon} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-outfit font-semibold text-graphite">{insight.title}</h3>
                      <p className="text-sm text-graphite-soft mt-1">{insight.message}</p>
                    </div>
                    {insight.metric && (
                      <span className={`metric-value text-lg ${colors.icon} ml-4 whitespace-nowrap`}>{insight.metric}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Escalation Timeline */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8">
        <h2 className="font-outfit font-semibold text-lg text-graphite mb-4">Escalation Timeline</h2>
        <div className="card p-6">
          <div className="relative pl-8">
            {[
              { time: "2 hours ago", event: "Pulse detected 1 goal sheet pending approval > 7 days", severity: "warning" },
              { time: "1 day ago", event: "Auto-notification sent to Manager: Priya Sharma", severity: "info" },
              { time: "3 days ago", event: "Goal sheet submitted by Neha Gupta", severity: "info" },
              { time: "7 days ago", event: "Q1 check-in window opened", severity: "info" },
            ].map((item, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <div className={`absolute left-[-24px] top-1.5 w-3 h-3 rounded-full border-2 ${
                  item.severity === "warning" ? "bg-gold border-gold" : "bg-blue/20 border-blue"
                }`} />
                {i < 3 && <div className="absolute left-[-19px] top-5 w-px h-full bg-black/[0.06]" />}
                <div className="text-xs text-graphite-muted mb-0.5">{item.time}</div>
                <div className="text-sm text-graphite">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
