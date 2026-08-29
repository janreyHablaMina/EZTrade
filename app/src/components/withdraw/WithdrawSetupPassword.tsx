import { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { ScreenHeader } from '../ScreenHeader';
import { PrimaryButton } from '../PrimaryButton';
import { ConfirmModal } from '../ConfirmModal';
import { Eye, EyeOff } from '../Icons';
import { colors } from '../../theme/colors';
import { apiClient } from '../../lib/api';
import * as SecureStore from 'expo-secure-store';

type WithdrawSetupPasswordProps = {
  onBack: () => void;
  user: any;
  onSuccess: () => void;
};

export function WithdrawSetupPassword({ onBack, user, onSuccess }: WithdrawSetupPasswordProps) {
  const [setupPassword1, setSetupPassword1] = useState('');
  const [setupPassword2, setSetupPassword2] = useState('');
  const [showPwdSetup1, setShowPwdSetup1] = useState(false);
  const [showPwdSetup2, setShowPwdSetup2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [modalState, setModalState] = useState<{ visible: boolean; title: string; message: string; isSuccess?: boolean }>({ visible: false, title: '', message: '' });

  const handleSetupPassword = () => {
    if (!setupPassword1 || setupPassword1.length < 6) {
      setModalState({ visible: true, title: 'Error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (setupPassword1 !== setupPassword2) {
      setModalState({ visible: true, title: 'Error', message: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    apiClient.post(`/users/${user?.id}/withdrawal-password`, {
      password: setupPassword1
    }).then(() => {
      setModalState({ visible: true, title: 'Secured!', message: 'Your withdrawal password has been set successfully. Please keep it safe, as it cannot be recovered.', isSuccess: true });
    }).catch(err => {
      setModalState({ visible: true, title: 'Error', message: err.message || 'Failed to set password.' });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const closeAndHandleModal = () => {
    if (modalState.isSuccess) {
      if (user) {
        user.has_withdrawal_password = true;
        SecureStore.setItemAsync('saved_user', JSON.stringify(user)).catch(console.warn);
      }
      onSuccess();
    }
    setModalState({ ...modalState, visible: false, isSuccess: false });
  };

  const getFieldStyle = (fieldName: string) => [
    styles.field,
    focusedField === fieldName && styles.fieldFocused,
  ];

  return (
    <>
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        <ScreenHeader title="Setup Password" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, styles.alertCard]}>
            <Text style={[styles.successTitle, { color: '#ef4444', fontSize: 20 }]}>Important Notice</Text>
            <Text style={[styles.intro, { color: '#fca5a5', fontSize: 15 }]}>
              You must set a withdrawal password before you can withdraw funds. {'\n\n'}
              <Text style={{ fontFamily: 'Outfit_800ExtraBold', color: '#ff8a8a' }}>WARNING:</Text> This password CANNOT be changed or recovered if you forget it. Please write it down and store it securely.
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Withdrawal Password</Text>
          <View style={getFieldStyle('setup1')}>
            <TextInput
              style={styles.input}
              placeholder="Enter 6+ characters"
              placeholderTextColor="rgba(255,255,255,0.32)"
              secureTextEntry={!showPwdSetup1}
              value={setupPassword1}
              onChangeText={setSetupPassword1}
              onFocus={() => setFocusedField('setup1')}
              onBlur={() => setFocusedField(null)}
            />
            <Pressable
              onPress={() => setShowPwdSetup1(!showPwdSetup1)}
              style={styles.eyeBtn}
            >
              {showPwdSetup1 ? <EyeOff size={22} color="rgba(255,255,255,0.6)" /> : <Eye size={22} color="rgba(255,255,255,0.4)" />}
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <View style={getFieldStyle('setup2')}>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="rgba(255,255,255,0.32)"
              secureTextEntry={!showPwdSetup2}
              value={setupPassword2}
              onChangeText={setSetupPassword2}
              onFocus={() => setFocusedField('setup2')}
              onBlur={() => setFocusedField(null)}
            />
            <Pressable
              onPress={() => setShowPwdSetup2(!showPwdSetup2)}
              style={styles.eyeBtn}
            >
              {showPwdSetup2 ? <EyeOff size={22} color="rgba(255,255,255,0.6)" /> : <Eye size={22} color="rgba(255,255,255,0.4)" />}
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            label={isSubmitting ? 'Setting up...' : 'Set Password'}
            onPress={handleSetupPassword}
            disabled={isSubmitting || !setupPassword1 || !setupPassword2}
          />
        </View>
      </KeyboardAvoidingView>
      <ConfirmModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        hideCancel
        confirmLabel="OK"
        onConfirm={closeAndHandleModal}
        onCancel={closeAndHandleModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  alertCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  successTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    marginBottom: 8,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    lineHeight: 22,
  },
  fieldLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: colors.white,
    marginBottom: 8,
    marginLeft: 4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  fieldFocused: {
    borderColor: colors.purple,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    color: colors.white,
  },
  eyeBtn: {
    padding: 8,
    marginRight: -8,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
});
