export interface TransactionRecord {
  id: string;
  type: "Deposit" | "Withdrawal" | "Transfer" | "Earning";
  userName: string;
  userEmail: string;
  referenceTxid: string;
  amount: number;
  currency: string;
  network: string;
  status: "Completed" | "Pending" | "Rejected";
  dateTime: string;
  description: string;
}

export const typeBadgeStyles: Record<TransactionRecord["type"], string> = {
  Deposit: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Withdrawal: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  Transfer: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  Earning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

export const statusBadgeStyles: Record<TransactionRecord["status"], string> = {
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export const initialTransactions: TransactionRecord[] = [
  {
    id: "#TXN5620",
    type: "Deposit",
    userName: "John Smith",
    userEmail: "johnsmith@gmail.com",
    referenceTxid: "a1b2c3d4e5f6g7h8",
    amount: 100.00,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 18, 2024 10:45 AM",
    description: "Deposit via TRC20",
  },
  {
    id: "#TXN5619",
    type: "Withdrawal",
    userName: "Maria Garcia",
    userEmail: "mariagarcia@gmail.com",
    referenceTxid: "wd_8f7e6d5cb4a3f2d1",
    amount: -68.00,
    currency: "USDT",
    network: "TRC20",
    status: "Pending",
    dateTime: "May 18, 2024 10:32 AM",
    description: "Withdrawal to TPMz8...kL23d8",
  },
  {
    id: "#TXN5618",
    type: "Transfer",
    userName: "David Brown",
    userEmail: "davidbrown@gmail.com",
    referenceTxid: "tr_7e6d5c4ba3f2d1e0",
    amount: -20.00,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 18, 2024 09:55 AM",
    description: "Transfer to Maria Garcia",
  },
  {
    id: "#TXN5617",
    type: "Deposit",
    userName: "Sarah Johnson",
    userEmail: "sarahjohnson@gmail.com",
    referenceTxid: "c3d4e5f6g7h8i9j0",
    amount: 30.00,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 18, 2024 09:32 AM",
    description: "Deposit via TRC20",
  },
  {
    id: "#TXN5616",
    type: "Earning",
    userName: "Michael Lee",
    userEmail: "michaellee@gmail.com",
    referenceTxid: "earn_5a4b3c2d1e0f9g8",
    amount: 2.80,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 18, 2024 08:48 AM",
    description: "Daily profit - VIP 3",
  },
  {
    id: "#TXN5615",
    type: "Withdrawal",
    userName: "Emily Davis",
    userEmail: "emilydavis@gmail.com",
    referenceTxid: "wd_1a2b3c4d5e6f7g8h",
    amount: -120.00,
    currency: "USDT",
    network: "BEP20",
    status: "Rejected",
    dateTime: "May 18, 2024 08:15 AM",
    description: "Insufficient balance",
  },
  {
    id: "#TXN5614",
    type: "Deposit",
    userName: "James Wilson",
    userEmail: "jameswilson@gmail.com",
    referenceTxid: "d4e5f6g7h8i9j0k1",
    amount: 75.00,
    currency: "USDT",
    network: "BEP20",
    status: "Completed",
    dateTime: "May 17, 2024 07:52 PM",
    description: "Deposit via BEP20",
  },
  {
    id: "#TXN5613",
    type: "Transfer",
    userName: "Olivia Martinez",
    userEmail: "oliviamartinez@gmail.com",
    referenceTxid: "tr_9i8h7g6f5f4e3d2c",
    amount: -50.00,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 17, 2024 06:33 PM",
    description: "Transfer to David Brown",
  },
  {
    id: "#TXN5612",
    type: "Earning",
    userName: "Daniel Martinez",
    userEmail: "danielmartinez@gmail.com",
    referenceTxid: "earn_7g6f5e4d3c2b1a0",
    amount: 1.50,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 17, 2024 06:01 PM",
    description: "Referral commission",
  },
  {
    id: "#TXN5611",
    type: "Withdrawal",
    userName: "Sophia Anderson",
    userEmail: "sophiaanderson@gmail.com",
    referenceTxid: "wd_0a1b2c3d4e5f6g7h",
    amount: -200.00,
    currency: "USDT",
    network: "TRC20",
    status: "Completed",
    dateTime: "May 17, 2024 05:22 PM",
    description: "Withdrawal to TPMz8...kL23d8",
  },
];
