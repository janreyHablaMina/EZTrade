export type DepositStatus = "Completed" | "Pending" | "Failed";
export type BlockchainNetwork = "TRC20" | "BEP20" | "ERC20";
export type CurrencyType = "USDT" | "USDC" | "BTC" | "ETH";

export type DepositRequest = {
  id: string; // e.g. "#DP1248"
  userName: string;
  userEmail: string;
  amount: number;
  currency: CurrencyType;
  network: BlockchainNetwork;
  txid: string;
  status: DepositStatus;
  statusTime: string;
  confirmationsCurrent?: number;
  confirmationsRequired?: number;
  submittedAt: string;
};

export const initialDepositRequests: DepositRequest[] = [
  {
    id: "#DP1248",
    userName: "John Smith",
    userEmail: "johnsmith@gmail.com",
    amount: 10.00,
    currency: "USDT",
    network: "TRC20",
    txid: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6",
    status: "Completed",
    statusTime: "May 18, 2024 10:45 AM",
    confirmationsCurrent: 32,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 10:36 AM",
  },
  {
    id: "#DP1247",
    userName: "Maria Garcia",
    userEmail: "mariagarcia@gmail.com",
    amount: 68.00,
    currency: "USDT",
    network: "TRC20",
    txid: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8",
    status: "Pending",
    statusTime: "May 18, 2024 10:32 AM",
    confirmationsCurrent: 5,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 10:32 AM",
  },
  {
    id: "#DP1246",
    userName: "David Brown",
    userEmail: "davidbrown@gmail.com",
    amount: 100.00,
    currency: "USDT",
    network: "BEP20",
    txid: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9",
    status: "Completed",
    statusTime: "May 18, 2024 09:58 AM",
    confirmationsCurrent: 45,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 09:50 AM",
  },
  {
    id: "#DP1245",
    userName: "Sarah Johnson",
    userEmail: "sarahjohnson@gmail.com",
    amount: 30.00,
    currency: "USDT",
    network: "TRC20",
    txid: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0",
    status: "Failed",
    statusTime: "May 18, 2024 09:42 AM",
    submittedAt: "May 18, 2024 09:40 AM",
  },
  {
    id: "#DP1244",
    userName: "Michael Lee",
    userEmail: "michaellee@gmail.com",
    amount: 258.00,
    currency: "USDT",
    network: "TRC20",
    txid: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1",
    status: "Completed",
    statusTime: "May 18, 2024 09:15 AM",
    confirmationsCurrent: 28,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 09:09 AM",
  },
  {
    id: "#DP1243",
    userName: "Emily Davis",
    userEmail: "emilydavis@gmail.com",
    amount: 800.00,
    currency: "USDT",
    network: "TRC20",
    txid: "g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1l2",
    status: "Pending",
    statusTime: "May 18, 2024 08:55 AM",
    confirmationsCurrent: 12,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 08:53 AM",
  },
  {
    id: "#DP1242",
    userName: "William Wilson",
    userEmail: "williamwilson@gmail.com",
    amount: 50.00,
    currency: "USDT",
    network: "BEP20",
    txid: "h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1l2m3",
    status: "Completed",
    statusTime: "May 18, 2024 08:30 AM",
    confirmationsCurrent: 50,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 08:27 AM",
  },
  {
    id: "#DP1241",
    userName: "Olivia Anderson",
    userEmail: "oliviaanderson@gmail.com",
    amount: 1000.00,
    currency: "USDT",
    network: "TRC20",
    txid: "i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1l2m3n4",
    status: "Completed",
    statusTime: "May 18, 2024 08:10 AM",
    confirmationsCurrent: 60,
    confirmationsRequired: 20,
    submittedAt: "May 18, 2024 08:05 AM",
  }
];

export const networkBadgeStyles: Record<BlockchainNetwork, string> = {
  TRC20: "bg-red-glow/10 text-red-glow border border-red-glow/20",
  BEP20: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
  ERC20: "bg-blue-glow/10 text-blue-glow border border-blue-glow/20",
};

export const statusBadgeStyles: Record<DepositStatus, string> = {
  Completed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Failed: "bg-danger/15 text-danger",
};
