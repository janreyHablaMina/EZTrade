export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  status: string;
  vip_plan_id?: string;
  vip_plan?: any;
};

export type Filter = 'All' | 'Deposit' | 'Profit' | 'Withdraw';
export type TxType = 'deposit' | 'profit' | 'withdraw';

export type Transaction = {
  id: string;
  type: TxType;
  title: string;
  subtitle: string;
  amount: string;
  positive: boolean;
  status: 'Completed' | 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
};
