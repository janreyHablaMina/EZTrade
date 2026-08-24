import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ViewToken
} from 'react-native';
import { GhostButton } from '../components/GhostButton';
import { NebulaBackground } from '../components/NebulaBackground';
import { PaginationDots } from '../components/PaginationDots';
import { PrimaryButton } from '../components/PrimaryButton';
import { HeroIllustration, HeroVariant } from '../components/onboarding/HeroIllustration';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type OnboardingScreenProps = {
  onGetStarted?: () => void;
};

const SLIDES = [
  {
    id: 'trade',
    title: "Smarter Trading,\nBigger Opportunities",
    subtitle: "Join EZTRADE and grow your assets with AI-driven strategies and real market opportunities.",
    variant: 'trade' as HeroVariant
  },
  {
    id: 'vip',
    title: "VIP Plans\nDesigned For You",
    subtitle: "Choose from multiple tiers tailored to your investment size and risk appetite.",
    variant: 'vip' as HeroVariant
  },
  {
    id: 'security',
    title: "Bank-Grade\nSecurity",
    subtitle: "Your funds are protected with industry-leading encryption and robust KYC protocols.",
    variant: 'security' as HeroVariant
  },
  {
    id: 'network',
    title: "Start Earning\nToday",
    subtitle: "Invite friends to build your network and earn passive commission daily.",
    variant: 'network' as HeroVariant
  }
];

export function OnboardingScreen({
  onGetStarted,
}: OnboardingScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  const [activeIndex, setActiveIndex] = useState(0);

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

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />

      <View style={styles.content}>
        <Animated.View
          style={{
            flex: 1,
            opacity,
            transform: [{ translateY }],
          }}
        >
          <FlatList
            data={SLIDES}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item }) => (
              <View style={[styles.slide, { width: SCREEN_WIDTH - 56 }]}>
                <View style={styles.copy}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>

                <HeroIllustration variant={item.variant} />
              </View>
            )}
          />

          <View style={styles.paginationContainer}>
            <PaginationDots total={SLIDES.length} activeIndex={activeIndex} />
          </View>
        </Animated.View>

        <View style={styles.actions}>
          <PrimaryButton label="Get Started" onPress={onGetStarted} />
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
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
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
  paginationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
