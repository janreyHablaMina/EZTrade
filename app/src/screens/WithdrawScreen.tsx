import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../lib/api';
import { AmountField } from '../components/AmountField';
import { ConfirmModal } from '../components/ConfirmModal';
import { Receipt, Eye, EyeOff, CheckCircle } from '../components/Icons';
import { NetworkPicker } from '../components/NetworkPicker';
import { NoteRow } from '../components/NoteRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import {
  ENFORCE_WITHDRAW_WINDOW,
  MIN_USDT,
  WITHDRAW_FEE_RATE,
  WITHDRAW_PROCESS_FROM_HOUR,
  WITHDRAW_REQUEST_UNTIL_HOUR,
  type NetworkId,
  getNetwork,
  hourClockLabel,
  isWithdrawOpen,
  parseAmount,
  withdrawPayout,
} from '../lib/wallet';
import { colors } from '../theme/colors';

const AVAILABLE = 12.5;

type WithdrawRequest = {
  amount: number;
  network: string;
};

type WithdrawScreenProps = {
  onBack: () => void;
  onViewStatus?: () => void;
  request?: { amount: number; network: string } | null;
  onRequested?: (req: { amount: number; network: string } | null) => void;
  systemSettings?: any;
  user?: any;
};

export function WithdrawScreen({
  onBack,
  onViewStatus,
  request,
  onRequested,
  systemSettings,
  user,
}: WithdrawScreenProps) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [networkId, setNetworkId] = useState<NetworkId>('trc20');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settings, setSettings] = useState<{ is_enabled: boolean; start_time: string; end_time: string } | null>(null);
  const [open, setOpen] = useState(true);
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [setupPassword1, setSetupPassword1] = useState('');
  const [setupPassword2, setSetupPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showPwdSetup1, setShowPwdSetup1] = useState(false);
  const [showPwdSetup2, setShowPwdSetup2] = useState(false);
  const [showPwdWithdraw, setShowPwdWithdraw] = useState(false);
  
  const [passwordSetSuccess, setPasswordSetSuccess] = useState(false);
  const [hasPasswordLocal, setHasPasswordLocal] = useState(false);
  const [modalState, setModalState] = useState<{ visible: boolean; title: string; message: string }>({ visible: false, title: '', message: '' });
  
  const [submittedLocal, setSubmittedLocal] = useState(Boolean(request));
  const submitted = submittedLocal || Boolean(request);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { apiClient } = await import('../lib/api');
        const data = await apiClient.get('/settings/withdrawal');
        setSettings(data);
        
        if (data.is_enabled) {
          const now = data.current_server_time || new Date().toTimeString().substring(0, 5);
          const start = data.start_time;
          const end = data.end_time;
          
          if (start <= end) {
            setOpen(now >= start && now <= end);
          } else {
            setOpen(now >= start || now <= end);
          }
        } else {
          setOpen(true);
        }
      } catch (err) {
        console.warn("Failed to fetch withdrawal settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const minWithdrawal = systemSettings?.platform_controls?.min_withdrawal ?? MIN_USDT;
  const withdrawFeePercent = systemSettings?.platform_controls?.withdrawal_fee_percent ?? (WITHDRAW_FEE_RATE * 100);
  const withdrawFeeRate = withdrawFeePercent / 100;

  const entered = parseAmount(amount);
  const parsed = request?.amount ?? entered;
  const hasAmount = Number.isFinite(parsed) && parsed > 0;
  const handlingFee = hasAmount ? parsed * withdrawFeeRate : 0;
  const receive = hasAmount ? parsed - handlingFee : 0;

  const displayNetwork = request?.network ?? getNetwork(networkId).label;
  const validAmount =
    Number.isFinite(entered) && entered >= minWithdrawal && entered <= AVAILABLE;
  const amountError = amount.trim().length > 0 && !validAmount;
  const canSubmit = open && validAmount && address.trim().length > 0;

  const handleRequestWithdraw = () => {
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, '') || '0');
    if (!numAmount || numAmount <= 0) {
      setModalState({ visible: true, title: 'Invalid Amount', message: 'Please enter a valid amount.' });
      return;
    }
    if (numAmount < minWithdrawal) {
      setModalState({ visible: true, title: 'Minimum Limit', message: `The minimum withdrawal amount is $${minWithdrawal}.` });
      return;
    }

    if (!address) return;
    if (!withdrawalPassword) {
      setModalState({ visible: true, title: 'Password Required', message: 'Please enter your withdrawal password.' });
      return;
    }

    setIsSubmitting(true);
    apiClient.post('/withdrawals', {
      amount: numAmount,
      network: getNetwork(networkId).label,
      wallet_address: address,
      withdrawal_password: withdrawalPassword,
      user_id: user?.id
    }).then(() => {
      setSubmittedLocal(true);
      onRequested?.({ amount: numAmount, network: getNetwork(networkId).label });
    }).catch(err => {
      setModalState({ visible: true, title: 'Error', message: err.message || 'Failed to submit withdrawal' });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

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
    }).then((res) => {
      setPasswordSetSuccess(true);
    }).catch(err => {
      setModalState({ visible: true, title: 'Error', message: err.message || 'Failed to set password.' });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  if (passwordSetSuccess) {
    return (
      <View style={[styles.root, { padding: 24, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34, 197, 94, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 28, borderWidth: 1, borderColor: 'rgba(74, 222, 128, 0.3)' }}>
          <CheckCircle size={40} color="#4ade80" />
        </View>
        <Text style={[styles.successTitle, { textAlign: 'center', fontSize: 28, color: '#4ade80' }]}>Secured!</Text>
        <Text style={[styles.intro, { textAlign: 'center', paddingHorizontal: 10, marginTop: 8, fontSize: 15 }]}>
          Your withdrawal password has been set successfully. Keep it safe, as it cannot be recovered!
        </Text>
        <View style={{ width: '100%', marginTop: 40 }}>
          <PrimaryButton 
            label="Continue to Withdraw"
            onPress={() => {
              if (user) {
                user.has_withdrawal_password = true; // Mutate for parent cache
                SecureStore.setItemAsync('saved_user', JSON.stringify(user)).catch(console.warn);
              }
              setHasPasswordLocal(true);
              setPasswordSetSuccess(false);
            }}
          />
        </View>
      </View>
    );
  }

  const hasPassword = user?.has_withdrawal_password || hasPasswordLocal;

  if (user && !hasPassword) {
    return (
      <>
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenHeader title="Setup Password" onBack={onBack} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }]}>
            <Text style={[styles.successTitle, { color: '#ef4444', fontSize: 18 }]}>Important Notice</Text>
            <Text style={[styles.intro, { color: '#fca5a5' }]}>
              You must set a withdrawal password before you can withdraw funds. {'\n\n'}
              <Text style={{ fontFamily: 'Outfit_800ExtraBold' }}>WARNING:</Text> This password CANNOT be changed or recovered if you forget it. Please write it down and store it securely.
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Withdrawal Password</Text>
          <View style={styles.field}>
            <TextInput
              style={styles.input}
              placeholder="Enter 6+ characters"
              placeholderTextColor="rgba(255,255,255,0.32)"
              secureTextEntry={!showPwdSetup1}
              value={setupPassword1}
              onChangeText={setSetupPassword1}
            />
            <Pressable
              onPress={() => setShowPwdSetup1(!showPwdSetup1)}
              style={styles.eyeBtn}
            >
              {showPwdSetup1 ? <EyeOff size={20} color="rgba(255,255,255,0.4)" /> : <Eye size={20} color="rgba(255,255,255,0.4)" />}
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <View style={styles.field}>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="rgba(255,255,255,0.32)"
              secureTextEntry={!showPwdSetup2}
              value={setupPassword2}
              onChangeText={setSetupPassword2}
            />
            <Pressable
              onPress={() => setShowPwdSetup2(!showPwdSetup2)}
              style={styles.eyeBtn}
            >
                {showPwdSetup2 ? <EyeOff size={20} color="rgba(255,255,255,0.4)" /> : <Eye size={20} color="rgba(255,255,255,0.4)" />}
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
          onConfirm={() => setModalState({ ...modalState, visible: false })}
          onCancel={() => setModalState({ ...modalState, visible: false })}
        />
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title="Withdraw"
        onBack={onBack}
        right={
          <Pressable
            onPress={onViewStatus}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="View withdraw status"
            style={styles.receiptBtn}
          >
            <Receipt size={22} color="rgba(255,255,255,0.8)" />
            {submitted ? <View style={styles.receiptDot} /> : null}
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {submitted ? (
          <View style={styles.card}>
            <Text style={styles.successTitle}>Withdraw requested</Text>
            <Text style={styles.intro}>
              You will receive {receive.toFixed(2)} USDT on {displayNetwork}{' '}
              after the {withdrawFeePercent}% handling fee. We process
              withdrawals from {hourClockLabel(WITHDRAW_PROCESS_FROM_HOUR)} to
              12:00 AM.
            </Text>
            <NoteRow>
              Status is Pending until we process it. Use View status to check
              it, then come back here.
            </NoteRow>
          </View>
        ) : (
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balanceValue}>{AVAILABLE.toFixed(2)} USDT</Text>
            </View>

            <View style={[styles.scheduleCard, open ? styles.scheduleOpen : styles.scheduleClosed]}>
              <View style={[styles.scheduleDot, open ? styles.dotOpen : styles.dotClosed]} />
              <View style={styles.scheduleCopy}>
                <Text style={styles.scheduleTitle}>
                  {settings?.is_enabled
                    ? open
                      ? 'Withdrawals are open'
                      : 'Withdrawals are closed'
                    : 'Withdrawals are open'}
                </Text>
                <Text style={styles.scheduleText}>
                  {settings?.is_enabled 
                    ? `Withdrawal requests are allowed between ${settings.start_time} and ${settings.end_time} server time.`
                    : 'Withdrawals are open 24/7.'}
                </Text>
              </View>
            </View>

            <View style={[styles.card, !open && styles.cardDisabled]}>
              <AmountField
                value={amount}
                onChangeText={setAmount}
                editable={open}
                onMax={() => setAmount(String(AVAILABLE))}
                error={
                  amountError
                    ? entered > AVAILABLE
                      ? 'Not enough available balance.'
                      : `Minimum withdraw is ${minWithdrawal} USDT.`
                    : null
                }
              />

              {hasAmount && !submitted ? (
                <View style={styles.summary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Amount</Text>
                    <Text style={styles.summaryValue}>
                      {parsed.toFixed(2)} USDT
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      Handling fee ({withdrawFeePercent}%)
                    </Text>
                    <Text style={styles.summaryFee}>
                      -{handlingFee.toFixed(2)} USDT
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                    <Text style={styles.summaryTotalLabel}>You receive</Text>
                    <Text style={styles.summaryTotal}>
                      {receive.toFixed(2)} USDT
                    </Text>
                  </View>
                </View>
              ) : null}

              <NetworkPicker
                value={networkId}
                open={pickerOpen}
                disabled={!open}
                onOpenChange={setPickerOpen}
                onChange={setNetworkId}
              />

              <Text style={styles.fieldLabel}>Wallet address</Text>
              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Paste your USDT address"
                  placeholderTextColor="rgba(255,255,255,0.32)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={open}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <NoteRow>
                Minimum {minWithdrawal} USDT. A {withdrawFeePercent}% handling
                fee is deducted from the amount you withdraw.
              </NoteRow>

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Withdrawal Password</Text>
              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your withdrawal password"
                  placeholderTextColor="rgba(255,255,255,0.32)"
                  secureTextEntry={!showPwdWithdraw}
                  editable={open}
                  value={withdrawalPassword}
                  onChangeText={setWithdrawalPassword}
                />
                <Pressable
                  onPress={() => setShowPwdWithdraw(!showPwdWithdraw)}
                  style={styles.eyeBtn}
                >
                  {showPwdWithdraw ? <EyeOff size={20} color="rgba(255,255,255,0.4)" /> : <Eye size={20} color="rgba(255,255,255,0.4)" />}
                </Pressable>
              </View>
              {!open ? (
                <Text style={styles.closedHint}>
                  Come back between {settings?.start_time} and {settings?.end_time} server time to submit a request.
                </Text>
              ) : null}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {submitted ? (
          <>
            <PrimaryButton label="View status" onPress={onViewStatus} />
            <Pressable onPress={onBack} style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Back to Home</Text>
            </Pressable>
          </>
        ) : (
          <PrimaryButton
            label={open ? (isSubmitting ? 'Submitting...' : 'Withdraw') : `Opens at ${settings?.start_time || ''}`}
            onPress={handleRequestWithdraw}
            disabled={!canSubmit || isSubmitting}
          />
        )}
      </View>

      <ConfirmModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        hideCancel
        confirmLabel="OK"
        onConfirm={() => setModalState({ ...modalState, visible: false })}
        onCancel={() => setModalState({ ...modalState, visible: false })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  receiptBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fbbf24',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  balanceCard: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
  },
  balanceLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  balanceValue: {
    marginTop: 6,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 28,
    color: colors.white,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  scheduleOpen: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(134, 239, 172, 0.28)',
  },
  scheduleClosed: {
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderColor: 'rgba(250, 204, 21, 0.28)',
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  dotOpen: {
    backgroundColor: colors.green,
  },
  dotClosed: {
    backgroundColor: '#facc15',
  },
  scheduleCopy: {
    flex: 1,
    gap: 4,
  },
  scheduleTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  scheduleText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.62)',
  },
  cardDisabled: {
    opacity: 0.55,
  },
  closedHint: {
    marginTop: 12,
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: '#fde68a',
    lineHeight: 19,
  },
  card: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
    overflow: 'visible',
    zIndex: 2,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.58)',
    lineHeight: 20,
    marginBottom: 14,
  },
  successTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 8,
  },
  summary: {
    marginTop: -4,
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  summaryValue: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: colors.white,
  },
  summaryFee: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: '#f87171',
  },
  summaryTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  summaryTotalLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.white,
  },
  summaryTotal: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 15,
    color: '#4ade80',
  },
  field: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: colors.white,
    paddingVertical: 12,
  },
  eyeBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
  },
  secondaryBtn: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.purpleBright,
  },
});
