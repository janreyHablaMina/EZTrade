import Link from "next/link";
import { Download, Shield, Zap, Globe, Crown, ArrowRight, TrendingUp, BarChart3, Lock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-deep text-white font-sans selection:bg-purple/30 flex flex-col overflow-x-hidden">
      
      {/* Top Ticker Marquee */}
      <div className="bg-bg-deep border-b border-white/[0.05] overflow-hidden whitespace-nowrap py-2 flex relative">
        <div className="animate-[marquee_20s_linear_infinite] flex gap-12 text-[11px] font-mono tracking-wider font-semibold">
          {[...Array(2)].map((_, j) => (
            <div key={j} className="flex gap-12 shrink-0">
              <span className="flex items-center gap-2">BTC/USDT <span className="text-success">+2.45%</span> $64,231.00</span>
              <span className="flex items-center gap-2">ETH/USDT <span className="text-success">+1.82%</span> $3,452.12</span>
              <span className="flex items-center gap-2">SOL/USDT <span className="text-danger">-0.54%</span> $142.60</span>
              <span className="flex items-center gap-2">BNB/USDT <span className="text-success">+0.21%</span> $592.40</span>
              <span className="flex items-center gap-2">XRP/USDT <span className="text-success">+5.10%</span> $0.62</span>
              <span className="flex items-center gap-2">DOGE/USDT <span className="text-danger">-1.20%</span> $0.15</span>
              <span className="flex items-center gap-2">ADA/USDT <span className="text-success">+0.88%</span> $0.45</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-xl sticky top-0 z-50 border-b border-border/50 bg-bg-deep/70">
        <div className="flex items-center gap-3">
          <BrandLogo size={40} className="drop-shadow-[0_0_15px_rgba(123,44,255,0.3)]" />
          <span className="text-xl font-bold tracking-[0.18em]">EZTRADE</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/releases/app.apk"
            download
            className="hidden sm:flex items-center gap-2 rounded-xl bg-purple px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(123,44,255,0.3)] transition hover:bg-purple-bright hover:shadow-[0_8px_20px_rgba(123,44,255,0.45)] hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            Download App
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-1 flex-col lg:flex-row items-center justify-between px-6 py-20 lg:px-12 lg:py-32 max-w-7xl mx-auto w-full">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-purple/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        {/* Left Content */}
        <div className="relative z-10 max-w-2xl text-center lg:text-left flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-bright/30 bg-purple/10 px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-purple-bright tracking-wider uppercase">v2.0 Now Available</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl leading-tight">
            The Next Generation of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-bright to-blue-400">Crypto Trading</span>
          </h1>
          <p className="mt-6 text-lg text-muted sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
            Experience lightning-fast execution, military-grade security, and premium VIP plans designed to maximize your earning potential.
          </p>
          
          <div className="mt-10 flex flex-col items-center lg:items-start gap-4 sm:flex-row">
            <a
              href="/releases/app.apk"
              download
              className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-bg-deep transition duration-300 hover:bg-gray-200 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              <Download className="h-5 w-5" />
              Download for Android
            </a>
            <a href="#features" className="group flex items-center gap-2 px-6 py-4 text-sm font-bold text-muted-2 transition hover:text-white">
              Explore Features <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-white/[0.05] pt-8">
            <div>
              <p className="text-3xl font-black text-white">$2B+</p>
              <p className="text-xs font-medium text-muted uppercase tracking-wider mt-1">Quarterly Volume</p>
            </div>
            <div className="w-px h-10 bg-white/[0.1]" />
            <div>
              <p className="text-3xl font-black text-white">0.01s</p>
              <p className="text-xs font-medium text-muted uppercase tracking-wider mt-1">Execution Speed</p>
            </div>
          </div>
        </div>

        {/* Right Mockup (CSS only, much cleaner) */}
        <div className="relative z-10 hidden lg:block flex-1 pl-12 mt-12 lg:mt-0">
          <div className="relative animate-[float_6s_ease-in-out_infinite] w-[350px] ml-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-bright/30 to-blue-500/30 rounded-[2.5rem] blur-3xl -z-10" />
            
            {/* Phone/Card Frame */}
            <div className="relative rounded-[2.5rem] border border-white/[0.1] bg-bg-deep/80 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Top Bar */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-purple/10 flex items-center justify-center">
                    <BrandLogo size={20} className="opacity-90" />
                  </div>
                  <span className="font-bold text-sm tracking-widest text-white/90">EZTRADE</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Balance */}
              <div className="mb-8">
                <p className="text-xs text-muted mb-1 uppercase tracking-wider font-semibold">Total Balance</p>
                <p className="text-4xl font-black text-white">$45,231.89</p>
                <p className="text-xs text-success font-bold mt-1 flex items-center gap-1">+ $1,240.50 Today</p>
              </div>

              {/* Chart (Mock) */}
              <div className="h-32 w-full border-b border-border/50 mb-6 flex items-end justify-between gap-1 pb-2">
                {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                  <div key={i} className="w-full bg-gradient-to-t from-purple-bright to-blue-400 rounded-t-sm opacity-80 transition-all hover:opacity-100 cursor-pointer" style={{ height: `${h}%` }} />
                ))}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple hover:bg-purple-bright transition cursor-pointer text-center py-3 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(123,44,255,0.3)]">Buy</div>
                <div className="bg-white/[0.05] hover:bg-white/[0.1] transition cursor-pointer text-center py-3 rounded-xl font-bold text-sm border border-white/[0.05]">Sell</div>
              </div>
            </div>

            {/* Floating Element 1 */}
            <div className="absolute -left-12 top-20 rounded-2xl border border-white/[0.05] bg-card/60 backdrop-blur-xl p-4 shadow-2xl animate-[float_4s_ease-in-out_infinite_reverse]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xl">₿</div>
                <div>
                  <p className="text-xs font-bold text-white">BTC/USDT</p>
                  <p className="text-[10px] text-success font-bold">+2.45%</p>
                </div>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div className="absolute -right-8 bottom-24 rounded-2xl border border-white/[0.05] bg-card/60 backdrop-blur-xl p-4 shadow-2xl animate-[float_5s_ease-in-out_infinite]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">₮</div>
                <div>
                  <p className="text-xs font-bold text-white">USDT</p>
                  <p className="text-[10px] text-muted-2 font-bold">Tether</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 bg-bg-deep/50 border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-16">Built for the <span className="text-purple-bright">Modern Trader</span></h2>
          
          <div className="grid gap-8 sm:grid-cols-3 text-left">
            <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.05] bg-card/40 p-8 backdrop-blur-md transition duration-300 hover:bg-card/80 hover:border-white/[0.1] hover:-translate-y-1 shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/20 text-purple-bright">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Lightning Fast Engine</h3>
              <p className="text-sm text-muted leading-relaxed">Execute trades in milliseconds with our highly optimized matching engine and deep liquidity pools. Never miss an opportunity.</p>
            </div>
            
            <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.05] bg-card/40 p-8 backdrop-blur-md transition duration-300 hover:bg-card/80 hover:border-white/[0.1] hover:-translate-y-1 shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Bank-Grade Security</h3>
              <p className="text-sm text-muted leading-relaxed">Your assets are protected by industry-leading security protocols, end-to-end encryption, and offline cold storage.</p>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.05] bg-card/40 p-8 backdrop-blur-md transition duration-300 hover:bg-card/80 hover:border-white/[0.1] hover:-translate-y-1 shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <BarChart3 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Advanced Analytics</h3>
              <p className="text-sm text-muted leading-relaxed">Access professional-grade charting tools, real-time market data, and deep portfolio analysis directly from your phone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Plans Teaser */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[1000px] rounded-full bg-purple/10 blur-[150px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-purple/20 text-purple-bright mb-6 shadow-[0_0_30px_rgba(123,44,255,0.3)]">
            <Crown className="h-8 w-8" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">VIP Plans</span></h2>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-16">
            Upgrade your account to unlock higher daily limits, premium support, and exclusive daily ROI rewards. Let your assets work for you.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto text-left">
            {/* Silver */}
            <div className="rounded-3xl border border-white/[0.08] bg-card/60 p-8 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-gray-300 relative z-10">Silver</h3>
              <p className="text-4xl font-black text-white my-4 relative z-10">2.5% <span className="text-sm text-muted font-medium">Daily ROI</span></p>
              <ul className="text-sm text-muted space-y-3 mt-8 relative z-10">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-bright" /> Min Deposit: $100</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-bright" /> Max Deposit: $999</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-bright" /> Standard Support</li>
              </ul>
            </div>
            
            {/* Gold */}
            <div className="rounded-3xl border border-amber-500/30 bg-card/80 p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.15)] transform sm:-translate-y-4">
              <div className="absolute top-0 right-0 bg-amber-500 text-bg-deep text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl z-10">Most Popular</div>
              <h3 className="text-xl font-bold text-amber-400 relative z-10">Gold</h3>
              <p className="text-4xl font-black text-white my-4 relative z-10">4.0% <span className="text-sm text-muted font-medium">Daily ROI</span></p>
              <ul className="text-sm text-muted space-y-3 mt-8 relative z-10">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Min Deposit: $1,000</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Max Deposit: $4,999</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Priority Support</li>
              </ul>
            </div>

            {/* Platinum */}
            <div className="rounded-3xl border border-white/[0.08] bg-card/60 p-8 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-bold text-cyan-300 relative z-10">Platinum</h3>
              <p className="text-4xl font-black text-white my-4 relative z-10">6.5% <span className="text-sm text-muted font-medium">Daily ROI</span></p>
              <ul className="text-sm text-muted space-y-3 mt-8 relative z-10">
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Min Deposit: $5,000</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Unlimited Deposit</li>
                <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> 24/7 Dedicated Agent</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 border-t border-white/[0.05] bg-gradient-to-b from-card to-bg-deep py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Ready to Start Trading?</h2>
          <p className="text-lg text-muted mb-10">Download the app now and join thousands of users maximizing their portfolio with EZTrade.</p>
          <a
            href="/releases/app.apk"
            download
            className="inline-flex items-center gap-3 rounded-2xl bg-purple px-10 py-5 text-lg font-bold text-white shadow-[0_10px_40px_rgba(123,44,255,0.4)] transition hover:bg-purple-bright hover:shadow-[0_10px_40px_rgba(123,44,255,0.6)] hover:-translate-y-1"
          >
            <Download className="h-6 w-6" />
            Download APK Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 text-center bg-bg-deep relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BrandLogo size={24} className="opacity-50" />
          <span className="font-bold tracking-widest text-muted-2 text-sm">EZTRADE</span>
        </div>
        <p className="text-xs text-muted-2">© {new Date().getFullYear()} EZTrade Official. All rights reserved.</p>
      </footer>
    </div>
  );
}
