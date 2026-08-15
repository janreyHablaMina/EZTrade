export interface ReferralRecord {
  id: string;
  userName: string;
  userEmail: string;
  vipLevel: 1 | 2 | 3 | 4 | 5 | 6;
  status: "Active" | "Inactive";
  registeredAt: string;
  totalDeposited: number;
  totalEarnings: number;
  yourCommission: number;
  commissionStatus: "Paid" | "Pending" | "None";
}

export const vipLevelBadgeStyles: Record<number, string> = {
  1: "bg-sky-500/15 text-sky-400 border border-sky-500/25",
  2: "bg-purple/20 text-purple-bright border border-purple-bright/30",
  3: "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  4: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  5: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  6: "bg-gradient-to-r from-amber-400/20 to-yellow-300/20 text-yellow-300 border border-yellow-400/30",
};

export const statusBadgeStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Inactive: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export const commissionStatusBadgeStyles: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  None: "text-muted-2",
};

export const initialReferrals: ReferralRecord[] = [
  {
    id: "#RF1248",
    userName: "John Smith",
    userEmail: "johnsmith@gmail.com",
    vipLevel: 2,
    status: "Active",
    registeredAt: "May 18, 2024 10:45 AM",
    totalDeposited: 68.0,
    totalEarnings: 13.6,
    yourCommission: 1.36,
    commissionStatus: "Paid",
  },
  {
    id: "#RF1247",
    userName: "Maria Garcia",
    userEmail: "mariagarcia@gmail.com",
    vipLevel: 1,
    status: "Active",
    registeredAt: "May 18, 2024 10:32 AM",
    totalDeposited: 30.0,
    totalEarnings: 6.0,
    yourCommission: 0.6,
    commissionStatus: "Paid",
  },
  {
    id: "#RF1246",
    userName: "David Brown",
    userEmail: "davidbrown@gmail.com",
    vipLevel: 3,
    status: "Active",
    registeredAt: "May 18, 2024 09:55 AM",
    totalDeposited: 258.0,
    totalEarnings: 54.18,
    yourCommission: 5.42,
    commissionStatus: "Paid",
  },
  {
    id: "#RF1245",
    userName: "Sarah Johnson",
    userEmail: "sarahjohnson@gmail.com",
    vipLevel: 2,
    status: "Active",
    registeredAt: "May 18, 2024 09:32 AM",
    totalDeposited: 68.0,
    totalEarnings: 13.6,
    yourCommission: 1.36,
    commissionStatus: "Pending",
  },
  {
    id: "#RF1244",
    userName: "Michael Lee",
    userEmail: "michaellee@gmail.com",
    vipLevel: 4,
    status: "Active",
    registeredAt: "May 18, 2024 08:48 AM",
    totalDeposited: 800.0,
    totalEarnings: 172.0,
    yourCommission: 17.2,
    commissionStatus: "Pending",
  },
  {
    id: "#RF1243",
    userName: "Emily Davis",
    userEmail: "emilydavis@gmail.com",
    vipLevel: 1,
    status: "Active",
    registeredAt: "May 18, 2024 08:15 AM",
    totalDeposited: 10.0,
    totalEarnings: 2.0,
    yourCommission: 0.2,
    commissionStatus: "Paid",
  },
  {
    id: "#RF1242",
    userName: "James Wilson",
    userEmail: "jameswilson@gmail.com",
    vipLevel: 3,
    status: "Inactive",
    registeredAt: "May 17, 2024 07:52 PM",
    totalDeposited: 0.0,
    totalEarnings: 0.0,
    yourCommission: 0.0,
    commissionStatus: "None",
  },
  {
    id: "#RF1241",
    userName: "Olivia Martinez",
    userEmail: "oliviamartinez@gmail.com",
    vipLevel: 2,
    status: "Active",
    registeredAt: "May 17, 2024 06:33 PM",
    totalDeposited: 68.0,
    totalEarnings: 13.6,
    yourCommission: 1.36,
    commissionStatus: "Paid",
  },
  {
    id: "#RF1240",
    userName: "Daniel Martinez",
    userEmail: "danielmartinez@gmail.com",
    vipLevel: 1,
    status: "Active",
    registeredAt: "May 17, 2024 06:01 PM",
    totalDeposited: 30.0,
    totalEarnings: 6.0,
    yourCommission: 0.6,
    commissionStatus: "Paid",
  },
  {
    id: "#RF1239",
    userName: "Sophia Anderson",
    userEmail: "sophiaanderson@gmail.com",
    vipLevel: 3,
    status: "Active",
    registeredAt: "May 17, 2024 05:22 PM",
    totalDeposited: 258.0,
    totalEarnings: 54.18,
    yourCommission: 5.42,
    commissionStatus: "Pending",
  },
];
