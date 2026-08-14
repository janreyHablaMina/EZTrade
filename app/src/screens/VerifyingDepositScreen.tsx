import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

const STEPS = [
  'Checking transaction...',
  'Confirming amount...',
  'Confirming network...',
  'Finalizing...',
] as const;

type VerifyingDepositScreenProps = {
  onBack?: () => void;
  onComplete?: () => void;
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

function ShieldIcon() {
  return (
    <Svg width={54} height={54} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l7.5 3.2v5.4c0 4.6-3.1 8.4-7.5 9.8-4.4-1.4-7.5-5.2-7.5-9.8V6.2L12 3z"
        fill="#7c3aed"
        stroke="#c084fc"
        strokeWidth={1.2}
      />
      <Path
        d="M9 12l2.1 2.1L15.5 10"
        stroke={colors.white}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function StepCheck() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="11" fill="#22c55e" />
      <Path
        d="M7.5 12.4l3 3 6-6.4"
        stroke={colors.white}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function VerifyingDepositScreen({
  onBack,
  onComplete,
}: VerifyingDepositScreenProps) {
  const spin = useRef(new Animated.Value(0)).current;
  const [doneCount, setDoneCount] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    const timers = STEPS.map((_, index) =>
      setTimeout(() => setDoneCount(index + 1), 700 * (index + 1)),
    );
    const finish = setTimeout(() => onCompleteRef.current?.(), 700 * STEPS.length + 900);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <BackIcon />
        </Pressable>
        <Text style={styles.title}>Verifying Deposit</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.center}>
        <View style={styles.orbWrap}>
          <View style={styles.orbGlow} />
          <Animated.View style={[styles.ringWrap, { transform: [{ rotate }] }]}>
            <Svg width={168} height={168} viewBox="0 0 168 168">
              <Circle
                cx="84"
                cy="84"
                r="74"
                stroke="rgba(168, 85, 247, 0.18)"
                strokeWidth="3"
                fill="none"
              />
              <Circle
                cx="84"
                cy="84"
                r="74"
                stroke="#c084fc"
                strokeWidth="3.5"
                strokeDasharray="14 10"
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </Animated.View>
          <View style={styles.shieldWrap}>
            <ShieldIcon />
          </View>
        </View>

        <View style={styles.steps}>
          {STEPS.map((step, index) => {
            const done = index < doneCount;
            return (
              <View key={step} style={styles.stepRow}>
                {done ? (
                  <StepCheck />
                ) : (
                  <View style={styles.stepPending} />
                )}
                <Text style={[styles.stepText, done && styles.stepTextDone]}>
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.wait}>Please wait a moment.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 8,
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
  center: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 36,
  },
  orbWrap: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  orbGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.28)',
  },
  ringWrap: {
    position: 'absolute',
  },
  shieldWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 16, 31, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.45)',
  },
  steps: {
    width: '78%',
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  stepText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.45)',
  },
  stepTextDone: {
    color: colors.white,
  },
  wait: {
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.42)',
    paddingBottom: 36,
  },
});
