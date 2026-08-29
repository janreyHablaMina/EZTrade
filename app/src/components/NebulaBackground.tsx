import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Bell, MessageCircle, Gift, CreditCard, ShieldCheck, Settings, Key, Zap, Clock, Lock, Receipt } from './Icons';

const { width, height } = Dimensions.get('window');
const useNativeDriver = Platform.OS !== 'web';

const ICONS = [Bell, MessageCircle, Gift, CreditCard, ShieldCheck, Settings, Key, Zap, Clock, Lock, Receipt];

function DoodlePattern() {
  const doodles = useMemo(() => {
    // Generate a grid of random icons
    const cols = 5;
    const rows = Math.ceil(height / (width / cols)) + 2;
    const cellW = width / cols;
    const cellH = cellW;
    
    const items = [];
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        // Pseudo-random selection based on row and col
        const randSeed = Math.abs(Math.sin(r * 12.9898 + c * 78.233)) * 43758.5453;
        const IconComponent = ICONS[Math.floor((randSeed * 100) % ICONS.length)];
        
        const offsetX = (randSeed * 100) % 20 - 10;
        const offsetY = (randSeed * 200) % 20 - 10;
        const rotation = (randSeed * 300) % 60 - 30; // -30deg to 30deg
        const size = 16 + (randSeed * 100) % 8; // 16 to 24

        items.push({
          key: `${r}-${c}`,
          IconComponent,
          left: c * cellW + cellW / 2 + offsetX,
          top: r * cellH + cellH / 2 + offsetY,
          rotation: `${rotation}deg`,
          size
        });
      }
    }
    return items;
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, styles.noPointer, { opacity: 0.04 }]}>
      {doodles.map((d) => {
        const Icon = d.IconComponent;
        return (
          <View
            key={d.key}
            style={{
              position: 'absolute',
              left: d.left - d.size / 2,
              top: d.top - d.size / 2,
              transform: [{ rotate: d.rotation }],
            }}
          >
            <Icon size={d.size} color="#ffffff" strokeWidth={1.5} />
          </View>
        );
      })}
    </View>
  );
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        key: i,
        left: (i * 97) % width,
        top: (i * 53) % (height * 0.72),
        size: i % 5 === 0 ? 2.2 : 1.2,
        opacity: 0.25 + ((i * 17) % 50) / 100,
      })),
    [],
  );

  return (
    <View style={[StyleSheet.absoluteFill, styles.noPointer]}>
      {stars.map((star) => (
        <View
          key={star.key}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: star.size,
            backgroundColor: colors.white,
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
}

export function NebulaBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.noPointer]}>
      <LinearGradient
        colors={[colors.bgDeep, colors.bg, '#120628', colors.bg]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <DoodlePattern />
      <StarField />

      <LinearGradient
        colors={['transparent', 'rgba(5,1,15,0.35)', 'rgba(5,1,15,0.75)']}
        style={styles.bottomFade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noPointer: {
    pointerEvents: 'none',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.35,
  },
});
