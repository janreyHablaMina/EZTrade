export type RowStatus = "Active" | "Inactive" | "Suspended" | "Pending" | "Verified" | "Rejected";
export type KycStatus = "Verified" | "Not Verified" | "Pending" | "Rejected";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: RowStatus;
  kycStatus: KycStatus;
  role: "User" | "Ambassador" | "Admin" | "System";
  vipLevel: string;
  deposited: number;
  withdrawn: number;
  earnings: number;
  pendingDeposit: number;
  registeredAt: string;
  referralCode?: string;
  teamSize: number;
  downlineCount: number;
  totalDownlineAssets: number;
  dailyEarnings: number;
  dailyProfit?: number;
  cutPercent?: number;
  withdrawal_password?: string;
}

export interface VipPlan {
  id: string;
  level: string | number;
  planName?: string;
  name?: string;
  price?: number;
  minDeposit: number;
  maxDeposit: number | string;
  dailyEarnings?: number;
  dailyProfitPercent: number;
  dailyProfitUsdtMin: number;
  dailyProfitUsdtMax?: number;
  durationDays: number;
  validityDays?: number;
  totalRevenue?: number;
  status: "Active" | "Inactive";
  usersCount?: number;
  totalUsers: number;
  description?: string;
  referralBonus?: {
    level1: number;
    level2: number;
    level3: number;
  };
}

export interface TransactionRecord {
  id: string;
  dbId?: string | number;
  type: "Deposit" | "Withdrawal" | "Transfer" | "Earning" | "Bonus" | "Trade" | "Referral";
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  network: string;
  status: "Completed" | "Pending" | "Failed" | "Approved" | "Rejected";
  date?: string;
  dateTime: string;
  txHash?: string;
  referenceTxid: string;
  description?: string;
  timestamp?: number;
}

export interface DepositRecord {
  id: string;
  user?: {
    name: string;
    email: string;
    avatarInitials: string;
  };
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  network: string;
  txid: string;
  status: string;
  timestamp: string;
  statusTime?: string;
  submittedAt?: string;
}

export interface WithdrawalRequest {
  id: string;
  user?: {
    name: string;
    email: string;
    avatarInitials: string;
  };
  userName: string;
  userEmail: string;
  amount: number;
  fee: number;
  receiveAmount: number;
  currency: string;
  network: string;
  walletAddress: string;
  status: string;
  timestamp: string;
  requestedAt?: string;
}

export interface EarningRecord {
  id: string;
  user?: {
    name: string;
    email: string;
    avatarInitials: string;
    vipLevel: string;
  };
  userName: string;
  userEmail: string;
  vipLevel: string;
  type: string;
  source: string;
  amount: number; // Gross amount
  userCut: number;
  adminCut: number;
  ambassadorCut: number;
  currency: string;
  network: string;
  description: string;
  timestamp: string;
  dateTime: string;
  status: string;
}

export interface ReferralRecord {
  id: string;
  referrer?: {
    name: string;
    email: string;
    avatarInitials: string;
  };
  referred?: {
    name: string;
    email: string;
    avatarInitials: string;
  };
  userName: string;
  userEmail: string;
  vipLevel: string;
  level: string;
  commission: number;
  yourCommission: number;
  status: string;
  commissionStatus: string;
  timestamp: string;
  registeredAt: string;
  totalDeposited: number;
  totalEarnings: number;
  totalBonusGiven?: number;
  ambassadorDeduction?: number;
}

export type NotificationCategory =
  | "System"
  | "Account"
  | "Transaction"
  | "Earnings"
  | "Security"
  | "Referral"
  | "Promotion";

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  iconType: "deposit" | "vip" | "earnings" | "security" | "withdrawal" | "referral-join" | "referral-bonus" | "system" | "promotion";
  dateTime: string;
  isRead: boolean;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: string;
    avatarInitials: string;
  };
  action: string;
  resource: string;
  ipAddress: string;
  status: "Success" | "Warning" | "Failed";
  details?: string;
}

export const vipBadgeStyles: Record<string, string> = {
  "VIP 1": "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  "VIP 2": "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  "VIP 3": "bg-purple/20 text-purple-bright border border-purple-bright/30",
  "VIP 4": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  "VIP 5": "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  "VIP 6": "bg-gradient-to-r from-amber-400/20 to-yellow-300/20 text-yellow-300 border border-yellow-400/30",
  "VIP-1": "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  "VIP-2": "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  "VIP-3": "bg-purple/20 text-purple-bright border border-purple-bright/30",
  "VIP-4": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  "VIP-5": "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  "VIP-6": "bg-gradient-to-r from-amber-400/20 to-yellow-300/20 text-yellow-300 border border-yellow-400/30",
  "None": "bg-gray-500/15 text-gray-400 border border-gray-500/25",
  "1": "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  "2": "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  "3": "bg-purple/20 text-purple-bright border border-purple-bright/30",
  "4": "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  "5": "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  "6": "bg-gradient-to-r from-amber-400/20 to-yellow-300/20 text-yellow-300 border border-yellow-400/30",
};

export const categoryBadgeStyles: Record<string, string> = {
  System: "bg-gray-500/15 text-gray-400 border border-gray-500/25",
  Account: "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  Transaction: "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  Earnings: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Security: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  Referral: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  Promotion: "bg-purple/15 text-purple-bright border border-purple-bright/25",
};
