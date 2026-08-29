import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { MainApp } from './src/MainApp';
import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { VerifyOtpScreen } from './src/screens/VerifyOtpScreen';
import { colors } from './src/theme/colors';

type Screen = 'splash' | 'onboarding' | 'login' | 'register' | 'verify-otp' | 'home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<any>(null);
  const [registrationEmail, setRegistrationEmail] = useState('');

  useEffect(() => {
    if (!fontsLoaded) return;

    const { DeviceEventEmitter, Alert } = require('react-native');
    const suspendListener = DeviceEventEmitter.addListener('account_suspended', async () => {
      await SecureStore.deleteItemAsync('saved_user');
      setUser(null);
      setScreen('login');
      Alert.alert(
        'Account Suspended',
        'Your account has been suspended or deactivated. Please contact support.',
        [{ text: 'OK' }]
      );
    });

    SecureStore.getItemAsync('saved_user').then((savedUserStr) => {
      const timer = setTimeout(() => {
        if (savedUserStr) {
          setUser(JSON.parse(savedUserStr));
          setScreen('home');
        } else {
          setScreen('onboarding');
        }
      }, 2600);
      return () => clearTimeout(timer);
    }).catch(() => {
      setTimeout(() => {
        setScreen('onboarding');
      }, 2600);
    });

    return () => {
      suspendListener.remove();
    };
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
        onLogin={(user) => {
          setUser(user);
          setScreen('home');
        }}
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
        onCreateAccount={(email) => {
          setRegistrationEmail(email);
          setScreen('verify-otp');
        }}
        onGoogleSignUp={() => setScreen('home')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'verify-otp') {
    return (
      <VerifyOtpScreen
        email={registrationEmail}
        onVerified={(newUser) => {
          setUser(newUser);
          setScreen('home');
        }}
        onBack={() => setScreen('register')}
      />
    );
  }

  if (screen === 'home') {
    return <MainApp user={user} onLogout={async () => {
      await SecureStore.deleteItemAsync('saved_user');
      setUser(null);
      setScreen('login');
    }} />;
  }

  return (
    <OnboardingScreen
      onGetStarted={() => setScreen('login')}
      onLogin={() => setScreen('login')}
    />
  );
}
