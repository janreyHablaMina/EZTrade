"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hexagon, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

// Inline Input component since we need custom styling for the icons
function LoginInput({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-2">
        <Icon className="h-4 w-4" />
      </div>
      <input
        className="w-full rounded-xl border border-border bg-bg-deep/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-muted-2/50 outline-none transition focus:border-purple-bright/50 focus:bg-white/[0.03] focus:ring-1 focus:ring-purple-bright/50 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-deep p-4 font-sans text-white selection:bg-purple/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[380px]">
        {/* Logo Header */}
        <div className="mb-8 flex flex-col items-center justify-center gap-3 text-center">
          <img src="/mobile-logo.png" alt="EZTrade Logo" className="h-14 w-14 rounded-2xl shadow-[0_0_30px_rgba(123,44,255,0.3)]" />
          <div>
            <h1 className="text-2xl font-bold tracking-[0.1em] mt-2">EZTRADE</h1>
            <p className="text-sm text-muted-2 mt-1">Admin Portal Access</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 ml-1 block text-xs font-medium text-muted-2">Email Address</label>
                <LoginInput 
                  icon={Mail}
                  type="email" 
                  placeholder="admin@eztrade.com" 
                  required 
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <div className="mb-1.5 ml-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-2">Password</label>
                  <a href="#" className="text-[10px] text-purple hover:text-purple-bright transition">Forgot?</a>
                </div>
                <LoginInput 
                  icon={Lock}
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-purple px-4 py-3 text-sm font-bold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.3)] hover:bg-purple-bright hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-muted-2 hover:text-white transition underline underline-offset-4">
              Return to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
