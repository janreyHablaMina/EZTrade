import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { GoogleIcon } from '../components/GoogleIcon';
import { NebulaBackground } from '../components/NebulaBackground';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';

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
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoGlow} />
            <BrandLogo size={78} />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue to EZTRADE</Text>
          </View>

          <View style={styles.form}>
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
              <Pressable
                style={styles.remember}
                onPress={() => setRememberMe((value) => !value)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>

              <Pressable onPress={onForgotPassword} hitSlop={8}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </Pressable>
            </View>

            <PrimaryButton label="Login" onPress={onLogin} />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.googlePressed,
            ]}
            onPress={onGoogleLogin}
          >
            <GoogleIcon />
            <Text style={styles.googleLabel}>Continue with Google</Text>
          </Pressable>

          <Pressable style={styles.footer} onPress={onRegister}>
            <Text style={styles.footerText}>
              Don&apos;t have an account?{' '}
              <Text style={styles.register}>Register</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    zIndex: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGlow: {
    position: 'absolute',
    top: -8,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  title: {
    marginTop: 18,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 30,
    color: colors.white,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: 'rgba(226, 214, 255, 0.7)',
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 4,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.purpleBright,
    borderColor: colors.purpleBright,
  },
  checkMark: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 14,
  },
  rememberText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  forgot: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(226, 214, 255, 0.55)',
  },
  googleButton: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.55)',
    backgroundColor: 'rgba(18, 8, 36, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googlePressed: {
    opacity: 0.88,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  googleLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 28,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
  },
  register: {
    fontFamily: 'Outfit_700Bold',
    color: colors.purpleBright,
  },
});
