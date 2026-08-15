export interface TicketMessage {
  id: string;
  sender: "User" | "Admin";
  senderName: string;
  timestamp: string;
  content: string;
}

export interface TicketRecord {
  id: string;
  userName: string;
  userEmail: string;
  userId: string;
  subjectTitle: string;
  subjectSummary: string;
  category: "Withdrawals" | "Deposits" | "VIP Plans" | "Account" | "Referrals" | "Technical" | "Transactions" | "KYC";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Pending" | "In Progress" | "Resolved" | "Closed";
  lastUpdate: string;
  createdAt: string;
  description: string;
  messages: TicketMessage[];
}

export const priorityBadgeStyles: Record<string, string> = {
  High: "bg-red-500/10 text-red-400 border border-red-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

export const statusBadgeStyles: Record<string, string> = {
  Open: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  "In Progress": "bg-purple-bright/15 text-purple-bright border border-purple-bright/30",
  Resolved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Closed: "bg-gray-500/15 text-gray-400 border border-gray-500/30",
};

export const categoryIconColors: Record<string, string> = {
  Withdrawals: "text-purple-bright",
  Deposits: "text-emerald-400",
  "VIP Plans": "text-purple-bright",
  Account: "text-blue-400",
  Referrals: "text-pink-400",
  Technical: "text-teal-400",
  Transactions: "text-amber-400",
  KYC: "text-emerald-400",
};

export const initialTickets: TicketRecord[] = [
  {
    id: "#TKT-1248",
    userName: "John Smith",
    userEmail: "johnsmith@gmail.com",
    userId: "#USR-10048",
    subjectTitle: "Unable to withdraw my profits",
    subjectSummary: "I have tried to withdraw my profits but the transaction is not going through...",
    category: "Withdrawals",
    priority: "High",
    status: "Open",
    lastUpdate: "May 18, 2024 10:45 AM",
    createdAt: "May 18, 2024 10:15 AM",
    description: "I have tried to withdraw my profits but the transaction is not going through. It shows an error message 'Transaction failed'. Please check and resolve this issue as soon as possible.",
    messages: [
      {
        id: "msg1",
        sender: "User",
        senderName: "John Smith",
        timestamp: "May 18, 2024 10:15 AM",
        content: "I have tried to withdraw my profits but the transaction is not going through.",
      },
      {
        id: "msg2",
        sender: "Admin",
        senderName: "Admin (You)",
        timestamp: "May 18, 2024 10:35 AM",
        content: "Hello John, we are checking this issue for you. Please wait a moment.",
      },
      {
        id: "msg3",
        sender: "User",
        senderName: "John Smith",
        timestamp: "May 18, 2024 10:45 AM",
        content: "Thank you! I will wait for your update.",
      },
    ],
  },
  {
    id: "#TKT-1247",
    userName: "Maria Garcia",
    userEmail: "mariagarcia@gmail.com",
    userId: "#USR-10047",
    subjectTitle: "Deposit not showing in my account",
    subjectSummary: "I have completed the USDT transfer but it has not been credited to my account yet.",
    category: "Deposits",
    priority: "High",
    status: "Pending",
    lastUpdate: "May 18, 2024 09:32 AM",
    createdAt: "May 18, 2024 09:00 AM",
    description: "I have completed the USDT transfer but it has not been credited to my account yet.",
    messages: [],
  },
  {
    id: "#TKT-1246",
    userName: "David Brown",
    userEmail: "davidbrown@gmail.com",
    userId: "#USR-10046",
    subjectTitle: "How to upgrade my VIP level?",
    subjectSummary: "Can you please guide me on how I can upgrade my VIP level?",
    category: "VIP Plans",
    priority: "Medium",
    status: "Open",
    lastUpdate: "May 18, 2024 08:15 AM",
    createdAt: "May 18, 2024 08:00 AM",
    description: "Can you please guide me on how I can upgrade my VIP level?",
    messages: [],
  },
  {
    id: "#TKT-1245",
    userName: "Sarah Johnson",
    userEmail: "sarahjohnson@gmail.com",
    userId: "#USR-10045",
    subjectTitle: "Account verification issue",
    subjectSummary: "I am having trouble completing the verification process. Please assist.",
    category: "Account",
    priority: "Medium",
    status: "In Progress",
    lastUpdate: "May 18, 2024 07:52 PM",
    createdAt: "May 18, 2024 07:00 PM",
    description: "I am having trouble completing the verification process. Please assist.",
    messages: [],
  },
  {
    id: "#TKT-1244",
    userName: "Michael Lee",
    userEmail: "michaellee@gmail.com",
    userId: "#USR-10044",
    subjectTitle: "Referral commission not received",
    subjectSummary: "My referral commission is missing for my referred user completed deposit.",
    category: "Referrals",
    priority: "Low",
    status: "Resolved",
    lastUpdate: "May 17, 2024 06:33 PM",
    createdAt: "May 17, 2024 06:00 PM",
    description: "My referral commission is missing for my referred user completed deposit.",
    messages: [],
  },
  {
    id: "#TKT-1243",
    userName: "Emily Davis",
    userEmail: "emilydavis@gmail.com",
    userId: "#USR-10043",
    subjectTitle: "App login problem",
    subjectSummary: "I can't log in to my account from the mobile app. Please help.",
    category: "Technical",
    priority: "High",
    status: "Closed",
    lastUpdate: "May 17, 2024 05:22 PM",
    createdAt: "May 17, 2024 05:00 PM",
    description: "I can't log in to my account from the mobile app. Please help.",
    messages: [],
  },
  {
    id: "#TKT-1242",
    userName: "James Wilson",
    userEmail: "jameswilson@gmail.com",
    userId: "#USR-10042",
    subjectTitle: "Change registered email",
    subjectSummary: "I would like to change my registered email address to a new one.",
    category: "Account",
    priority: "Low",
    status: "Resolved",
    lastUpdate: "May 17, 2024 04:18 PM",
    createdAt: "May 17, 2024 04:00 PM",
    description: "I would like to change my registered email address to a new one.",
    messages: [],
  },
  {
    id: "#TKT-1241",
    userName: "Olivia Martinez",
    userEmail: "oliviamartinez@gmail.com",
    userId: "#USR-10041",
    subjectTitle: "Transaction history incorrect",
    subjectSummary: "The transaction history in my account shows incorrect information.",
    category: "Transactions",
    priority: "Medium",
    status: "Open",
    lastUpdate: "May 17, 2024 03:41 PM",
    createdAt: "May 17, 2024 03:00 PM",
    description: "The transaction history in my account shows incorrect information.",
    messages: [],
  },
  {
    id: "#TKT-1240",
    userName: "Daniel Martinez",
    userEmail: "danielmartinez@gmail.com",
    userId: "#USR-10040",
    subjectTitle: "KYC verification delay",
    subjectSummary: "My KYC documents were submitted but still not verified.",
    category: "KYC",
    priority: "Medium",
    status: "Pending",
    lastUpdate: "May 17, 2024 02:29 PM",
    createdAt: "May 17, 2024 02:00 PM",
    description: "My KYC documents were submitted but still not verified.",
    messages: [],
  },
  {
    id: "#TKT-1239",
    userName: "Sophia Anderson",
    userEmail: "sophiaanderson@gmail.com",
    userId: "#USR-10039",
    subjectTitle: "Request for account deletion",
    subjectSummary: "I would like to delete my account and all my data permanently.",
    category: "Account",
    priority: "Low",
    status: "Closed",
    lastUpdate: "May 17, 2024 01:12 PM",
    createdAt: "May 17, 2024 01:00 PM",
    description: "I would like to delete my account and all my data permanently.",
    messages: [],
  },
];
