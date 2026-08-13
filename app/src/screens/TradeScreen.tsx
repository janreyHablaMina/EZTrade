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
import Svg, { Path } from 'react-native-svg';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

type TradeScreenProps = {
  onBack?: () => void;
};

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6l-6 6 6 6"
        stroke={colors.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={colors.white}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PulseRings({ active }: { active: boolean }) {
  const a = useRef(new Animated.Value(0)).current;
  const b = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      a.setValue(0);
      b.setValue(0);
      return;
    }

    const loop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 1800,
            useNativeDriver,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver,
          }),
        ]),
      );

    const one = loop(a, 0);
    const two = loop(b, 700);
    one.start();
    two.start();
    return () => {
      one.stop();
      two.stop();
    };
  }, [a, b, active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[a, b].map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.pulseRing,
            {
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.35, 0],
              }),
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1.35],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

export function TradeScreen({ onBack }: TradeScreenProps) {
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const claimScale = useRef(new Animated.Value(1)).current;

  const handleQuantify = () => {
    if (claimed || claiming) return;

    setClaiming(true);
    Animated.sequence([
      Animated.timing(claimScale, {
        toValue: 0.94,
        duration: 120,
        useNativeDriver,
      }),
      Animated.timing(claimScale, {
        toValue: 1,
        duration: 180,
        useNativeDriver,
      }),
    ]).start(() => {
      setClaiming(false);
      setClaimed(true);
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <BackIcon />
        </Pressable>
        <Text style={styles.title}>Daily Quantify</Text>
        <View style={styles.headerSpacer} />
      </View>

      <LinearGradient
        colors={['#7c3aed', '#5b21b6', '#312e81']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroGlow} />
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>Today's reward</Text>
          <View style={[styles.statusChip, claimed && styles.statusChipDone]}>
            <View
              style={[styles.statusDot, claimed && styles.statusDotDone]}
            />
            <Text
              style={[styles.statusText, claimed && styles.statusTextDone]}
            >
              {claimed ? 'Claimed' : 'Ready'}
            </Text>
          </View>
        </View>

        <Text style={styles.rewardAmount}>+2.00</Text>
        <Text style={styles.rewardUnit}>USDT</Text>
        <Text style={styles.heroHint}>
          {claimed
            ? 'Come back tomorrow for the next reward.'
            : 'Tap Quantify to claim your VIP daily profit.'}
        </Text>
      </LinearGradient>

      <View style={styles.planCard}>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Active plan</Text>
          <Text style={styles.planValue}>VIP 1</Text>
        </View>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Daily rate</Text>
          <Text style={styles.planValueGreen}>+20%</Text>
        </View>
        <View style={[styles.planRow, styles.planRowLast]}>
          <Text style={styles.planLabel}>Deposit</Text>
          <Text style={styles.planValue}>10 USDT</Text>
        </View>
      </View>

      <View style={styles.actionCard}>
        <Animated.View
          style={[
            styles.quantifyWrap,
            { transform: [{ scale: claimScale }] },
          ]}
        >
          <PulseRings active={!claimed} />
          {claimed ? (
            <View style={styles.claimedCircle}>
              <CheckIcon />
              <Text style={styles.claimedCircleText}>Done</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleQuantify}
              disabled={claiming}
              style={styles.quantifyPressable}
            >
              <LinearGradient
                colors={['#a855f7', '#7c3aed', '#5b21b6']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.quantifyCircle}
              >
                <Text style={styles.quantifyTitle}>Quantify</Text>
                <Text style={styles.quantifySub}>Claim now</Text>
              </LinearGradient>
            </Pressable>
          )}
        </Animated.View>

        <Text style={styles.actionHint}>
          {claimed
            ? 'Reward added to your available balance.'
            : 'One claim per day · resets at midnight UTC'}
        </Text>

        {!claimed ? (
          <PrimaryButton
            label={claiming ? 'Quantifying...' : 'Quantify & Claim'}
            onPress={handleQuantify}
            disabled={claiming}
          />
        ) : (
          <View style={styles.claimedBanner}>
            <Text style={styles.claimedBannerText}>
              +2.00 USDT claimed successfully
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        {[
          'Your VIP plan generates daily profit automatically.',
          'Open Quantify once a day to claim the reward.',
          'Claimed USDT is added to your available balance.',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  headerSpacer: {
    width: 40,
  },
  heroCard: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(192, 132, 252, 0.28)',
    top: -80,
    right: -50,
  },
  heroTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heroLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(250, 204, 21, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.35)',
  },
  statusChipDone: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    borderColor: 'rgba(134, 239, 172, 0.35)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#facc15',
  },
  statusDotDone: {
    backgroundColor: '#4ade80',
  },
  statusText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: '#fde68a',
  },
  statusTextDone: {
    color: '#bbf7d0',
  },
  rewardAmount: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 52,
    color: colors.white,
    letterSpacing: -1,
  },
  rewardUnit: {
    marginTop: -4,
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
  },
  heroHint: {
    marginTop: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 18,
  },
  planCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 22,
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
  planValueGreen: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#4ade80',
  },
  actionCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  quantifyWrap: {
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.7)',
  },
  quantifyPressable: {
    borderRadius: 84,
  },
  quantifyCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  quantifyTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
  },
  quantifySub: {
    marginTop: 4,
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
  },
  claimedCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(134, 239, 172, 0.45)',
  },
  claimedCircleText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#bbf7d0',
  },
  actionHint: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  claimedBanner: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.28)',
  },
  claimedBannerText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: '#86efac',
  },
  infoCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 22,
    padding: 16,
    gap: 14,
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
