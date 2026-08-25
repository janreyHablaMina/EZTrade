export const MIN_USDT = 10;
export const WITHDRAW_FEE_RATE = 0.2;
export const WITHDRAW_REQUEST_UNTIL_HOUR = 12;
export const WITHDRAW_PROCESS_FROM_HOUR = 13;
export const ENFORCE_WITHDRAW_WINDOW = false;

export const NETWORKS = [
  {
    id: 'trc20',
    label: 'TRC20 (USDT)',
    address: 'TUQeWfakqG2x9XbktH7nR4pL2mC8dY6aW1',
  },
  {
    id: 'erc20',
    label: 'ERC20 (USDT)',
    address: '0x8f3a21c9e4b7d0a1c6e5f92b4d8a7c3e1f0b9d62',
  },
  {
    id: 'polygon',
    label: 'Polygon (USDT)',
    address: '0x3c1d95e7a2b8f0d6c3e9a1b7f5d2c8e4a0b6d193',
  },
  {
    id: 'bep20',
    label: 'BEP20 (USDT)',
    address: '0x4c1d95e7a2b8f0d6c3e9a1b7f5d2c8e4a0b6d193',
  },
] as const;

export type NetworkId = (typeof NETWORKS)[number]['id'];

export function getNetwork(id: NetworkId) {
  return NETWORKS.find((item) => item.id === id) ?? NETWORKS[0];
}

export function parseAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : NaN;
}

export function isWithdrawOpen(now = new Date()) {
  if (!ENFORCE_WITHDRAW_WINDOW) return true;
  return now.getHours() < WITHDRAW_REQUEST_UNTIL_HOUR;
}

export function hourClockLabel(hour: number) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:00 ${period}`;
}

export function withdrawPayout(amount: number) {
  const fee = amount * WITHDRAW_FEE_RATE;
  return { fee, receive: amount - fee };
}
