export type AuditLogRecord = {
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
  status: "Success" | "Failed" | "Warning";
  details?: string;
};

export const initialAuditLogs: AuditLogRecord[] = [
  {
    id: "AL-1092",
    timestamp: "2026-08-15 14:32:11",
    user: { name: "System Admin", email: "admin@eztrade.com", role: "Super Admin", avatarInitials: "SA" },
    action: "Login",
    resource: "Admin Panel",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "AL-1091",
    timestamp: "2026-08-15 13:45:00",
    user: { name: "John Doe", email: "john.doe@email.com", role: "User", avatarInitials: "JD" },
    action: "Withdrawal Request",
    resource: "Finance",
    ipAddress: "203.0.113.42",
    status: "Failed",
    details: "Insufficient funds for withdrawal amount.",
  },
  {
    id: "AL-1090",
    timestamp: "2026-08-15 12:10:22",
    user: { name: "Maria Garcia", email: "maria.garcia@email.com", role: "User", avatarInitials: "MG" },
    action: "KYC Submission",
    resource: "Verification",
    ipAddress: "198.51.100.7",
    status: "Success",
  },
  {
    id: "AL-1089",
    timestamp: "2026-08-15 11:05:41",
    user: { name: "Support Staff", email: "support@eztrade.com", role: "Moderator", avatarInitials: "SS" },
    action: "Update User Status",
    resource: "Users Management",
    ipAddress: "192.168.1.200",
    status: "Success",
    details: "Changed status from Pending to Active for UID: EZT1047",
  },
  {
    id: "AL-1088",
    timestamp: "2026-08-15 09:30:15",
    user: { name: "Unknown", email: "-", role: "Guest", avatarInitials: "?" },
    action: "Failed Login",
    resource: "Authentication",
    ipAddress: "45.22.19.100",
    status: "Failed",
    details: "Invalid credentials.",
  },
  {
    id: "AL-1087",
    timestamp: "2026-08-14 18:22:10",
    user: { name: "System Admin", email: "admin@eztrade.com", role: "Super Admin", avatarInitials: "SA" },
    action: "Export Data",
    resource: "Users Management",
    ipAddress: "192.168.1.105",
    status: "Success",
    details: "Exported users list to CSV.",
  },
  {
    id: "AL-1086",
    timestamp: "2026-08-14 16:45:00",
    user: { name: "Carlos Santos", email: "carlos.santos@email.com", role: "User", avatarInitials: "CS" },
    action: "Deposit",
    resource: "Finance",
    ipAddress: "203.0.113.88",
    status: "Warning",
    details: "Deposit flagged for manual review.",
  },
  {
    id: "AL-1085",
    timestamp: "2026-08-14 14:15:33",
    user: { name: "System", email: "system@eztrade.com", role: "System", avatarInitials: "SY" },
    action: "Automated Backup",
    resource: "Database",
    ipAddress: "127.0.0.1",
    status: "Success",
  },
  {
    id: "AL-1084",
    timestamp: "2026-08-14 11:10:05",
    user: { name: "Ana Reyes", email: "ana.reyes@email.com", role: "User", avatarInitials: "AR" },
    action: "Update Profile",
    resource: "Account Settings",
    ipAddress: "198.51.100.10",
    status: "Success",
  },
  {
    id: "AL-1083",
    timestamp: "2026-08-14 09:05:00",
    user: { name: "System Admin", email: "admin@eztrade.com", role: "Super Admin", avatarInitials: "SA" },
    action: "Configuration Change",
    resource: "System Settings",
    ipAddress: "192.168.1.105",
    status: "Success",
    details: "Updated global transaction fee percentage.",
  }
];
