import { useMemo, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FilterChips } from '../components/FilterChips';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { apiClient } from '../lib/api';

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
  status: 'Completed' | 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
};

type TransactionsScreenProps = {
  user: any;
  onBack?: () => void;
  initialFilter?: Filter;
  pendingWithdraw?: {
    amount: number;
    network: string;
  } | null;
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

export function TransactionsScreen({
  user,
  onBack,
  initialFilter = 'All',
  pendingWithdraw = null,
}: TransactionsScreenProps) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      apiClient.get(`/transactions?user_id=${user.id}`)
        .then((data) => {
          setTransactions(data.transactions);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const items = useMemo(() => {
    const live: Transaction[] = pendingWithdraw
      ? [
          {
            id: 'live-withdraw',
            type: 'withdraw',
            title: 'USDT Withdraw',
            subtitle: `Today · ${pendingWithdraw.network.split(' ')[0]}`,
            amount: `-${pendingWithdraw.amount.toFixed(2)} USDT`,
            positive: false,
            status: 'Pending',
            created_at: new Date().toISOString(),
          },
        ]
      : [];
    const all = [...live, ...transactions];
    if (filter === 'All') return all;
    const type = filter.toLowerCase() as TxType;
    return all.filter((item) => item.type === type);
  }, [filter, pendingWithdraw]);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Transactions" onBack={onBack} />

      <View style={styles.filters}>
        <FilterChips items={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.empty}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No {filter.toLowerCase()} yet</Text>
            <Text style={styles.emptyText}>
              Activity will show up here once you have a {filter.toLowerCase()}.
            </Text>
          </View>
        ) : (
          items.map((item) => {
            const date = new Date(item.created_at);
            let dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) dateStr = 'Today';
            else if (date.toDateString() === yesterday.toDateString()) dateStr = 'Yesterday';

            return (
            <View key={item.id} style={styles.row}>
              <TypeIcon type={item.type} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSub}>{dateStr} · {item.subtitle}</Text>
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
            );
          })
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
