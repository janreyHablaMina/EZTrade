import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GhostButton } from '../components/GhostButton';
import { NebulaBackground } from '../components/NebulaBackground';
import { PaginationDots } from '../components/PaginationDots';
import { PrimaryButton } from '../components/PrimaryButton';
import { HeroIllustration } from '../components/onboarding/HeroIllustration';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

type OnboardingScreenProps = {
  onGetStarted?: () => void;
  onLogin?: () => void;
};

export function OnboardingScreen({
  onGetStarted,
  onLogin,
}: OnboardingScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 550,
        useNativeDriver,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 550,
        useNativeDriver,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />

      <View style={styles.content}>
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
          }}
        >
          <View style={styles.copy}>
            <Text style={styles.title}>
              Smarter Trading,{'\n'}Bigger Opportunities
            </Text>
            <Text style={styles.subtitle}>
              Join EZTRADE and grow your assets with AI-driven strategies and
              real market opportunities.
            </Text>
          </View>

          <HeroIllustration />

          <PaginationDots total={4} activeIndex={0} />
        </Animated.View>

        <View style={styles.actions}>
          <PrimaryButton label="Get Started" onPress={onGetStarted} />
          <GhostButton label="Login" onPress={onLogin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  copy: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 30,
    lineHeight: 38,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(226, 214, 255, 0.72)',
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
