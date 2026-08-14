import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const FILTERS = ['All', 'Deposit', 'Profit', 'Withdraw'] as const;
type Filter = (typeof FILTERS)[number];
type TxType = 'deposit' | 'profit' | 'withdraw';

type Transaction = {
  id: string;
  type: TxType;
  title: string;
  subtitle: string;
  amount: string;
  positive: boolean;
  status: 'Completed' | 'Pending';
};

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    title: 'VIP 1 Deposit',
    subtitle: 'Today · TRC20',
    amount: '+10.00 USDT',
    positive: true,
    status: 'Completed',
  },
  {
    id: '2',
    type: 'profit',
    title: 'Daily Profit',
    subtitle: 'Today · Quantify',
    amount: '+2.00 USDT',
    positive: true,
    status: 'Completed',
  },
  {
    id: '3',
    type: 'profit',
    title: 'Daily Profit',
    subtitle: 'Yesterday · Quantify',
    amount: '+2.00 USDT',
    positive: true,
    status: 'Completed',
  },
  {
    id: '4',
    type: 'withdraw',
    title: 'USDT Withdraw',
    subtitle: 'Mar 12 · TRC20',
    amount: '-5.00 USDT',
    positive: false,
    status: 'Pending',
  },
  {
    id: '5',
    type: 'deposit',
    title: 'VIP 1 Deposit',
    subtitle: 'Mar 10 · TRC20',
    amount: '+10.00 USDT',
    positive: true,
    status: 'Completed',
  },
  {
    id: '6',
    type: 'withdraw',
    title: 'USDT Withdraw',
    subtitle: 'Mar 8 · TRC20',
    amount: '-3.50 USDT',
    positive: false,
    status: 'Completed',
  },
];

type TransactionsScreenProps = {
  onBack?: () => void;
};

function TypeIcon({ type }: { type: TxType }) {
  if (type === 'deposit') {
    return (
      <View style={[styles.iconWrap, styles.iconDeposit]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 4v10M8 10l4 4 4-4"
            stroke="#c4b5fd"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M5 18h14" stroke="#c4b5fd" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  if (type === 'profit') {
    return (
      <View style={[styles.iconWrap, styles.iconProfit]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 16l5-5 3 3 6-7"
            stroke="#86efac"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }

  return (
    <View style={[styles.iconWrap, styles.iconWithdraw]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 20V10M8 14l4-4 4 4"
          stroke="#fca5a5"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M5 6h14" stroke="#fca5a5" strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function TransactionsScreen({ onBack }: TransactionsScreenProps) {
  const [filter, setFilter] = useState<Filter>('All');

  const items = useMemo(() => {
    if (filter === 'All') return TRANSACTIONS;
    const type = filter.toLowerCase() as TxType;
    return TRANSACTIONS.filter((item) => item.type === type);
  }, [filter]);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Transactions" onBack={onBack} />

      <View style={styles.filters}>
        {FILTERS.map((item) => {
          const active = item === filter;
          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No {filter.toLowerCase()} yet</Text>
            <Text style={styles.emptyText}>
              Activity will show up here once you have a {filter.toLowerCase()}.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.row}>
              <TypeIcon type={item.type} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{item.subtitle}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text
                  style={[
                    styles.amount,
                    item.positive ? styles.amountUp : styles.amountDown,
                  ]}
                >
                  {item.amount}
                </Text>
                <Text
                  style={[
                    styles.status,
                    item.status === 'Pending' && styles.statusPending,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.16)',
  },
  chipActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.55)',
    borderColor: 'rgba(192, 132, 252, 0.45)',
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  chipTextActive: {
    fontFamily: 'Outfit_700Bold',
    color: colors.white,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDeposit: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  iconProfit: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
  },
  iconWithdraw: {
    backgroundColor: 'rgba(248, 113, 113, 0.14)',
  },
  rowBody: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  rowSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  rowRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  amount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
  },
  amountUp: {
    color: '#4ade80',
  },
  amountDown: {
    color: '#f87171',
  },
  status: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  statusPending: {
    color: '#fbbf24',
  },
  empty: {
    paddingTop: 64,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  emptyText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
