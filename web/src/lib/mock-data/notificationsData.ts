export type NotificationCategory =
  | "Transaction"
  | "Account"
  | "Earnings"
  | "Security"
  | "Referral"
  | "System"
  | "Promotion";

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  category: NotificationCategory;
  dateTime: string;
  isRead: boolean;
  iconType: "deposit" | "vip" | "earnings" | "security" | "withdrawal" | "referral-join" | "referral-bonus" | "system";
}

export const categoryBadgeStyles: Record<NotificationCategory, string> = {
  Transaction: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Account: "bg-purple-bright/15 text-purple-bright border border-purple-bright/25",
  Earnings: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  Security: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Referral: "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  System: "bg-gray-500/15 text-gray-400 border border-gray-500/25",
  Promotion: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
};

export const initialNotifications: NotificationRecord[] = [
  {
    id: "n1",
    title: "Deposit Successful",
    description: "Your deposit of 50.00 USDT has been received and is now available in your account.",
    category: "Transaction",
    dateTime: "May 18, 2024 10:45 AM",
    isRead: false,
    iconType: "deposit",
  },
  {
    id: "n2",
    title: "Welcome to VIP 3!",
    description: "Congratulations! You have been upgraded to VIP 3. Enjoy higher earnings and more benefits.",
    category: "Account",
    dateTime: "May 18, 2024 09:30 AM",
    isRead: false,
    iconType: "vip",
  },
  {
    id: "n3",
    title: "Daily Earnings Credited",
    description: "Your daily earnings of 12.45 USDT has been credited to your account.",
    category: "Earnings",
    dateTime: "May 18, 2024 08:15 AM",
    isRead: false,
    iconType: "earnings",
  },
  {
    id: "n4",
    title: "Security Alert",
    description: "New login detected from Chrome on Windows (Philippines).",
    category: "Security",
    dateTime: "May 18, 2024 07:20 AM",
    isRead: false,
    iconType: "security",
  },
  {
    id: "n5",
    title: "Withdrawal Completed",
    description: "Your withdrawal of 30.00 USDT has been successfully processed.",
    category: "Transaction",
    dateTime: "May 17, 2024 06:45 PM",
    isRead: true,
    iconType: "withdrawal",
  },
  {
    id: "n6",
    title: "New Referral Joined",
    description: "Your referral, Maria Garcia, has joined EZTRADE. You earned 2.00 USDT commission.",
    category: "Referral",
    dateTime: "May 17, 2024 03:20 PM",
    isRead: true,
    iconType: "referral-join",
  },
  {
    id: "n7",
    title: "Referral Bonus Earned",
    description: "You have earned 1.50 USDT referral bonus from your team's activities.",
    category: "Referral",
    dateTime: "May 17, 2024 12:10 PM",
    isRead: true,
    iconType: "referral-bonus",
  },
  {
    id: "n8",
    title: "System Maintenance",
    description: "We will be performing scheduled maintenance on May 20, 2024 from 02:00 AM – 04:00 AM (UTC).",
    category: "System",
    dateTime: "May 17, 2024 09:00 AM",
    isRead: true,
    iconType: "system",
  },
];
