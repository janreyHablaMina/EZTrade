import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';
const RING_SIZE = 188;
const RING_R = 82;
const RING_C = 2 * Math.PI * RING_R;
const DAY_MS = 24 * 60 * 60 * 1000;
const REWARD = 2;

type TradeScreenProps = {
  onBack?: () => void;
};

function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function ProgressRing({ progress }: { progress: number }) {
  const offset = RING_C * (1 - progress);

  return (
    <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_R}
        stroke="rgba(167, 139, 250, 0.18)"
        strokeWidth={8}
        fill="none"
      />
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_R}
        stroke={colors.purpleBright}
        strokeWidth={8}
        fill="none"
        strokeDasharray={`${RING_C} ${RING_C}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    </Svg>
  );
}

export function TradeScreen({ onBack }: TradeScreenProps) {
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [remaining, setRemaining] = useState(DAY_MS);
  const claimScale = useRef(new Animated.Value(1)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -6,
          duration: 1400,
          useNativeDriver,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1400,
          useNativeDriver,
        }),
      ]),
    );
    if (!claimed) loop.start();
    else {
      loop.stop();
      floatY.setValue(0);
    }
    return () => loop.stop();
  }, [claimed, floatY]);

  useEffect(() => {
    if (!claimed) return;
    const endsAt = Date.now() + DAY_MS;
    const tick = () => setRemaining(Math.max(0, endsAt - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [claimed]);

  const handleQuantify = () => {
    if (claimed || claiming) return;
    setClaiming(true);
    Animated.sequence([
      Animated.timing(claimScale, {
        toValue: 0.92,
        duration: 110,
        useNativeDriver,
      }),
      Animated.spring(claimScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver,
      }),
    ]).start(() => {
      setClaiming(false);
      setClaimed(true);
    });
  };

  const progress = claimed ? remaining / DAY_MS : 1;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader title="Trade" onBack={onBack} padded={false} />
      <Text style={styles.subtitle}>Daily Quantify</Text>

      <View style={styles.hero}>
        <Animated.View
          style={{
            transform: [{ translateY: claimed ? 0 : floatY }, { scale: claimScale }],
          }}
        >
          <View style={styles.orbWrap}>
            <ProgressRing progress={progress} />
            {claimed ? (
              <View style={styles.orbDone}>
                <CheckIcon size={28} color={colors.white} />
                <Text style={styles.orbDoneTitle}>Claimed</Text>
                <Text style={styles.orbDoneSub}>{formatClock(remaining)}</Text>
              </View>
            ) : (
              <Pressable
                onPress={handleQuantify}
                disabled={claiming}
                style={styles.orbPress}
              >
                <LinearGradient
                  colors={['#c084fc', '#7c3aed', '#4c1d95']}
                  start={{ x: 0.15, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                  style={styles.orb}
                >
                  <Text style={styles.orbKicker}>Tap to</Text>
                  <Text style={styles.orbTitle}>
                    {claiming ? '...' : 'Quantify'}
                  </Text>
                  <Text style={styles.orbReward}>+{REWARD.toFixed(2)} USDT</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </Animated.View>

        <Text style={styles.heroHint}>
          {claimed
            ? 'Next reward unlocks when the timer hits zero.'
            : 'Claim today’s VIP profit. One tap per day.'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Days Left</Text>
          <Text style={styles.statValue}>{claimed ? '59 days' : '60 days'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={[styles.statValue, claimed && styles.statGreen]}>
            {claimed ? `+${REWARD.toFixed(2)}` : 'Ready'}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Plan</Text>
          <Text style={styles.statValue}>VIP 1</Text>
        </View>
      </View>

      <View style={styles.planCard}>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Daily rate</Text>
          <Text style={styles.planGreen}>+20%</Text>
        </View>
        <View style={[styles.planRow, styles.planRowLast]}>
          <Text style={styles.planLabel}>Deposit</Text>
          <Text style={styles.planValue}>10 USDT</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        {[
          'Your VIP plan earns a daily reward automatically.',
          'Quantify once a day to add it to your balance.',
          'Come back after the countdown for the next claim.',
        ].map((step, index) => (
          <View key={step} style={styles.infoRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.infoText}>{step}</Text>
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
    paddingBottom: 28,
    gap: 14,
  },
  subtitle: {
    marginTop: -8,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  orbWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbPress: {
    width: 148,
    height: 148,
    borderRadius: 74,
  },
  orb: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  orbKicker: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  orbTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 24,
    color: colors.white,
    marginTop: 2,
  },
  orbReward: {
    marginTop: 4,
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: '#bbf7d0',
  },
  orbDone: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.4)',
  },
  orbDoneTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#bbf7d0',
  },
  orbDoneSub: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  heroHint: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
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
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  statValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  statGreen: {
    color: '#4ade80',
  },
  planCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  planRowLast: {
    borderBottomWidth: 0,
  },
  planLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  planValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  planGreen: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#4ade80',
  },
  infoCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  infoTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    marginTop: 1,
  },
  stepBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 19,
  },
});
