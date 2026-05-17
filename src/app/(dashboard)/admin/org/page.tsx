"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, User, ChevronRight } from "lucide-react";

interface OrgUser { id: string; name: string; role: string; department: string; designation: string; manager?: { name: string } | null; goalSheets: Array<{ status: string }>; }

export default function OrgPage() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>;

  const admin = users.find(u => u.role === "ADMIN");
  const managers = users.filter(u => u.role === "MANAGER");
  const employees = users.filter(u => u.role === "EMPLOYEE");

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Organization Hierarchy</h1><p className="page-subtitle">Team structure and reporting lines</p></div>

      <div className="flex flex-col items-center">
        {/* Admin */}
        {admin && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5 w-72 text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold-dark font-outfit font-semibold mx-auto mb-2">
              {admin.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="font-medium text-graphite">{admin.name}</div>
            <div className="text-xs text-graphite-muted">{admin.designation}</div>
            <div className="badge badge-gold text-[10px] mt-2">ADMIN</div>
          </motion.div>
        )}

        <div className="w-px h-8 bg-black/[0.06]" />

        {/* Managers */}
        <div className="flex gap-6 flex-wrap justify-center">
          {managers.map((mgr, i) => (
            <motion.div key={mgr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex flex-col items-center">
              <div className="card p-5 w-64 text-center mb-2">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-sage-dark font-outfit font-semibold mx-auto mb-2">
                  {mgr.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="font-medium text-graphite">{mgr.name}</div>
                <div className="text-xs text-graphite-muted">{mgr.designation}</div>
                <div className="badge badge-sage text-[10px] mt-2">MANAGER</div>
              </div>

              <div className="w-px h-6 bg-black/[0.06]" />

              {/* Reports */}
              <div className="space-y-2">
                {employees.map((emp, ei) => (
                  <motion.div key={emp.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + ei * 0.05 }}
                    className="card p-4 w-56 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ivory-warm flex items-center justify-center text-graphite-soft font-outfit font-semibold text-xs">
                      {emp.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-graphite">{emp.name}</div>
                      <div className="text-[10px] text-graphite-muted">{emp.designation}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
