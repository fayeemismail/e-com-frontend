"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (email === "admin@ecom.com" && password === "admin123") {
      sessionStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#9a9a94] mb-1">Administration</p>
          <h1 className="text-2xl font-light font-serif tracking-[0.18em] uppercase text-[#1a1a1a]">E-com</h1>
        </div>

        <div className="bg-white border border-[#e8e6e2] p-8">
          <h2 className="text-[12px] tracking-[0.12em] uppercase text-[#1a1a1a] mb-6 font-light">
            Sign in to continue
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@ecom.com"
                className="w-full border border-[#e8e6e2] px-3 py-3 text-[12px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#ccc]"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full border border-[#e8e6e2] px-3 py-3 pr-10 text-[12px] text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#ccc] tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((o) => !o)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#9a9a94] hover:text-[#1a1a1a] transition-colors p-0"
                  aria-label={showPass ? "Hide" : "Show"}
                >
                  {showPass ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[11px] text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white text-[11px] tracking-[0.18em] uppercase py-3.5 hover:bg-[#333] transition-colors disabled:bg-[#9a9a94] disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={13} className="animate-spin" />Signing in...</> : "Sign In"}
            </button>
          </form>

          <p className="text-[10px] text-[#bbb] text-center mt-5 tracking-wide">
            Demo credentials: admin@ecom.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}