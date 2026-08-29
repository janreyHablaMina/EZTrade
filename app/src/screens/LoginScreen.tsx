import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AuthScreen } from '../components/auth/AuthScreen';
import { CheckBox } from '../components/auth/CheckBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { apiClient } from '../lib/api';

type LoginScreenProps = {
  onLogin?: (user: any) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
};

export function LoginScreen({
  onLogin,
  onForgotPassword,
  onRegister,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    SecureStore.getItemAsync('saved_email').then((savedEmail) => {
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }).catch(console.error);
  }, []);

  const canLogin = email.trim().length > 3 && password.length > 0;

  const handleLogin = async () => {
    if (!canLogin) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await apiClient.post('/login', {
        email: email.trim(),
        password: password,
      });

      if (rememberMe) {
        await SecureStore.setItemAsync('saved_email', email.trim());
        await SecureStore.setItemAsync('saved_user', JSON.stringify(response.user));
      } else {
        await SecureStore.deleteItemAsync('saved_email');
        await SecureStore.deleteItemAsync('saved_user');
      }

      onLogin?.(response.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <AuthScreen
      title="Welcome Back"
      subtitle="Login to continue to EZTRADE"
      footerPrompt="Don't have an account?"
      footerAction="Register"
      onFooterPress={onRegister}
    >
      <TextField
        label="Email or Username"
        placeholder="john.doe@email.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label="Password"
        placeholder="••••••••••"
        isPassword
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.row}>
        <CheckBox
          checked={rememberMe}
          onToggle={() => setRememberMe((value) => !value)}
        >
          Remember me
        </CheckBox>
      </View>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}
      <PrimaryButton 
        label={isLoading ? "Logging in..." : "Login"} 
        onPress={handleLogin} 
        disabled={!canLogin || isLoading}
      />
    </AuthScreen>

  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 4,
  },
  errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#f87171',
    marginTop: -4,
    marginBottom: 8,
  },
});
