import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { useHomeStats } from '../hooks/useHomeStats';
import { ActivityIndicator } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 72;
const CHART_HEIGHT = 140;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const GROWTH_POINTS = [28, 36, 42, 55, 62, 78, 92] as const;

type AssetsScreenProps = {
  onBack?: () => void;
  user?: any;
};

function VipBadge() {
  return (
    <View style={styles.vipBadgeWrap}>
      <Svg width={72} height={72} viewBox="0 0 72 72">
        <Defs>
          <SvgGradient id="vipRing" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#e9d5ff" />
            <Stop offset="45%" stopColor="#c084fc" />
            <Stop offset="100%" stopColor="#7c3aed" />
          </SvgGradient>
          <SvgGradient id="vipCore" x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0%" stopColor="#a855f7" />
            <Stop offset="100%" stopColor="#4c1d95" />
          </SvgGradient>
        </Defs>
        <Circle cx="36" cy="36" r="34" fill="url(#vipRing)" opacity={0.35} />
        <Circle cx="36" cy="36" r="28" fill="url(#vipCore)" />
        <Circle
          cx="36"
          cy="36"
          r="28"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.2}
          fill="none"
        />
        <Path
          d="M36 18l4.2 8.4 9.3 1.4-6.7 6.5 1.6 9.2L36 39.2l-8.4 4.3 1.6-9.2-6.7-6.5 9.3-1.4L36 18z"
          fill="rgba(255,255,255,0.95)"
        />
      </Svg>
    </View>
  );
}

function BannerDecor() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.glowOrbLarge} />
      <View style={styles.glowOrbSmall} />
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 340 168"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient id="waveSoft" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Path
          d="M0 118 C60 98, 110 138, 170 112 C230 86, 280 104, 340 88 L340 168 L0 168 Z"
          fill="rgba(255,255,255,0.05)"
        />
        <Path
          d="M0 132 C80 118, 140 148, 200 128 C260 108, 300 126, 340 118"
          stroke="url(#waveSoft)"
          strokeWidth={1.4}
          fill="none"
        />
      </Svg>
    </View>
  );
}

function ProfitChart() {
  const { linePath, areaPath, points } = useMemo(() => {
    const min = Math.min(...GROWTH_POINTS);
    const max = Math.max(...GROWTH_POINTS);
    const range = max - min || 1;
    const padY = 16;
    const usableH = CHART_HEIGHT - padY * 2;
    const stepX = CHART_WIDTH / (GROWTH_POINTS.length - 1);

    const pts = GROWTH_POINTS.map((value, index) => {
      const x = index * stepX;
      const y = padY + usableH - ((value - min) / range) * usableH;
      return { x, y };
    });

    const line = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

    return { linePath: line, areaPath: area, points: pts };
  }, []);

  return (
    <View style={styles.chartInner}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <SvgGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </SvgGradient>
          <SvgGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#c084fc" />
            <Stop offset="100%" stopColor="#a855f7" />
          </SvgGradient>
        </Defs>
        <Path d={areaPath} fill="url(#areaFill)" />
        <Path
          d={linePath}
          stroke="url(#lineGrad)"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <Circle
            key={DAYS[index]}
            cx={point.x}
            cy={point.y}
            r={5}
            fill="#c084fc"
            stroke={colors.white}
            strokeWidth={2}
          />
        ))}
      </Svg>
      <View style={styles.dayRow}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayLabel}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function AssetsScreen({ onBack, user }: AssetsScreenProps) {
  const { userData, stats, loading } = useHomeStats(user);

  const activePlan = userData?.vip_plan;
  const activePlanName = activePlan ? activePlan.level.toUpperCase() : 'None';
  const planMinDeposit = activePlan ? Number(activePlan.min_deposit) : 0;
  const planDailyPercent = activePlan ? Number(activePlan.daily_profit_percent) : 0;

  const DYNAMIC_STATS = [
    { label: 'Daily Profit', value: `${stats.daily_profit.toFixed(2)} USDT` },
    { label: 'Total Profit', value: `${stats.total_profit.toFixed(2)} USDT` },
    { label: 'Initial Deposit', value: `${planMinDeposit.toFixed(2)} USDT` },
    { label: 'Available Balance', value: `${stats.balance.toFixed(2)} USDT` },
  ];

  if (loading) {
    return (
      <View style={[styles.content, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.purpleBright} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="My Assets" onBack={onBack} padded={false} />

      <LinearGradient
        colors={['#8b5cf6', '#6d28d9', '#3b0764']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.planCard}
      >
        <BannerDecor />

        <View style={styles.planTopRow}>
          <Text style={styles.planLabel}>Active Plan</Text>
          <View style={[styles.activeChip, !activePlan && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            {activePlan && <View style={styles.activeDot} />}
            <Text style={styles.activeChipText}>{activePlan ? 'Running' : 'Inactive'}</Text>
          </View>
        </View>

        <View style={styles.planBody}>
          <VipBadge />
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{activePlanName}</Text>
            <Text style={styles.planAmount}>{planMinDeposit} USDT</Text>
            <View style={styles.returnChip}>
              <Text style={styles.returnChipText}>+{planDailyPercent}% daily return</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsGrid}>
        {DYNAMIC_STATS.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.growthCard}>
        <View style={styles.growthHeader}>
          <Text style={styles.growthTitle}>Profit Growth</Text>
          <Text style={styles.growthPct}>+{planDailyPercent.toFixed(2)}%</Text>
        </View>
        <ProfitChart />
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
  planCard: {
    borderRadius: 28,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    gap: 18,
  },
  glowOrbLarge: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(192, 132, 252, 0.28)',
    top: -48,
    right: -36,
  },
  glowOrbSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(99, 102, 241, 0.22)',
    bottom: -28,
    left: -18,
  },
  planTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.35)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#86efac',
  },
  activeChipText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#bbf7d0',
  },
  planBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  vipBadgeWrap: {
    width: 72,
    height: 72,
  },
  planInfo: {
    flex: 1,
    gap: 4,
  },
  planName: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 26,
    color: colors.white,
  },
  planAmount: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.92)',
  },
  returnChip: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  returnChipText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (SCREEN_WIDTH - 40 - 12) / 2,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  statLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  statValue: {
    marginTop: 8,
    fontFamily: 'Outfit_700Bold',
    fontSize: 17,
    color: colors.white,
  },
  growthCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  growthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  growthTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 17,
    color: colors.white,
  },
  growthPct: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.green,
  },
  chartInner: {
    gap: 8,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  dayLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    width: CHART_WIDTH / 7,
    textAlign: 'center',
  },
});
