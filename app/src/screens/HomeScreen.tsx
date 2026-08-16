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
import { MarketOverview } from '../components/home/MarketOverview';
import { colors } from '../theme/colors';
import { Bell, MessageCircle } from 'lucide-react-native';
import { useHomeStats } from '../hooks/useHomeStats';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ASSETS_CARD_WIDTH = SCREEN_WIDTH - 40; // content horizontal padding
const BAR_CHART_HEIGHT = 96;
const BG_BAR_HEIGHTS = [34, 48, 40, 62, 52, 74, 58, 80, 66, 88, 70, 92];

type HomeScreenProps = {
  user?: any;
  onOpenPlans?: () => void;
  onOpenNotifications?: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
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

export function HomeScreen({
  user,
  onOpenPlans,
  onOpenNotifications,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenAssets,
  onOpenTransactions,
}: HomeScreenProps) {
  const { userData, stats, hasUnread } = useHomeStats(user);

  const userName = userData?.name || 'John Doe';
  const balance = Number(stats.balance || userData?.balance || 0);
  const activePlan = userData?.vip_plan;
  const activePlanName = activePlan ? activePlan.level.toUpperCase() : 'None';
  const estDailyProfit = stats.daily_profit;
  const totalProfit = stats.total_profit;

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
            <View style={styles.nameRow}>
              <Text style={styles.userName}>
                {userName}{' '}
                <Text style={styles.wave}>👋</Text>
              </Text>
              
              <Pressable onPress={onOpenPlans}>
                <LinearGradient
                  colors={activePlan ? ['#9b5cff', '#6d28d9'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.vipBadge}
                >
                  <Text style={styles.vipText}>{activePlan ? activePlanName : 'No VIP'}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <MessageCircle size={22} color="rgba(255,255,255,0.8)" strokeWidth={2} />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={onOpenNotifications}>
            {hasUnread && <View style={styles.notificationDot} />}
            <Bell size={22} color="rgba(255,255,255,0.8)" strokeWidth={2} />
          </Pressable>
        </View>
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
        <Text style={styles.assetsValue}>${balance.toFixed(2)}</Text>
        <Text style={[styles.assetsChange, stats.today_profit > 0 && styles.assetsChangePositive]}>
          {stats.today_profit > 0 ? `+$${Number(stats.today_profit).toFixed(2)} Earned Today` : '$0.00 Earned Today'}
        </Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        {[
          { label: 'Daily Profit', value: `+$${estDailyProfit.toFixed(2)}` },
          { label: 'Total Profit', value: `+$${totalProfit.toFixed(2)}` },
          { label: 'Active Plan', value: activePlanName },
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
              if (action.key === 'withdraw') onOpenWithdraw?.();
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

      <MarketOverview />
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  userName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
  },
  wave: {
    fontSize: 16,
  },
  vipBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vipText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 10,
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    borderWidth: 1.5,
    borderColor: '#111',
    zIndex: 1,
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
    color: 'rgba(255,255,255,0.45)',
  },
  assetsChangePositive: {
    color: '#4ade80',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardFill,
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
    backgroundColor: colors.cardFill,
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
});
