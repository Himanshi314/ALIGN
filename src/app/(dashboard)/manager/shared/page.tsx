"use client";
import { motion } from "framer-motion";
import { ArrowUpDown, Users, Link2 } from "lucide-react";

export default function SharedGoalsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shared Goals</h1>
        <p className="page-subtitle">Push and sync shared objectives across your team</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card card-gold p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
            <Link2 size={22} className="text-gold" />
          </div>
          <div>
            <h3 className="font-outfit font-semibold text-graphite text-lg">Shared Goal Sync Engine</h3>
            <p className="text-sm text-graphite-muted mt-1">
              When you create a shared goal, linked copies are automatically created for selected team members.
              When the primary owner updates their achievement, all copies auto-sync.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-outfit font-semibold text-graphite mb-4">Active Shared Goals</h3>
        <div className="bg-ivory rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="badge badge-gold text-xs mb-1">Operational Excellence</div>
              <h4 className="font-medium text-graphite">Achieve 99.9% platform uptime</h4>
              <p className="text-xs text-graphite-muted mt-0.5">Auto-synced across linked team members</p>
            </div>
            <div className="text-right">
              <div className="metric-value text-xl text-sage">99.7%</div>
              <div className="text-xs text-graphite-muted">Target: 99.9%</div>
            </div>
          </div>
          <div className="progress-bar mb-3"><div className="progress-fill bg-sage" style={{ width: "99.7%" }} /></div>
          <div className="flex items-center gap-3 text-xs text-graphite-muted">
            <div className="flex items-center gap-1"><ArrowUpDown size={12} className="text-gold" /> <span>Auto-sync active</span></div>
            <span>•</span>
            <div className="flex items-center gap-1"><Users size={12} /> <span>Linked to: Rahul Kapoor, Vikram Singh</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
