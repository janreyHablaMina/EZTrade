export type WithdrawalStatus = "Completed" | "Pending" | "Rejected";
export type BlockchainNetwork = "TRC20" | "BEP20" | "ERC20";
export type CurrencyType = "USDT" | "USDC" | "BTC" | "ETH";

export type WithdrawalRequest = {
  id: string; // e.g. "#WD0956"
  userName: string;
  userEmail: string;
  amount: number;
  fee: number;
  receiveAmount: number;
  currency: CurrencyType;
  network: BlockchainNetwork;
  walletAddress: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt: string;
};

export const initialWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: "#WD0956",
    userName: "John Smith",
    userEmail: "johnsmith@gmail.com",
    amount: 100.00,
    fee: 1.00,
    receiveAmount: 99.00,
    currency: "USDT",
    network: "TRC20",
    walletAddress: "TPmZ8sKj3f9a1b2c3d4e5f6g7h8i9j0k1l",
    status: "Completed",
    requestedAt: "May 18, 2024 10:32 AM",
    processedAt: "May 18, 2024 10:45 AM",
  },
  {
    id: "#WD0955",
    userName: "Maria Garcia",
    userEmail: "mariagarcia@gmail.com",
    amount: 68.00,
    fee: 0.68,
    receiveAmount: 67.32,
    currency: "USDT",
    network: "TRC20",
    walletAddress: "TPmZ8kL23d8a1b2c3d4e5f6g7h8i9j0k1l",
    status: "Pending",
    requestedAt: "May 18, 2024 10:28 AM",
    processedAt: "--",
  },
  {
    id: "#WD0954",
    userName: "David Brown",
    userEmail: "davidbrown@gmail.com",
    amount: 50.00,
    fee: 0.50,
    receiveAmount: 49.50,
    currency: "USDT",
    network: "BEP20",
    walletAddress: "0x8d21a91f73b1b2c3d4e5f6g7h8i9j0k1l2m3n4o5",
    status: "Completed",
    requestedAt: "May 18, 2024 09:55 AM",
    processedAt: "May 18, 2024 10:05 AM",
  },
  {
    id: "#WD0953",
    userName: "Sarah Johnson",
    userEmail: "sarahjohnson@gmail.com",
    amount: 200.00,
    fee: 2.00,
    receiveAmount: 198.00,
    currency: "USDT",
    network: "TRC20",
    walletAddress: "TLN3e8dJ9k2a1b2c3d4e5f6g7h8i9j0k1l",
    status: "Rejected",
    requestedAt: "May 18, 2024 09:32 AM",
    processedAt: "May 18, 2024 09:40 AM",
  },
  {
    id: "#WD0952",
    userName: "Michael Lee",
    userEmail: "michaellee@gmail.com",
    amount: 120.00,
    fee: 1.20,
    receiveAmount: 118.80,
    currency: "USDT",
    network: "BEP20",
    walletAddress: "0xa35BcF98a1b1b2c3d4e5f6g7h8i9j0k1l2m3n4o5",
    status: "Completed",
    requestedAt: "May 18, 2024 08:48 AM",
    processedAt: "May 18, 2024 08:58 AM",
  },
  {
    id: "#WD0951",
    userName: "Emily Davis",
    userEmail: "emilydavis@gmail.com",
    amount: 300.00,
    fee: 3.00,
    receiveAmount: 297.00,
    currency: "USDT",
    network: "TRC20",
    walletAddress: "TPmZ8mN29f8a1b2c3d4e5f6g7h8i9j0k1l",
    status: "Pending",
    requestedAt: "May 18, 2024 08:15 AM",
    processedAt: "--",
  },
  {
    id: "#WD0950",
    userName: "James Wilson",
    userEmail: "jameswilson@gmail.com",
    amount: 75.00,
    fee: 0.75,
    receiveAmount: 74.25,
    currency: "USDT",
    network: "BEP20",
    walletAddress: "0xAF12b67B22b1b2c3d4e5f6g7h8i9j0k1l2m3n4o5",
    status: "Completed",
    requestedAt: "May 18, 2024 07:52 AM",
    processedAt: "May 18, 2024 08:01 AM",
  },
  {
    id: "#WD0949",
    userName: "Olivia Martinez",
    userEmail: "oliviamartinez@gmail.com",
    amount: 500.00,
    fee: 5.00,
    receiveAmount: 495.00,
    currency: "USDT",
    network: "TRC20",
    walletAddress: "TAz89F2kLm9da1b2c3d4e5f6g7h8i9j0k1l",
    status: "Rejected",
    requestedAt: "May 18, 2024 07:21 AM",
    processedAt: "May 18, 2024 07:30 AM",
  },
  {
    id: "#WD0948",
    userName: "Daniel Martinez",
    userEmail: "danielmartinez@gmail.com",
    amount: 150.00,
    fee: 1.50,
    receiveAmount: 148.50,
    currency: "USDT",
    network: "BEP20",
    walletAddress: "0x9d21ef12aaa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5",
    status: "Completed",
    requestedAt: "May 18, 2024 06:45 AM",
    processedAt: "May 18, 2024 06:55 AM",
  },
  {
    id: "#WD0947",
    userName: "Sophia Anderson",
    userEmail: "sophiaanderson@gmail.com",
    amount: 1000.00,
    fee: 10.00,
    receiveAmount: 990.00,
    currency: "USDT",
    network: "TRC20",
    walletAddress: "TAz89F9kLm1aa1b2c3d4e5f6g7h8i9j0k1l",
    status: "Pending",
    requestedAt: "May 18, 2024 06:22 AM",
    processedAt: "--",
  }
];

export const networkBadgeStyles: Record<BlockchainNetwork, string> = {
  TRC20: "bg-red-glow/10 text-red-glow border border-red-glow/20",
  BEP20: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
  ERC20: "bg-blue-glow/10 text-blue-glow border border-blue-glow/20",
};

export const statusBadgeStyles: Record<WithdrawalStatus, string> = {
  Completed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Rejected: "bg-danger/15 text-danger",
};
