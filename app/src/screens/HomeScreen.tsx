import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ASSETS_CARD_WIDTH = SCREEN_WIDTH - 40; // content horizontal padding
const BAR_CHART_HEIGHT = 96;
const BG_BAR_HEIGHTS = [34, 48, 40, 62, 52, 74, 58, 80, 66, 88, 70, 92];

const MARKET_ITEMS = [
  {
    symbol: 'BTC',
    badge: 'â‚¿',
    color: '#f59e0b',
    change: '+2.45%',
    price: '$68,320.50',
    up: true,
  },
  {
    symbol: 'ETH',
    badge: 'â—†',
    color: '#3b82f6',
    change: '+1.82%',
    price: '$3,450.10',
    up: true,
  },
  {
    symbol: 'USDT',
    badge: 'â‚®',
    color: '#14b8a6',
    change: '+0.02%',
    price: '$1.00',
    up: true,
  },
  {
    symbol: 'BNB',
    badge: 'B',
    color: '#f59e0b',
    change: '-0.64%',
    price: '$582.40',
    up: false,
  },
  {
    symbol: 'SOL',
    badge: 'S',
    color: '#a855f7',
    change: '+3.18%',
    price: '$148.75',
    up: true,
  },
  {
    symbol: 'XRP',
    badge: 'X',
    color: '#64748b',
    change: '+0.91%',
    price: '$0.62',
    up: true,
  },
] as const;

type HomeScreenProps = {
  userName?: string;
  onOpenPlans?: () => void;
  onOpenDeposit?: () => void;
  onOpenAssets?: () => void;
  onOpenTransactions?: () => void;
};

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 18) return 'Good Afternoon,';
  return 'Good Evening,';
}

function ActionIcon({
  type,
}: {
  type: 'deposit' | 'withdraw' | 'assets' | 'transactions';
}) {
  const stroke = colors.purpleBright;

  if (type === 'deposit') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 4v10M8 10l4 4 4-4"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M5 18h14"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'withdraw') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 20V10M8 14l4-4 4 4"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M5 6h14"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'assets') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"
          stroke={stroke}
          strokeWidth={1.8}
        />
        <Path
          d="M4 8l2-3h12l2 3"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M8 7h12M8 12h12M8 17h12" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="4.5" cy="7" r="1.2" fill={stroke} />
      <Circle cx="4.5" cy="12" r="1.2" fill={stroke} />
      <Circle cx="4.5" cy="17" r="1.2" fill={stroke} />
    </Svg>
  );
}

function CoinBadge({ symbol, color }: { symbol: string; color: string }) {
  return (
    <View style={[styles.coinBadge, { backgroundColor: color }]}>
      <Text style={styles.coinBadgeText}>{symbol}</Text>
    </View>
  );
}

export function HomeScreen({
  userName = 'John Doe',
  onOpenPlans,
  onOpenDeposit,
  onOpenAssets,
  onOpenTransactions,
}: HomeScreenProps) {
  const greeting = useMemo(() => greetingForNow(), []);
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const actions = [
    { key: 'deposit', label: 'Deposit' },
    { key: 'withdraw', label: 'Withdraw' },
    { key: 'assets', label: 'My Assets' },
    { key: 'transactions', label: 'Transactions' },
  ] as const;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>
              {userName}{' '}
              <Text style={styles.wave}>ðŸ‘‹</Text>
            </Text>
          </View>
        </View>

        <Pressable onPress={onOpenPlans}>
          <LinearGradient
            colors={['#9b5cff', '#6d28d9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.vipBadge}
          >
            <Text style={styles.vipText}>VIP 1</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <LinearGradient
        colors={['#8b5cf6', '#6d28d9', '#4c1d95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.assetsCard}
      >
        <View style={styles.barChartWrap} pointerEvents="none">
          <Svg
            width={ASSETS_CARD_WIDTH}
            height={BAR_CHART_HEIGHT}
            viewBox={`0 0 ${ASSETS_CARD_WIDTH} ${BAR_CHART_HEIGHT}`}
          >
            {BG_BAR_HEIGHTS.map((barHeight, index) => {
              const gap = 6;
              const barWidth =
                (ASSETS_CARD_WIDTH - gap * (BG_BAR_HEIGHTS.length + 1)) /
                BG_BAR_HEIGHTS.length;
              const x = gap + index * (barWidth + gap);
              const y = BAR_CHART_HEIGHT - barHeight;
              const opacity = 0.08 + (index / BG_BAR_HEIGHTS.length) * 0.12;

              return (
                <Rect
                  key={index}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  fill={`rgba(255,255,255,${opacity.toFixed(2)})`}
                />
              );
            })}
          </Svg>
        </View>

        <Text style={styles.assetsLabel}>Total Assets</Text>
        <Text style={styles.assetsValue}>$12.50</Text>
        <Text style={styles.assetsChange}>+20.00% today</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        {[
          { label: 'Daily Profit', value: '$2.50' },
          { label: 'Total Profit', value: '$2.50' },
          { label: 'Active Plan', value: 'VIP 1' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            style={styles.actionItem}
            onPress={() => {
              if (action.key === 'assets') onOpenAssets?.();
              if (action.key === 'deposit') onOpenDeposit?.();
              if (action.key === 'transactions') onOpenTransactions?.();
            }}
          >
            <View style={styles.actionIcon}>
              <ActionIcon type={action.key} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onOpenPlans}>
        <LinearGradient
          colors={['#6366f1', '#7c3aed', '#9333ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promo}
        >
          <Text style={styles.promoTitle}>Earn Daily with VIP Plan</Text>
          <Text style={styles.promoSubtitle}>
            Start trading now and grow your assets.
          </Text>
        </LinearGradient>
      </Pressable>

      <Text style={styles.sectionTitle}>Market Overview</Text>
      <View style={styles.marketGrid}>
        {MARKET_ITEMS.map((item) => (
          <View key={item.symbol} style={styles.marketCard}>
            <View style={styles.marketTop}>
              <CoinBadge symbol={item.badge} color={item.color} />
              <Text style={styles.marketSymbol}>{item.symbol}</Text>
              <Text
                style={[
                  styles.marketChange,
                  !item.up && styles.marketChangeDown,
                ]}
              >
                {item.change}
              </Text>
            </View>
            <Text style={styles.marketPrice}>{item.price}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2a1848',
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Outfit_700Bold',
    color: colors.white,
    fontSize: 15,
  },
  greeting: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  userName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
    marginTop: 2,
  },
  wave: {
    fontSize: 16,
  },
  vipBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  vipText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  assetsCard: {
    borderRadius: 24,
    padding: 22,
    minHeight: 150,
    overflow: 'hidden',
    justifyContent: 'center',
    position: 'relative',
  },
  barChartWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: ASSETS_CARD_WIDTH,
    height: BAR_CHART_HEIGHT,
    opacity: 0.9,
  },
  assetsLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  assetsValue: {
    marginTop: 6,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 40,
    color: colors.white,
  },
  assetsChange: {
    marginTop: 4,
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#86efac',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  statValue: {
    marginTop: 6,
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionItem: {
    width: '23%',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
  },
  promo: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  promoTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    color: colors.white,
  },
  promoSubtitle: {
    marginTop: 4,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
  },
  marketGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  marketCard: {
    width: (SCREEN_WIDTH - 40 - 10) / 2,
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  marketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinBadgeText: {
    color: colors.white,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 12,
  },
  marketSymbol: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
    flex: 1,
  },
  marketChange: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.green,
  },
  marketChangeDown: {
    color: '#f87171',
  },
  marketPrice: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
});
