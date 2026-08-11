import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

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
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
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
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0.85],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[colors.bgDeep, colors.bg, '#120628', colors.bg]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.orb,
          styles.orbTopRight,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.orbBottomLeft,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      <View style={[styles.orb, styles.orbCenter]} />

      <StarField />

      <LinearGradient
        colors={['transparent', 'rgba(5,1,15,0.35)', 'rgba(5,1,15,0.75)']}
        style={styles.bottomFade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orbTopRight: {
    width: width * 0.85,
    height: width * 0.85,
    top: -width * 0.25,
    right: -width * 0.3,
    backgroundColor: 'rgba(109, 40, 217, 0.35)',
  },
  orbBottomLeft: {
    width: width * 1.1,
    height: width * 1.1,
    bottom: -width * 0.35,
    left: -width * 0.45,
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
  },
  orbCenter: {
    width: width * 0.7,
    height: width * 0.7,
    top: height * 0.18,
    left: width * 0.15,
    backgroundColor: 'rgba(79, 70, 229, 0.12)',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.35,
  },
});
