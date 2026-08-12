import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors } from '../../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

function CryptoCoin({
  size,
  color,
  letter,
  style,
}: {
  size: number;
  color: string;
  letter: string;
  style?: object;
}) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id={`coin-${letter}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <Stop offset="40%" stopColor={color} />
            <Stop offset="100%" stopColor={color} stopOpacity="0.85" />
          </LinearGradient>
        </Defs>
        <Circle cx="32" cy="32" r="30" fill={`url(#coin-${letter})`} />
        <Circle
          cx="32"
          cy="32"
          r="24"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
        />
      </Svg>
      <View style={styles.coinLetterWrap}>
        <Text style={[styles.coinLetter, { fontSize: size * 0.34 }]}>
          {letter}
        </Text>
      </View>
    </View>
  );
}

function PhoneMock() {
  return (
    <Svg width={168} height={250} viewBox="0 0 168 250">
      <Defs>
        <LinearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#2a1848" />
          <Stop offset="100%" stopColor="#12081f" />
        </LinearGradient>
        <LinearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#1a0b36" />
          <Stop offset="100%" stopColor="#0b0418" />
        </LinearGradient>
        <LinearGradient id="chartLine" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0%" stopColor="#c084fc" />
          <Stop offset="100%" stopColor="#f0abfc" />
        </LinearGradient>
        <LinearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
          <Stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      <Rect
        x="10"
        y="6"
        width="148"
        height="238"
        rx="28"
        fill="url(#phoneBody)"
        stroke="#7c3aed"
        strokeWidth="3"
      />
      <Rect
        x="20"
        y="22"
        width="128"
        height="206"
        rx="18"
        fill="url(#screenGrad)"
      />
      <Rect x="62" y="12" width="44" height="8" rx="4" fill="#3b215f" />

      <Path
        d="M34 170 C52 160, 58 145, 72 130 C86 115, 96 120, 108 100 C120 80, 128 70, 140 55 L140 190 L34 190 Z"
        fill="url(#chartFill)"
      />
      <Path
        d="M34 170 C52 160, 58 145, 72 130 C86 115, 96 120, 108 100 C120 80, 128 70, 140 55"
        fill="none"
        stroke="url(#chartLine)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Circle cx="140" cy="55" r="5" fill="#f5d0fe" />
    </Svg>
  );
}

export function HeroIllustration() {
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeFloat = (value: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            useNativeDriver,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver,
          }),
        ]),
      );

    const a = makeFloat(floatA, 2400);
    const b = makeFloat(floatB, 2800);
    const c = makeFloat(floatC, 3200);
    const g = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1800,
          useNativeDriver,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1800,
          useNativeDriver,
        }),
      ]),
    );

    a.start();
    b.start();
    c.start();
    g.start();

    return () => {
      a.stop();
      b.stop();
      c.stop();
      g.stop();
    };
  }, [floatA, floatB, floatC, glow]);

  const lift = (value: Animated.Value, distance: number) =>
    value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -distance],
    });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.baseGlow,
          {
            opacity: glow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 0.8],
            }),
            transform: [
              {
                scale: glow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.08],
                }),
              },
            ],
          },
        ]}
      />

      <Svg
        width={280}
        height={70}
        style={styles.pedestal}
        viewBox="0 0 280 70"
      >
        <Defs>
          <LinearGradient id="pedestal" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Ellipse cx="140" cy="28" rx="110" ry="18" fill="url(#pedestal)" />
        <Ellipse
          cx="140"
          cy="28"
          rx="70"
          ry="10"
          fill="#c084fc"
          opacity={0.35}
        />
      </Svg>

      <Animated.View
        style={[
          styles.phone,
          {
            transform: [
              { rotate: '-18deg' },
              { translateY: lift(floatB, 8) },
            ],
          },
        ]}
      >
        <PhoneMock />
      </Animated.View>

      <Animated.View
        style={[
          styles.btc,
          { transform: [{ translateY: lift(floatA, 10) }] },
        ]}
      >
        <CryptoCoin size={58} color="#f59e0b" letter="₿" />
      </Animated.View>

      <Animated.View
        style={[
          styles.eth,
          { transform: [{ translateY: lift(floatC, 12) }] },
        ]}
      >
        <CryptoCoin size={50} color="#3b82f6" letter="◆" />
      </Animated.View>

      <Animated.View
        style={[
          styles.usdt,
          { transform: [{ translateY: lift(floatA, 9) }] },
        ]}
      >
        <CryptoCoin size={54} color="#14b8a6" letter="₮" />
      </Animated.View>

      <View style={styles.sparkA} />
      <View style={styles.sparkB} />
      <View style={styles.sparkC} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseGlow: {
    position: 'absolute',
    bottom: 28,
    width: 220,
    height: 90,
    borderRadius: 999,
    backgroundColor: 'rgba(139, 92, 246, 0.28)',
  },
  pedestal: {
    position: 'absolute',
    bottom: 18,
  },
  phone: {
    zIndex: 2,
    shadowColor: colors.purpleBright,
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  btc: {
    position: 'absolute',
    left: 28,
    top: 48,
    zIndex: 3,
  },
  eth: {
    position: 'absolute',
    left: 42,
    bottom: 70,
    zIndex: 3,
  },
  usdt: {
    position: 'absolute',
    right: 34,
    top: 110,
    zIndex: 3,
  },
  coinLetterWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinLetter: {
    color: '#fff',
    fontFamily: 'Outfit_800ExtraBold',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 4,
  },
  sparkA: {
    position: 'absolute',
    top: 40,
    right: 70,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e9d5ff',
  },
  sparkB: {
    position: 'absolute',
    top: 90,
    left: 70,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#c4b5fd',
  },
  sparkC: {
    position: 'absolute',
    bottom: 90,
    right: 60,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ddd6fe',
  },
});
