"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Log { id: string; action: string; entity: string; entityId: string; details: string; createdAt: string; user: { name: string; email: string; role: string }; }

export default function AuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit").then(r => r.json()).then(d => { setLogs(d.logs || []); setLoading(false); });
  }, []);

  const actionColors: Record<string, string> = {
    GOAL_SHEET_CREATED: "badge-slate", GOAL_SHEET_SUBMITTED: "badge-gold", GOAL_SHEET_APPROVED: "badge-sage",
    GOAL_SHEET_RETURNED: "badge-rose", CHECKIN_SUBMITTED: "badge-blue", CYCLE_CREATED: "badge-gold",
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Audit Logs</h1>
        <p className="page-subtitle">Complete trail of all system actions</p>
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                  <td className="text-xs font-mono text-graphite-muted whitespace-nowrap">{formatDate(log.createdAt)}</td>
                  <td>
                    <div className="text-sm font-medium text-graphite">{log.user.name}</div>
                    <div className="text-[10px] text-graphite-muted">{log.user.role}</div>
                  </td>
                  <td><span className={`badge ${actionColors[log.action] || "badge-slate"} text-[10px]`}>{log.action.replace(/_/g, " ")}</span></td>
                  <td className="text-sm text-graphite-muted">{log.entity}</td>
                  <td className="text-xs text-graphite-muted max-w-[200px] truncate">{log.details}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
