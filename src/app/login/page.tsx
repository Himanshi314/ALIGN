"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

const roles = [
  { email: "employee@align.io", label: "Employee", name: "Rahul Kapoor" },
  { email: "manager@align.io", label: "Manager", name: "Priya Sharma" },
  { email: "admin@align.io", label: "Admin", name: "Arjun Mehta" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) { setError("Invalid email or password"); setLoading(false); return; }
      const role = roles.find((r) => r.email === email);
      if (role?.label === "Admin") router.push("/admin");
      else if (role?.label === "Manager") router.push("/manager");
      else router.push("/employee");
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-graphite text-white p-12">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-20">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="font-outfit font-bold text-sm">A</span>
            </div>
            <span className="font-outfit font-semibold text-xl tracking-tight">ALIGN</span>
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-outfit font-bold leading-tight mb-4">
              Strategic alignment,<br /><span className="text-gold">made measurable.</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Set goals with precision. Track progress with clarity. Leverage AI-powered insights.
            </p>
          </motion.div>
        </div>
        <div className="text-white/30 text-xs">AtomQuest Hackathon 2025</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px]">
          <h1 className="text-2xl font-outfit font-bold text-graphite mb-2">Welcome back</h1>
          <p className="text-graphite-muted text-sm mb-8">Sign in to your performance command center</p>

          <div className="mb-8">
            <label className="label">Quick Access</label>
            <div className="flex gap-2">
              {roles.map((r) => (
                <button key={r.email} onClick={() => { setEmail(r.email); setPassword("demo123"); }}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    email === r.email ? "border-gold bg-gold/5 text-gold-dark" : "border-black/[0.06] text-graphite-soft hover:border-gold/40"
                  }`}>
                  <div className="font-semibold">{r.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{r.name}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@align.io" className="input" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input pr-10" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-graphite-soft">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-rose text-sm bg-rose/5 px-4 py-2.5 rounded-xl">
                <AlertCircle size={14} />{error}
              </motion.div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>
          <p className="text-center text-xs text-slate mt-6">Password: <code className="font-mono bg-ivory-warm px-2 py-0.5 rounded">demo123</code></p>
        </motion.div>
      </div>
    </div>
  );
}
