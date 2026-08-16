import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AuthScreen } from '../components/auth/AuthScreen';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { apiClient } from '../lib/api';

type VerifyOtpScreenProps = {
  email: string;
  onVerified: (user: any) => void;
  onBack: () => void;
};

export function VerifyOtpScreen({
  email,
  onVerified,
  onBack,
}: VerifyOtpScreenProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canVerify = otp.trim().length === 6;

  const handleVerify = async () => {
    if (!canVerify) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await apiClient.post('/verify-otp', {
        email,
        otp: otp.trim(),
      });
      onVerified(response.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreen
      title="Verify Email"
      subtitle={`We sent a 6-digit code to ${email}`}
      footerPrompt="Wrong email?"
      footerAction="Go back"
      onFooterPress={onBack}
    >
      <TextField
        label="Verification Code"
        placeholder="123456"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}
      <PrimaryButton
        label={isLoading ? "Verifying..." : "Verify"}
        onPress={handleVerify}
        disabled={!canVerify || isLoading}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#f87171',
    marginTop: -4,
    marginBottom: 8,
  },
});
