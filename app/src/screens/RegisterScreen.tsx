import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AuthScreen } from '../components/auth/AuthScreen';
import { CheckBox } from '../components/auth/CheckBox';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';

type RegisterScreenProps = {
  onCreateAccount?: () => void;
  onGoogleSignUp?: () => void;
  onLogin?: () => void;
};

export function RegisterScreen({
  onCreateAccount,
  onGoogleSignUp,
  onLogin,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreed, setAgreed] = useState(false);

  const passwordsMatch =
    password.length >= 6 && password === confirmPassword;
  const canCreate =
    agreed &&
    name.trim().length >= 2 &&
    email.trim().length > 3 &&
    passwordsMatch;

  return (
    <AuthScreen
      title="Create Account"
      subtitle="Join EZTRADE and start growing your assets"
      onGoogle={onGoogleSignUp}
      googleDisabled={!agreed}
      footerPrompt="Already have an account?"
      footerAction="Login"
      onFooterPress={onLogin}
    >
      <TextField
        label="Full name"
        placeholder="John Doe"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />
      <TextField
        label="Email"
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
      <TextField
        label="Confirm password"
        placeholder="••••••••••"
        isPassword
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextField
        label="Referral code (optional)"
        placeholder="EZTRADE12"
        autoCapitalize="characters"
        autoCorrect={false}
        value={referralCode}
        onChangeText={(value) => setReferralCode(value.toUpperCase())}
      />
      <CheckBox checked={agreed} onToggle={() => setAgreed((value) => !value)}>
        <Text style={styles.agreeText}>
          I agree to the <Text style={styles.agreeLink}>Terms of Use</Text> and{' '}
          <Text style={styles.agreeLink}>Privacy Policy</Text>
        </Text>
      </CheckBox>
      {confirmPassword.length > 0 && !passwordsMatch ? (
        <Text style={styles.errorText}>
          Passwords must match and be at least 6 characters.
        </Text>
      ) : null}
      <PrimaryButton
        label="Create Account"
        onPress={() => {
          if (!canCreate) return;
          onCreateAccount?.();
        }}
        disabled={!canCreate}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  agreeText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.78)',
  },
  agreeLink: {
    fontFamily: 'Outfit_700Bold',
    color: colors.purpleBright,
  },
  errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#f87171',
    marginTop: -6,
  },
});
