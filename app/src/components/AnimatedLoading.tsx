import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { colors } from '../theme/colors';

type AnimatedLoadingProps = {
  text?: string;
};

export function AnimatedLoading({ text = 'Loading...' }: AnimatedLoadingProps) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 0.9, duration: 800, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [pulseAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            opacity: pulseAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    backgroundColor: colors.bg,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(192, 132, 252, 0.25)',
    borderWidth: 2,
    borderColor: colors.purpleBright,
    shadowColor: colors.purpleBright,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  text: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    letterSpacing: 1,
  },
});
