import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from '../components/auth/AuthScreen';
import { CheckBox } from '../components/auth/CheckBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';

type LoginScreenProps = {
  onLogin?: () => void;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
};

export function LoginScreen({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  onRegister,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <AuthScreen
      title="Welcome Back"
      subtitle="Login to continue to EZTRADE"
      onGoogle={onGoogleLogin}
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
        <Pressable onPress={onForgotPassword} hitSlop={8}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </Pressable>
      </View>
      <PrimaryButton label="Login" onPress={onLogin} />
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
  forgot: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
});
