"use client";

import { useState } from "react";
import { Users, DollarSign, UserPlus, TrendingUp, Gift, Activity, PlayCircle } from "lucide-react";

type UserNode = {
  id: string;
  name: string;
  deposit: number;
  parentId: string | "ambassador";
  totalEarned: number; // Tracks cumulative 10% daily returns
  role: "user" | "ambassador";
};

export function ReferralSimulator() {
  const [nodes, setNodes] = useState<UserNode[]>([]);
  const [nextId, setNextId] = useState(1);
  const [newUserName, setNewUserName] = useState("User 1");
  const [newDeposit, setNewDeposit] = useState(10);
  const [selectedParent, setSelectedParent] = useState<string>("ambassador");
  const [newUserRole, setNewUserRole] = useState<"user" | "ambassador">("user");

  // Time-stepped simulation state
  const [currentDay, setCurrentDay] = useState(0);
  const [totalAmbassadorEarned, setTotalAmbassadorEarned] = useState(0);
  const [totalAdminEarned, setTotalAdminEarned] = useState(0);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newNode: UserNode = {
      id: `u${nextId}`,
      name: newUserName || `User ${nextId}`,
      deposit: Number(newDeposit),
      parentId: selectedParent,
      totalEarned: 0,
      role: newUserRole,
    };
    setNodes([...nodes, newNode]);
    setNextId(nextId + 1);
    setNewUserName(`User ${nextId + 1}`);
    setNewUserRole("user");
  };

  const handleReset = () => {
    setNodes([]);
    setNextId(1);
    setNewUserName("User 1");
    setNewUserRole("user");
    setCurrentDay(0);
    setTotalAmbassadorEarned(0);
    setTotalAdminEarned(0);
  };

  const handleLoadExample = () => {
    setNodes([
      { id: "u1", name: "User 1", deposit: 1000, parentId: "ambassador", totalEarned: 0, role: "user" },
      { id: "u2", name: "User 2", deposit: 500, parentId: "u1", totalEarned: 0, role: "ambassador" },
      { id: "u3", name: "User 3", deposit: 100, parentId: "u2", totalEarned: 0, role: "user" },
    ]);
    setNextId(4);
    setNewUserName("User 4");
    setNewUserRole("user");
    setCurrentDay(0);
    setTotalAmbassadorEarned(0);
    setTotalAdminEarned(0);
  };

  const handleNextDay = () => {
    const currentTotalDeposits = nodes.reduce((sum, node) => sum + node.deposit, 0);
    
    // Admin and Ambassador earn 5% of total deposits currently in the tree
    setTotalAmbassadorEarned(prev => prev + (currentTotalDeposits * 0.05));
    setTotalAdminEarned(prev => prev + (currentTotalDeposits * 0.05));
    
    // Each user earns 10% of their own deposit
    setNodes(prevNodes => prevNodes.map(node => ({
      ...node,
      totalEarned: node.totalEarned + (node.deposit * 0.1)
    })));
    
    setCurrentDay(prev => prev + 1);
  };

  // Calculations
  const totalDeposits = nodes.reduce((sum, node) => sum + node.deposit, 0);
  
  // Projected daily calculations (for reference/info, not accumulated yet)
  const currentTotalUserDaily = totalDeposits * 0.1;
  const currentAmbassadorDaily = totalDeposits * 0.05;
  const currentAdminDaily = totalDeposits * 0.05;

  // Cumulative tracking for all users combined
  const totalUserAccumulated = nodes.reduce((sum, node) => sum + node.totalEarned, 0);

  // One-time Commissions (10% to direct inviter)
  // These are paid out immediately when the user is added to the tree.
  const calculateOneTimeCommissions = () => {
    const commissions: Record<string, number> = {};
    nodes.forEach(node => {
      // Direct inviters (including the Ambassador) get 10% of this node's deposit
      commissions[node.parentId] = (commissions[node.parentId] || 0) + (node.deposit * 0.1);
    });
    return commissions;
  };

  const oneTimeCommissions = calculateOneTimeCommissions();
  const totalOneTimePaid = Object.values(oneTimeCommissions).reduce((a, b) => a + b, 0);

  // Get children for rendering the tree
  const getChildren = (parentId: string) => nodes.filter(n => n.parentId === parentId);

  const renderNode = (node: UserNode, level: number = 0) => {
    const children = getChildren(node.id);
    const oneTimeEarned = oneTimeCommissions[node.id] || 0;

    return (
      <div key={node.id} className="mt-3 relative">
        {level > 0 && (
          <div className="absolute -left-6 top-6 h-full w-px bg-border"></div>
        )}
        <div className="relative z-10 flex flex-col gap-2 rounded-xl border border-border bg-bg-deep/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-xs font-semibold text-sky-400 border border-sky-500/20">
                {node.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{node.name}</p>
                  {node.role === "ambassador" && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-400">
                      Ambassador
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-2">Level {level + 1}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-2 uppercase tracking-wide">Deposit</p>
              <p className="text-sm font-bold text-white">${node.deposit.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.05] pt-3">
            <div>
              <p className="text-[10px] text-muted-2 uppercase tracking-wide">Cumul. Return (10%/day)</p>
              <p className="text-sm font-bold text-purple-bright">${node.totalEarned.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-2 uppercase tracking-wide">One-Time Ref. Bonus</p>
              <p className="text-sm font-bold text-amber-400">+${oneTimeEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {children.length > 0 && (
          <div className="ml-6 pl-4 border-l border-border relative">
            <div className="absolute -left-px top-0 h-4 w-4 rounded-bl-xl border-b border-l border-border"></div>
            {children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const ambassadorChildren = getChildren("ambassador");
  const ambassadorOneTime = oneTimeCommissions["ambassador"] || 0;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Time-Stepped Action Bar */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-purple-bright/30 bg-purple/10 p-6 sm:flex-row sm:items-center sm:justify-between shadow-[0_4px_25px_rgba(123,44,255,0.15)]">
        <div>
          <h2 className="text-xl font-bold text-white">Day {currentDay}</h2>
          <p className="text-sm text-purple-bright mt-1 font-medium">
            Projected Daily Volume: <span className="text-white">${totalDeposits > 0 ? (totalDeposits * 0.2).toLocaleString() : 0}</span> (Total 20% distribution)
          </p>
        </div>
        <button
          onClick={handleNextDay}
          disabled={nodes.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(123,44,255,0.4)] transition hover:bg-purple-bright disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle className="h-5 w-5" />
          Execute Trade (Next Day)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
        {/* Left Column: Controls */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card-elevated p-5 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-purple-bright" />
              Register New User
            </h2>
            <p className="mt-1 text-xs text-muted-2 mb-4">Add a user to the simulation tree. Returns start at $0.</p>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-2">User Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg-deep/50 px-3 py-2 text-sm text-white outline-none focus:border-purple-bright/50"
                />
              </div>
              
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-2">Initial Deposit ($)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newDeposit}
                  onChange={(e) => setNewDeposit(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-bg-deep/50 px-3 py-2 text-sm text-white outline-none focus:border-purple-bright/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-2">Invited By</label>
                <select
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg-deep/50 px-3 py-2 text-sm text-white outline-none focus:border-purple-bright/50"
                >
                  <option value="ambassador">Original Ambassador</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-2">User Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as "user" | "ambassador")}
                  className="w-full rounded-xl border border-border bg-bg-deep/50 px-3 py-2 text-sm text-white outline-none focus:border-purple-bright/50"
                >
                  <option value="user">Standard User</option>
                  <option value="ambassador">Ambassador</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04] mt-2"
              >
                Register User
              </button>
            </form>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleLoadExample}
                className="flex-1 rounded-xl border border-purple-bright/40 bg-purple/10 px-3 py-2 text-xs font-semibold text-purple-bright hover:bg-purple/20 transition"
              >
                Load Example
              </button>
              {(nodes.length > 0 || currentDay > 0) && (
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-xl border border-border bg-transparent px-3 py-2 text-xs font-semibold text-muted hover:text-white hover:bg-white/[0.04] transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card-elevated p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-3">Time-Stepped Logic</h3>
            <ul className="space-y-2 text-[11px] text-muted-2">
              <li className="flex items-start gap-2">
                <Activity className="h-3.5 w-3.5 text-purple-bright shrink-0 mt-0.5" />
                <span><strong className="text-white">10% Daily</strong> accumulates for the User each time you click "Execute Trade".</span>
              </li>
              <li className="flex items-start gap-2">
                <Activity className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">5% Daily</strong> accumulates for the Original Ambassador each trade.</span>
              </li>
              <li className="flex items-start gap-2">
                <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">5% Daily</strong> accumulates for the Admin each trade.</span>
              </li>
              <li className="flex items-start gap-2">
                <Gift className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">10% One-Time</strong> is paid out to the direct inviter *instantly* upon registration (does not require a trade).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Visuals */}
        <div className="flex flex-col gap-6">
          {/* Cumulative Revenue Breakdown */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <p className="text-[10px] font-medium text-muted-2 uppercase tracking-wider">Total Deposits</p>
              <p className="mt-1 text-lg font-bold text-white">${totalDeposits.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-purple-bright/30 bg-purple/10 p-4 shadow-[0_2px_15px_rgba(123,44,255,0.15)]">
              <p className="text-[10px] font-medium text-purple-bright uppercase tracking-wider">Net Platform Revenue</p>
              <p className={`mt-1 text-lg font-bold ${(totalAmbassadorEarned + totalAdminEarned) - totalOneTimePaid < 0 ? 'text-rose-400' : 'text-white'}`}>
                ${((totalAmbassadorEarned + totalAdminEarned) - totalOneTimePaid).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 shadow-[0_2px_15px_rgba(244,63,94,0.1)]">
              <p className="text-[10px] font-medium text-rose-400 uppercase tracking-wider">One-Time Comm. (Paid)</p>
              <p className="mt-1 text-lg font-bold text-rose-400">-${totalOneTimePaid.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <p className="text-[10px] font-medium text-muted-2 uppercase tracking-wider">Cumul. User (10%)</p>
              <p className="mt-1 text-lg font-bold text-purple-bright">${totalUserAccumulated.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <p className="text-[10px] font-medium text-muted-2 uppercase tracking-wider">Cumul. Ambassador (5%)</p>
              <p className="mt-1 text-lg font-bold text-amber-400">${totalAmbassadorEarned.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <p className="text-[10px] font-medium text-muted-2 uppercase tracking-wider">Cumul. Admin (5%)</p>
              <p className="mt-1 text-lg font-bold text-emerald-400">${totalAdminEarned.toLocaleString()}</p>
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="flex-1 rounded-xl border border-border bg-card-elevated p-6 shadow-sm overflow-auto">
            <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-bright" />
              Downline Tree
            </h2>
            
            <div className="max-w-2xl">
              {/* The Ambassador Root */}
              <div className="relative z-10 flex flex-col gap-2 rounded-xl border border-purple-bright/50 bg-purple/10 p-4 shadow-[0_4px_20px_rgba(123,44,255,0.15)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple text-sm font-bold text-white">
                      AMB
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Original Ambassador</p>
                      <p className="text-xs text-purple-bright">Root Node</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-purple-bright/70 uppercase tracking-wide">Cumul. Return (5%)</p>
                    <p className="text-sm font-bold text-amber-400">${totalAmbassadorEarned.toLocaleString()}</p>
                    {ambassadorOneTime > 0 && (
                      <p className="text-[10px] text-amber-400/80 mt-1 uppercase">
                        +${ambassadorOneTime.toLocaleString()} Ref. Bonus
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {ambassadorChildren.length > 0 ? (
                <div className="ml-6 pl-4 border-l border-border relative mt-3">
                  <div className="absolute -left-px top-0 h-4 w-4 rounded-bl-xl border-b border-l border-border"></div>
                  {ambassadorChildren.map(child => renderNode(child, 0))}
                </div>
              ) : (
                <div className="mt-8 text-center text-sm text-muted-2">
                  No users in the downline yet. Register a user to start the simulation!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
