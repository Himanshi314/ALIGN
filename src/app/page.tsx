"use client";
import { motion } from "framer-motion";
import { ArrowRight, Target, Brain, BarChart3, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  { icon: Target, title: "Strategic Goal Setting", desc: "Structured thrust areas, weighted objectives, and cascaded alignment across your organization." },
  { icon: Brain, title: "AI-Powered Insights", desc: "Pulse detects at-risk goals, suggests optimizations, and predicts performance bottlenecks." },
  { icon: BarChart3, title: "Live Analytics", desc: "Heatmaps, radar charts, and real-time dashboards that turn data into decisions." },
  { icon: Zap, title: "Smart Escalations", desc: "Automated alerts for delayed approvals, missed check-ins, and stalled progress." },
  { icon: Shield, title: "Enterprise Controls", desc: "Role-based access, audit trails, cycle management, and compliance-ready exports." },
  { icon: Users, title: "Shared Goal Sync", desc: "Cross-team objectives stay aligned with automatic achievement synchronization." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #1F1F1F 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-[1320px] mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-graphite flex items-center justify-center">
            <span className="text-white font-outfit font-bold text-sm">A</span>
          </div>
          <span className="font-outfit font-semibold text-xl tracking-tight text-graphite">ALIGN</span>
        </div>
        <Link href="/login" className="btn-primary text-sm">
          Sign In <ArrowRight size={16} />
        </Link>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-[1320px] mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-black/[0.04] shadow-sm mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="text-sm text-graphite-soft font-medium">Performance Command Center</span>
          </motion.div>

          <motion.h1
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-[72px] leading-[1.05] font-outfit font-bold text-graphite tracking-tight mb-6"
          >
            Where Goals
            <br />
            Become{" "}
            <span className="relative">
              <span className="text-gold">Measurable</span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gold/30 origin-left rounded-full"
              />
            </span>
            <br />
            Momentum
          </motion.h1>

          <motion.p
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-lg text-graphite-soft leading-relaxed mb-10 max-w-xl"
          >
            ALIGN transforms organizational goal-setting into a strategic advantage.
            Set objectives, track quarterly progress, and leverage AI insights to
            keep every team moving in the same direction.
          </motion.p>

          <motion.div
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex items-center gap-4"
          >
            <Link href="/login" className="btn-gold text-base px-8 py-3">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link href="#features" className="btn-outline text-base px-8 py-3">
              Explore Features
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="flex items-center gap-12 mt-16 pt-8 border-t border-black/[0.04]"
          >
            {[
              { value: "99.9%", label: "Uptime SLA" },
              { value: "4x", label: "Faster Reviews" },
              { value: "87%", label: "Goal Completion" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-outfit font-bold text-graphite metric-value">{stat.value}</div>
                <div className="text-sm text-graphite-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Card */}
        <motion.div
          initial={{ opacity: 0, x: 60, y: 40 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-8 top-32 w-[380px] hidden lg:block"
        >
          <div className="card p-6 card-gold">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Brain size={20} className="text-gold" />
              </div>
              <div>
                <div className="text-sm font-semibold text-graphite">Pulse AI Insight</div>
                <div className="text-xs text-graphite-muted">Just now</div>
              </div>
            </div>
            <p className="text-sm text-graphite-soft leading-relaxed">
              &ldquo;3 of 12 goals in Engineering are trending below target. Recommend
              reallocating 15% weightage from completed objectives to at-risk items.&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="badge badge-rose text-xs">3 At Risk</div>
              <div className="badge badge-sage text-xs">5 On Track</div>
              <div className="badge badge-gold text-xs">4 Completed</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="card p-5 mt-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-graphite">Q1 Progress</span>
              <span className="metric-value text-sage text-sm">72%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="progress-fill bg-sage"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-graphite-muted">
              <span>13 of 18 goals on track</span>
              <span>28 days remaining</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 bg-white/50 border-t border-black/[0.03]">
        <div className="max-w-[1320px] mx-auto px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-outfit font-bold text-graphite mb-4">
              Built for High-Performance Teams
            </h2>
            <p className="text-graphite-muted text-lg max-w-xl mx-auto">
              Every feature designed to turn organizational alignment from an annual ritual into a continuous advantage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card p-7 group cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-ivory flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors duration-300">
                  <f.icon size={22} className="text-graphite-soft group-hover:text-gold transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-outfit font-semibold text-graphite mb-2">{f.title}</h3>
                <p className="text-sm text-graphite-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-black/[0.03]">
        <div className="max-w-[1320px] mx-auto px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-outfit font-bold text-graphite mb-4">
              Ready to align your organization?
            </h2>
            <p className="text-graphite-muted mb-8">
              Sign in with demo credentials to explore the full platform.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/login" className="btn-gold text-base px-10 py-3">
                Launch ALIGN <ArrowRight size={18} />
              </Link>
              <div className="flex items-center gap-6 mt-4 text-sm text-graphite-muted">
                <code className="px-3 py-1 rounded-lg bg-ivory-warm font-mono text-xs">employee@align.io</code>
                <code className="px-3 py-1 rounded-lg bg-ivory-warm font-mono text-xs">manager@align.io</code>
                <code className="px-3 py-1 rounded-lg bg-ivory-warm font-mono text-xs">admin@align.io</code>
              </div>
              <span className="text-xs text-slate">Password: demo123</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/[0.03] py-8">
        <div className="max-w-[1320px] mx-auto px-8 flex items-center justify-between text-sm text-graphite-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-graphite flex items-center justify-center">
              <span className="text-white font-outfit font-bold text-[10px]">A</span>
            </div>
            <span className="font-outfit font-medium text-graphite">ALIGN</span>
          </div>
          <span>AtomQuest Hackathon 2025 • Built with precision</span>
        </div>
      </footer>
    </div>
  );
}
