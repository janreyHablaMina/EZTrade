export interface AssetRecord {
  id: string;
  assetName: string;
  symbol: string;
  network: string;
  totalBalance: number;
  availableBalance: number;
  locked: number;
  inOrders: number;
  usdValue: number;
  change7d: number;
  bgColor: string;
  textColor: string;
  logoText: string;
}

export interface AssetActivity {
  id: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  user: string;
  dateTime: string;
  amountText: string;
}

export const initialAssets: AssetRecord[] = [
  {
    id: "a1",
    assetName: "Tether USD",
    symbol: "USDT",
    network: "TRC20",
    totalBalance: 198450.2500,
    availableBalance: 188760.2500,
    locked: 6250.0000,
    inOrders: 3440.0000,
    usdValue: 198450.25,
    change7d: 18.2,
    bgColor: "bg-teal-500/20",
    textColor: "text-teal-400",
    logoText: "T",
  },
  {
    id: "a2",
    assetName: "VIP 1",
    symbol: "VIP1",
    network: "--",
    totalBalance: 18750.0000,
    availableBalance: 18750.0000,
    locked: 0.0000,
    inOrders: 0.0000,
    usdValue: 18750.00,
    change7d: 12.4,
    bgColor: "bg-rose-500/20",
    textColor: "text-rose-400",
    logoText: "V1",
  },
  {
    id: "a3",
    assetName: "VIP 2",
    symbol: "VIP2",
    network: "--",
    totalBalance: 12345.5000,
    availableBalance: 12345.5000,
    locked: 0.0000,
    inOrders: 0.0000,
    usdValue: 12345.50,
    change7d: 15.7,
    bgColor: "bg-purple-bright/20",
    textColor: "text-purple-bright",
    logoText: "V2",
  },
  {
    id: "a4",
    assetName: "VIP 3",
    symbol: "VIP3",
    network: "--",
    totalBalance: 8765.2500,
    availableBalance: 8765.2500,
    locked: 0.0000,
    inOrders: 0.0000,
    usdValue: 8765.25,
    change7d: 10.3,
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
    logoText: "V3",
  },
  {
    id: "a5",
    assetName: "Binance USD",
    symbol: "BUSD",
    network: "BEP20",
    totalBalance: 4567.8900,
    availableBalance: 3980.4500,
    locked: 387.4400,
    inOrders: 200.0000,
    usdValue: 4567.89,
    change7d: -2.1,
    bgColor: "bg-yellow-400/20",
    textColor: "text-yellow-400",
    logoText: "B",
  },
  {
    id: "a6",
    assetName: "USD Coin",
    symbol: "USDC",
    network: "ERC20",
    totalBalance: 2345.6700,
    availableBalance: 2145.6700,
    locked: 100.0000,
    inOrders: 100.0000,
    usdValue: 2345.67,
    change7d: 8.8,
    bgColor: "bg-sky-500/20",
    textColor: "text-sky-400",
    logoText: "$",
  },
  {
    id: "a7",
    assetName: "Others",
    symbol: "OTHERS",
    network: "--",
    totalBalance: 405.3400,
    availableBalance: 405.3400,
    locked: 0.0000,
    inOrders: 0.0000,
    usdValue: 405.34,
    change7d: 6.2,
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
    logoText: "O",
  },
];

export const recentActivities: AssetActivity[] = [
  {
    id: "act1",
    type: "Deposit",
    user: "John Smith",
    dateTime: "May 18, 2024 10:45 AM",
    amountText: "+1,250.00 USDT",
  },
  {
    id: "act2",
    type: "Withdrawal",
    user: "Maria Garcia",
    dateTime: "May 18, 2024 09:32 AM",
    amountText: "-500.00 USDT",
  },
  {
    id: "act3",
    type: "Transfer",
    user: "David Brown",
    dateTime: "May 17, 2024 08:15 PM",
    amountText: "-200.00 USDT",
  },
  {
    id: "act4",
    type: "Deposit",
    user: "Sarah Johnson",
    dateTime: "May 17, 2024 06:33 PM",
    amountText: "+2,000.00 USDT",
  },
  {
    id: "act5",
    type: "Transfer",
    user: "Michael Lee",
    dateTime: "May 17, 2024 05:22 PM",
    amountText: "-150.00 USDT",
  },
];
