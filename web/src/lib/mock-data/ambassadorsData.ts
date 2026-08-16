export interface AmbassadorRecord {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  registeredAt: string;
  downlineCount: number;
  totalDownlineAssets: number;
  dailyEarnings: number; // 5% of downline's daily distribution or something similar based on assets
  referralCode: string;
}

export const initialAmbassadors: AmbassadorRecord[] = [
  {
    id: "#AMB1001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    status: "Active",
    registeredAt: "May 10, 2024 09:00 AM",
    downlineCount: 15,
    totalDownlineAssets: 15000.0,
    dailyEarnings: 750.0,
    referralCode: "ALEX15K",
  },
  {
    id: "#AMB1002",
    name: "Samantha Lee",
    email: "sam.lee@example.com",
    status: "Active",
    registeredAt: "May 12, 2024 11:30 AM",
    downlineCount: 8,
    totalDownlineAssets: 5400.0,
    dailyEarnings: 270.0,
    referralCode: "SAM5K",
  },
  {
    id: "#AMB1003",
    name: "Michael Chen",
    email: "m.chen@example.com",
    status: "Inactive",
    registeredAt: "May 14, 2024 02:15 PM",
    downlineCount: 0,
    totalDownlineAssets: 0.0,
    dailyEarnings: 0.0,
    referralCode: "MIKEC",
  },
];
