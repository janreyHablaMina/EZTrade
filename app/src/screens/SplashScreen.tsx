import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { CandlestickChart } from '../components/CandlestickChart';
import { NebulaBackground } from '../components/NebulaBackground';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

type SplashScreenProps = {
  fontsReady?: boolean;
};

export function SplashScreen({ fontsReady = true }: SplashScreenProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (!fontsReady) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 550,
          useNativeDriver,
        }),
      ]),
    ]).start();
  }, [fontsReady, logoOpacity, logoScale, textOpacity, textTranslate]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoGlow} />
          <BrandLogo size={108} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
            alignItems: 'center',
          }}
        >
          <Text style={styles.brand}>
            <Text style={styles.brandEz}>EZ</Text>
            <Text style={styles.brandTrade}>TRADE</Text>
          </Text>
          <Text style={styles.tagline}>Trade Smarter. Earn Together.</Text>
        </Animated.View>
      </View>

      <CandlestickChart />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 90,
  },
  logoWrap: {
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.28)',
  },
  brand: {
    color: colors.white,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  brandEz: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 42,
    fontStyle: 'italic',
    color: colors.white,
  },
  brandTrade: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 42,
    color: colors.white,
  },
  tagline: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: colors.whiteMuted,
    letterSpacing: 0.2,
  },
});
