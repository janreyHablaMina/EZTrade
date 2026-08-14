import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SPARK_W = 112;
const SPARK_H = 26;
const POINT_COUNT = 16;

const MARKETS = [
  { symbol: 'BTC', badge: '₿', color: '#f59e0b', base: 68320.5, digits: 2, vol: 0.004 },
  { symbol: 'ETH', badge: '◆', color: '#3b82f6', base: 3450.1, digits: 2, vol: 0.005 },
  { symbol: 'USDT', badge: '₮', color: '#14b8a6', base: 1.0, digits: 4, vol: 0.0004 },
  { symbol: 'BNB', badge: 'B', color: '#f59e0b', base: 582.4, digits: 2, vol: 0.0045 },
  { symbol: 'SOL', badge: 'S', color: '#a855f7', base: 148.75, digits: 2, vol: 0.007 },
  { symbol: 'XRP', badge: 'X', color: '#64748b', base: 0.62, digits: 4, vol: 0.006 },
] as const;

function seedWalk(base: number, vol: number) {
  const points = [base];
  for (let i = 1; i < POINT_COUNT; i += 1) {
    const next = points[i - 1] * (1 + (Math.random() - 0.5) * vol);
    points.push(next);
  }
  return points;
}

function toPath(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * SPARK_W;
      const y = SPARK_H - ((value - min) / span) * (SPARK_H - 6) - 3;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function formatPrice(value: number, digits: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${value.toFixed(digits)}`;
}

function formatChange(value: number, base: number) {
  const pct = ((value - base) / base) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

function MarketCard({
  symbol,
  badge,
  color,
  base,
  digits,
  vol,
  delay,
}: (typeof MARKETS)[number] & { delay: number }) {
  const [points, setPoints] = useState(() => seedWalk(base, vol));
  const price = points[points.length - 1];
  const up = price >= base;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        const drift = (Math.random() - 0.48) * vol;
        const next = Math.max(base * 0.92, last * (1 + drift));
        return [...prev.slice(1), next];
      });
      timer = setTimeout(tick, 700 + Math.random() * 700);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [base, delay, vol]);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={[styles.change, !up && styles.changeDown]}>
          {formatChange(price, base)}
        </Text>
      </View>
      <Text style={styles.price}>{formatPrice(price, digits)}</Text>
      <Svg width={SPARK_W} height={SPARK_H} viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}>
        <Path
          d={toPath(points)}
          stroke={up ? colors.green : '#f87171'}
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function MarketOverview() {
  return (
    <>
      <Text style={styles.title}>Market Overview</Text>
      <View style={styles.grid}>
        {MARKETS.map((item, index) => (
          <MarketCard key={item.symbol} {...item} delay={index * 180} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 4,
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: (SCREEN_WIDTH - 40 - 10) / 2,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 12,
  },
  symbol: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
    flex: 1,
  },
  change: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.green,
  },
  changeDown: {
    color: '#f87171',
  },
  price: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
});
