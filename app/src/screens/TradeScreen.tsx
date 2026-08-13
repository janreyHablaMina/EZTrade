import { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 72;
const CHART_HEIGHT = 200;
const TIMEFRAMES = ['1H', '4H', '1D', '1W'] as const;

type Timeframe = (typeof TIMEFRAMES)[number];

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

type TradeScreenProps = {
  onBack?: () => void;
};

const CANDLES: Candle[] = [
  { open: 62, close: 48, high: 42, low: 68 },
  { open: 50, close: 58, high: 44, low: 64 },
  { open: 56, close: 40, high: 34, low: 62 },
  { open: 42, close: 54, high: 36, low: 60 },
  { open: 52, close: 38, high: 30, low: 58 },
  { open: 40, close: 55, high: 34, low: 62 },
  { open: 53, close: 45, high: 38, low: 60 },
  { open: 46, close: 60, high: 40, low: 66 },
  { open: 58, close: 42, high: 36, low: 64 },
  { open: 44, close: 52, high: 38, low: 58 },
  { open: 50, close: 36, high: 30, low: 56 },
  { open: 38, close: 50, high: 32, low: 56 },
  { open: 48, close: 34, high: 28, low: 54 },
  { open: 36, close: 28, high: 22, low: 42 },
  { open: 30, close: 44, high: 24, low: 50 },
  { open: 42, close: 32, high: 26, low: 48 },
  { open: 34, close: 48, high: 28, low: 54 },
  { open: 46, close: 38, high: 32, low: 52 },
  { open: 40, close: 26, high: 20, low: 46 },
  { open: 28, close: 18, high: 12, low: 36 },
];

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

function BtcIcon() {
  return (
    <View style={styles.btcBadge}>
      <Text style={styles.btcBadgeText}>₿</Text>
    </View>
  );
}

function DownChevron() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TradingChart() {
  const layout = useMemo(() => {
    const gap = 4;
    const bodyWidth =
      (CHART_WIDTH - gap * (CANDLES.length + 1)) / CANDLES.length;

    return CANDLES.map((candle, index) => {
      const x = gap + index * (bodyWidth + gap);
      const up = candle.close <= candle.open;
      const color = up ? '#22c55e' : '#ef4444';
      const bodyTop = Math.min(candle.open, candle.close);
      const bodyHeight = Math.max(Math.abs(candle.open - candle.close), 4);
      const wickX = x + bodyWidth / 2;

      return {
        key: index,
        x,
        wickX,
        bodyTop,
        bodyHeight,
        bodyWidth,
        high: candle.high,
        low: candle.low,
        color,
      };
    });
  }, []);

  return (
    <View style={styles.chartWrap}>
      <Text style={styles.chartOverlay}>10, USDG</Text>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <Line
            key={ratio}
            x1={0}
            y1={CHART_HEIGHT * ratio}
            x2={CHART_WIDTH}
            y2={CHART_HEIGHT * ratio}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}
        {layout.map((candle) => (
          <Line
            key={`wick-${candle.key}`}
            x1={candle.wickX}
            y1={candle.high}
            x2={candle.wickX}
            y2={candle.low}
            stroke={candle.color}
            strokeWidth={1.5}
            opacity={0.85}
          />
        ))}
        {layout.map((candle) => (
          <Rect
            key={`body-${candle.key}`}
            x={candle.x}
            y={candle.bodyTop}
            width={candle.bodyWidth}
            height={candle.bodyHeight}
            rx={2}
            fill={candle.color}
          />
        ))}
      </Svg>
    </View>
  );
}

export function TradeScreen({ onBack }: TradeScreenProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <BackIcon />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Live Trading</Text>
          <View style={styles.vipChip}>
            <Text style={styles.vipChipText}>VIP 1 • Active</Text>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.priceCard}>
        <View style={styles.priceTop}>
          <View style={styles.pairRow}>
            <BtcIcon />
            <Text style={styles.pairText}>BTC/USDT</Text>
          </View>
          <Text style={styles.changeText}>+2.45%</Text>
        </View>
        <Text style={styles.priceValue}>68,320.50</Text>
      </View>

      <View style={styles.chartCard}>
        <TradingChart />
        <View style={styles.timeframes}>
          {TIMEFRAMES.map((item) => {
            const active = item === timeframe;
            return (
              <Pressable
                key={item}
                style={[styles.timeBtn, active && styles.timeBtnActive]}
                onPress={() => setTimeframe(item)}
              >
                <Text
                  style={[styles.timeText, active && styles.timeTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.positionCard}>
        <View style={styles.positionRow}>
          <Text style={styles.positionLabel}>Position</Text>
          <Text style={styles.positionLong}>Long</Text>
        </View>
        <View style={styles.positionRow}>
          <Text style={styles.positionLabel}>Entry Price</Text>
          <Text style={styles.positionValue}>68,120.00</Text>
        </View>
        <View style={styles.positionRow}>
          <Text style={styles.positionLabel}>Current Price</Text>
          <Text style={styles.positionValue}>68,320.50</Text>
        </View>
        <View style={[styles.positionRow, styles.positionRowLast]}>
          <Text style={styles.positionLabel}>Profit</Text>
          <Text style={styles.positionProfit}>+0.29%</Text>
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Trades are executed automatically by our AI system.
        </Text>
        <DownChevron />
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
  },
  title: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  vipChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.28)',
  },
  vipChipText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#86efac',
  },
  headerSpacer: {
    width: 40,
  },
  priceCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  priceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btcBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btcBadgeText: {
    color: colors.white,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
  },
  pairText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  changeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.green,
  },
  priceValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 34,
    color: colors.white,
  },
  chartCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 22,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  chartWrap: {
    position: 'relative',
  },
  chartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  timeframes: {
    flexDirection: 'row',
    gap: 8,
  },
  timeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  timeBtnActive: {
    backgroundColor: 'rgba(109, 40, 217, 0.55)',
  },
  timeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  timeTextActive: {
    color: colors.white,
  },
  positionCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  positionRowLast: {
    borderBottomWidth: 0,
  },
  positionLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  positionValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  positionLong: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.green,
  },
  positionProfit: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.green,
  },
  note: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  noteText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
});
