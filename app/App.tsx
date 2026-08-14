import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MainApp } from './src/MainApp';
import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { colors } from './src/theme/colors';

type Screen = 'splash' | 'onboarding' | 'login' | 'register' | 'home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });
  const [screen, setScreen] = useState<Screen>('splash');

  useEffect(() => {
    if (!fontsLoaded) return;

    const timer = setTimeout(() => {
      setScreen('onboarding');
    }, 2600);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  if (screen === 'splash') {
    return <SplashScreen fontsReady />;
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLogin={() => setScreen('home')}
        onGoogleLogin={() => setScreen('home')}
        onForgotPassword={() => {
          // Frontend only for now
        }}
        onRegister={() => setScreen('register')}
      />
    );
  }

  if (screen === 'register') {
    return (
      <RegisterScreen
        onCreateAccount={() => setScreen('home')}
        onGoogleSignUp={() => setScreen('home')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'home') {
    return <MainApp onLogout={() => setScreen('login')} />;
  }

  return (
    <OnboardingScreen
      onGetStarted={() => setScreen('login')}
      onLogin={() => setScreen('login')}
    />
  );
}
