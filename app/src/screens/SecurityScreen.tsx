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
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';

type SecurityScreenProps = {
  onBack?: () => void;
};

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[styles.toggle, value && styles.toggleOn]}
    >
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

export function SecurityScreen({ onBack }: SecurityScreenProps) {
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const passwordsMatch =
    newPassword.length >= 8 && newPassword === confirmPassword;
  const canSave = currentPassword.length >= 6 && passwordsMatch;

  const handleSave = () => {
    if (!canSave) return;
    setSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Security" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login protection</Text>
          <Text style={styles.cardHint}>
            Extra steps to keep this account safe.
          </Text>

          <View style={styles.row}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Two-factor authentication</Text>
              <Text style={styles.rowSub}>
                Confirm logins with a code from your email.
              </Text>
            </View>
            <Toggle value={twoFactor} onChange={setTwoFactor} />
          </View>

          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Biometric login</Text>
              <Text style={styles.rowSub}>
                Use fingerprint or Face ID on this device.
              </Text>
            </View>
            <Toggle value={biometric} onChange={setBiometric} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Change password</Text>
          {saved ? (
            <Text style={styles.successText}>
              Password updated. Use the new password next time you sign in.
            </Text>
          ) : (
            <Text style={styles.cardHint}>
              Use at least 8 characters. Don’t reuse an old password.
            </Text>
          )}

          <View style={styles.form}>
            <TextField
              label="Current password"
              placeholder="••••••••••"
              isPassword
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextField
              label="New password"
              placeholder="••••••••••"
              isPassword
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextField
              label="Confirm new password"
              placeholder="••••••••••"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {confirmPassword.length > 0 && !passwordsMatch ? (
              <Text style={styles.errorText}>
                New passwords must match and be at least 8 characters.
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Update password"
          onPress={handleSave}
          disabled={!canSave}
          style={!canSave ? styles.disabledBtn : undefined}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  card: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
  },
  cardTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    color: colors.white,
    marginBottom: 6,
  },
  cardHint: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 19,
    marginBottom: 14,
  },
  successText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: colors.green,
    lineHeight: 19,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  rowSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 17,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.purple,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  form: {
    gap: 12,
  },
  errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#f87171',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  disabledBtn: {
    opacity: 0.45,
  },
});
