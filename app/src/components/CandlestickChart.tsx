import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Line, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

const { width } = Dimensions.get('window');

type Candle = {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
};

const CANDLES: Candle[] = [
  { x: 16, open: 122, close: 104, high: 94, low: 132 },
  { x: 46, open: 116, close: 96, high: 86, low: 126 },
  { x: 76, open: 108, close: 88, high: 78, low: 118 },
  { x: 106, open: 100, close: 76, high: 66, low: 112 },
  { x: 136, open: 90, close: 68, high: 56, low: 102 },
  { x: 166, open: 80, close: 56, high: 44, low: 92 },
  { x: 196, open: 70, close: 44, high: 32, low: 82 },
  { x: 226, open: 60, close: 34, high: 22, low: 72 },
  { x: 256, open: 50, close: 26, high: 14, low: 62 },
  { x: 286, open: 40, close: 16, high: 6, low: 52 },
];

const BODY_WIDTH = 15;
const CHART_HEIGHT = 150;
const CHART_WIDTH = 320;

export function CandlestickChart() {
  const entrance = useRef(new Animated.Value(0)).current;
  const candleAnims = useRef(CANDLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 800,
      delay: 350,
      useNativeDriver,
    }).start();

    Animated.stagger(
      70,
      candleAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 420,
          useNativeDriver,
        }),
      ),
    ).start();
  }, [candleAnims, entrance]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [28, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.glow} />
      <View style={styles.chart}>
        {CANDLES.map((candle, index) => {
          const bodyTop = Math.min(candle.open, candle.close);
          const bodyHeight = Math.max(Math.abs(candle.open - candle.close), 5);
          const wickX = candle.x + BODY_WIDTH / 2;

          return (
            <Animated.View
              key={candle.x}
              style={[
                StyleSheet.absoluteFill,
                {
                  opacity: candleAnims[index],
                  transform: [
                    {
                      translateY: candleAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                <Defs>
                  <LinearGradient
                    id={`grad-${candle.x}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <Stop
                      offset="0%"
                      stopColor={colors.candleGlow}
                      stopOpacity="0.95"
                    />
                    <Stop
                      offset="100%"
                      stopColor={colors.candle}
                      stopOpacity="0.7"
                    />
                  </LinearGradient>
                </Defs>
                <Line
                  x1={wickX}
                  y1={candle.high}
                  x2={wickX}
                  y2={candle.low}
                  stroke={colors.candleGlow}
                  strokeWidth={2}
                  opacity={0.8}
                />
                <Rect
                  x={candle.x}
                  y={bodyTop}
                  width={BODY_WIDTH}
                  height={bodyHeight}
                  rx={2.5}
                  fill={`url(#grad-${candle.x})`}
                />
              </Svg>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: width * 0.05,
    right: -width * 0.1,
    bottom: 20,
    height: CHART_HEIGHT + 36,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    pointerEvents: 'none',
  },
  glow: {
    position: 'absolute',
    bottom: 8,
    right: width * 0.08,
    width: width * 0.75,
    height: 100,
    borderRadius: 999,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  chart: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
  },
});
