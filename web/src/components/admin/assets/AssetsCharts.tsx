import { Lock, Clock, Wallet } from "lucide-react";

export function AssetsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-4 mb-5">
      {/* 1. Assets Value Trend */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-white">Assets Value Trend</h3>
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card-elevated p-1">
            <button className="rounded px-2.5 py-1 text-[10px] font-medium bg-purple text-white transition">7D</button>
            <button className="rounded px-2.5 py-1 text-[10px] font-medium text-muted hover:text-white transition">30D</button>
            <button className="rounded px-2.5 py-1 text-[10px] font-medium text-muted hover:text-white transition">90D</button>
            <button className="rounded px-2.5 py-1 text-[10px] font-medium text-muted hover:text-white transition">1Y</button>
          </div>
        </div>
        
        {/* Mock Chart Area */}
        <div className="relative flex-1 min-h-[220px] mt-2">
          {/* Y Axis Grid */}
          <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-muted-2">
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$300K</span>
            </div>
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$250K</span>
            </div>
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$200K</span>
            </div>
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$150K</span>
            </div>
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$100K</span>
            </div>
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$50K</span>
            </div>
            <div className="flex items-center gap-3 w-full border-b border-border/30 pb-1">
              <span className="w-8 text-right">$0</span>
            </div>
          </div>
          
          {/* SVG Line */}
          <div className="absolute inset-0 left-12 bottom-6">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <path 
                d="M 0,80 Q 5,75 10,70 T 20,60 T 30,55 T 40,40 T 50,45 T 60,35 T 70,30 T 80,20 T 90,15 T 100,5" 
                fill="none" 
                stroke="#7B2CFF" 
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <path 
                d="M 0,100 L 0,80 Q 5,75 10,70 T 20,60 T 30,55 T 40,40 T 50,45 T 60,35 T 70,30 T 80,20 T 90,15 T 100,5 L 100,100 Z" 
                fill="url(#trend-gradient)" 
                opacity="0.2"
              />
              <defs>
                <linearGradient id="trend-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7B2CFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7B2CFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Data points */}
              <circle cx="0" cy="80" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="10" cy="70" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="20" cy="60" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="30" cy="55" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="40" cy="40" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="50" cy="45" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="60" cy="35" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="70" cy="30" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="80" cy="20" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="90" cy="15" r="3" fill="#18181B" stroke="#7B2CFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="100" cy="5" r="4" fill="#7B2CFF" className="shadow-[0_0_10px_#7B2CFF]" vectorEffect="non-scaling-stroke" />
            </svg>
            
            {/* Tooltip mockup at cx=40 */}
            <div className="absolute left-[34%] top-[25%] -translate-x-1/2 -translate-y-full mb-2 z-10">
              <div className="bg-card-elevated border border-border/80 shadow-xl rounded-lg py-1.5 px-3 text-center min-w-[100px]">
                <p className="text-[9px] text-muted-2">May 15, 2024</p>
                <p className="text-xs font-bold text-white">$218,540.50</p>
              </div>
              <div className="w-0.5 h-full absolute left-1/2 -translate-x-1/2 top-full bg-border border-dashed -z-10 bottom-0 pointer-events-none" style={{ height: '70px' }}></div>
            </div>
          </div>
          
          {/* X Axis labels */}
          <div className="absolute bottom-0 left-12 right-0 flex justify-between text-[9px] text-muted-2 translate-y-full pt-2">
            <span>May 12</span>
            <span>May 13</span>
            <span>May 14</span>
            <span>May 15</span>
            <span>May 16</span>
            <span>May 17</span>
            <span>May 18</span>
          </div>
        </div>
      </div>

      {/* 2. Asset Distribution */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col relative overflow-hidden">
        <h3 className="text-[13px] font-semibold text-white mb-6">Asset Distribution</h3>
        
        <div className="flex-1 flex items-center justify-between">
          {/* SVG Donut Chart Placeholder */}
          <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* USDT 80.8% - Blue */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563EB" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="48" className="transition-all duration-500 hover:stroke-blue-500 hover:stroke-[22px] cursor-pointer" />
              {/* VIP 1 7.6% - Yellow */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EAB308" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="232" transform="rotate(290 50 50)" className="transition-all duration-500 cursor-pointer" />
              {/* VIP 2 5.0% - Emerald */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="238.6" transform="rotate(318 50 50)" className="transition-all duration-500 cursor-pointer" />
              {/* VIP 3 3.6% - Pink */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EC4899" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="242.1" transform="rotate(336 50 50)" className="transition-all duration-500 cursor-pointer" />
              {/* Others 3.0% - Purple */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="243.6" transform="rotate(349 50 50)" className="transition-all duration-500 cursor-pointer" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-muted-2">Total</span>
              <span className="text-[13px] font-bold text-white tracking-tight">$245,678.90</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 flex flex-col gap-3 pl-6">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span><span className="text-white">USDT</span></div>
              <div className="flex items-center gap-2.5"><span className="text-white font-medium">$198,450.25</span><span className="text-muted-2 w-7 text-right">80.8%</span></div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-white">VIP 1</span></div>
              <div className="flex items-center gap-2.5"><span className="text-white font-medium">$18,750.00</span><span className="text-muted-2 w-7 text-right">7.6%</span></div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-white">VIP 2</span></div>
              <div className="flex items-center gap-2.5"><span className="text-white font-medium">$12,345.50</span><span className="text-muted-2 w-7 text-right">5.0%</span></div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500"></span><span className="text-white">VIP 3</span></div>
              <div className="flex items-center gap-2.5"><span className="text-white font-medium">$8,765.25</span><span className="text-muted-2 w-7 text-right">3.6%</span></div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-white">Others</span></div>
              <div className="flex items-center gap-2.5"><span className="text-white font-medium">$7,367.90</span><span className="text-muted-2 w-7 text-right">3.0%</span></div>
            </div>
          </div>
        </div>
        
        <button className="mt-4 text-[11px] text-purple-bright hover:text-purple transition text-left inline-flex items-center gap-1 font-medium">
          View full breakdown &rarr;
        </button>
      </div>

      {/* 3. Asset Summary */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-white mb-5">Asset Summary</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 border border-teal-500/20 text-teal-400">
                <span className="font-bold text-[13px]">₮</span>
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Available Balance</p>
                <p className="text-sm font-semibold text-white">$245,678.90</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Locked Assets</p>
                <p className="text-sm font-semibold text-white">$12,345.67</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/20 text-sky-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">In Orders / Pending</p>
                <p className="text-sm font-semibold text-white">$7,890.12</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple/15 border border-purple-bright/20 text-purple-bright">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-2">Total Wallets</p>
                <p className="text-sm font-semibold text-white">1,342</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full mt-5 rounded-xl bg-purple hover:bg-purple-bright py-2.5 text-xs font-semibold text-white transition shadow-[0_8px_20px_rgba(123,44,255,0.25)]">
          View All Wallets
        </button>
      </div>
    </div>
  );
}
