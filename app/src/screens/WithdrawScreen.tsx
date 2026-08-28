import { useEffect, useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../lib/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Receipt, Eye, EyeOff, CheckCircle } from '../components/Icons';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import {
  MIN_USDT,
  WITHDRAW_FEE_RATE,
  WITHDRAW_PROCESS_FROM_HOUR,
  type NetworkId,
  getNetwork,
  NETWORKS,
  hourClockLabel,
  parseAmount,
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
  const [settings, setSettings] = useState<{ is_enabled: boolean; start_time: string; end_time: string } | null>(null);
  const [open, setOpen] = useState(true);
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [setupPassword1, setSetupPassword1] = useState('');
  const [setupPassword2, setSetupPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
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

  const getFieldStyle = (fieldName: string, isError: boolean = false) => {
    return [
      styles.field,
      focusedField === fieldName && styles.fieldFocused,
      isError && styles.fieldError
    ];
  };

  if (passwordSetSuccess) {
    return (
      <View style={[styles.root, { padding: 24, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.successGlow} />
        <View style={styles.successIconContainer}>
          <CheckCircle size={48} color="#4ade80" />
        </View>
        <Text style={[styles.successTitle, { textAlign: 'center', fontSize: 32, color: '#4ade80', marginTop: 24 }]}>Secured!</Text>
        <Text style={[styles.intro, { textAlign: 'center', paddingHorizontal: 20, marginTop: 12, fontSize: 16, color: 'rgba(255,255,255,0.7)' }]}>
          Your withdrawal password has been set successfully. Keep it safe, as it cannot be recovered!
        </Text>
        <View style={{ width: '100%', marginTop: 48 }}>
          <PrimaryButton 
            label="Continue to Withdraw"
            onPress={() => {
              if (user) {
                user.has_withdrawal_password = true;
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
            <Receipt size={24} color="rgba(255,255,255,0.9)" />
            {submitted ? <View style={styles.receiptDot} /> : null}
          </Pressable>
        }
      />

      {submitted ? (
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={[styles.card, { padding: 32, alignItems: 'center', marginTop: 40 }]}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34, 197, 94, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <CheckCircle size={40} color="#4ade80" />
            </View>
            <Text style={[styles.successTitle, { textAlign: 'center' }]}>Withdraw Requested</Text>
            <Text style={[styles.intro, { textAlign: 'center', fontSize: 16 }]}>
              You will receive <Text style={{ color: colors.white, fontFamily: 'Outfit_700Bold' }}>{receive.toFixed(2)} USDT</Text> on {displayNetwork}{' '}
              after the {withdrawFeePercent}% fee.
            </Text>
            <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 20 }} />
            <Text style={{ fontFamily: 'Outfit_400Regular', color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 22 }}>
              Status is pending until processed. Processing hours are from {hourClockLabel(WITHDRAW_PROCESS_FROM_HOUR)} to 12:00 AM.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Network Selection Tabs (Exchange Style) */}
          <Text style={styles.sectionTitle}>Select Network</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.networkTabs}>
            {NETWORKS.map((net) => {
              const isSelected = networkId === net.id;
              return (
                <Pressable
                  key={net.id}
                  disabled={!open}
                  onPress={() => setNetworkId(net.id as NetworkId)}
                  style={[
                    styles.networkTab,
                    isSelected && styles.networkTabSelected,
                    !open && { opacity: 0.5 }
                  ]}
                >
                  <Text style={[
                    styles.networkTabText,
                    isSelected && styles.networkTabTextSelected
                  ]}>
                    {net.label.split(' ')[0]} {/* e.g. TRC20 */}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Massive Amount Input Area */}
          <View style={styles.amountArea}>
            <Text style={styles.sectionTitle}>Withdraw Amount</Text>
            <View style={[styles.massiveInputContainer, focusedField === 'amount' && styles.massiveInputFocused]}>
              <TextInput
                style={styles.massiveInput}
                placeholder="0.00"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="numeric"
                editable={open}
                value={amount}
                onChangeText={setAmount}
                onFocus={() => setFocusedField('amount')}
                onBlur={() => setFocusedField(null)}
              />
              <View style={styles.amountAddons}>
                <Text style={styles.currencySuffix}>USDT</Text>
                {open && (
                  <Pressable onPress={() => setAmount(String(AVAILABLE))} style={styles.maxBtn}>
                    <Text style={styles.maxBtnText}>MAX</Text>
                  </Pressable>
                )}
              </View>
            </View>
            
            <View style={styles.balanceInfoRow}>
              <Text style={styles.availableText}>Available: <Text style={{color: colors.white, fontFamily: 'Outfit_600SemiBold'}}>{AVAILABLE.toFixed(2)} USDT</Text></Text>
              {amountError && (
                <Text style={styles.errorText}>
                  {entered > AVAILABLE ? 'Insufficient balance' : `Min. ${minWithdrawal} USDT`}
                </Text>
              )}
            </View>

            {/* Receipt / Fee Breakdown directly below amount */}
            {hasAmount ? (
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Handling Fee ({withdrawFeePercent}%)</Text>
                  <Text style={styles.summaryFee}>-{handlingFee.toFixed(2)} USDT</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Receive Amount</Text>
                  <Text style={styles.summaryTotal}>{receive.toFixed(2)} USDT</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Address and Password Forms */}
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Transfer Details</Text>
          <View style={[styles.card, !open && styles.cardDisabled]}>
            <Text style={styles.fieldLabel}>Wallet Address</Text>
            <View style={getFieldStyle('address')}>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${getNetwork(networkId).label.split(' ')[0]} address`}
                placeholderTextColor="rgba(255,255,255,0.25)"
                autoCapitalize="none"
                autoCorrect={false}
                editable={open}
                value={address}
                onChangeText={setAddress}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Security Password</Text>
            <View style={getFieldStyle('password')}>
              <TextInput
                style={styles.input}
                placeholder="Enter withdrawal password"
                placeholderTextColor="rgba(255,255,255,0.25)"
                secureTextEntry={!showPwdWithdraw}
                editable={open}
                value={withdrawalPassword}
                onChangeText={setWithdrawalPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <Pressable
                onPress={() => setShowPwdWithdraw(!showPwdWithdraw)}
                style={styles.eyeBtn}
              >
                {showPwdWithdraw ? <EyeOff size={22} color="rgba(255,255,255,0.6)" /> : <Eye size={22} color="rgba(255,255,255,0.4)" />}
              </Pressable>
            </View>
          </View>
          
          {/* Status Indicator at the very bottom */}
          {!open && (
            <View style={styles.closedStatusBadge}>
              <View style={[styles.scheduleDot, styles.dotClosed]} />
              <Text style={styles.closedHint}>
                Withdrawals open {settings?.start_time} - {settings?.end_time}
              </Text>
            </View>
          )}

        </ScrollView>
      )}

      <View style={styles.footer}>
        {submitted ? (
          <>
            <PrimaryButton label="View Status" onPress={onViewStatus} />
            <Pressable onPress={onBack} style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Back to Home</Text>
            </Pressable>
          </>
        ) : (
          <PrimaryButton
            label={open ? (isSubmitting ? 'Processing...' : 'Confirm Withdrawal') : `Opens at ${settings?.start_time || ''}`}
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
    backgroundColor: colors.bgDeep, // Using the deep dark background for exchange style
  },
  receiptBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
  },
  receiptDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fbbf24',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  
  /* --- Network Selection Tabs --- */
  networkTabs: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20, // allow scrolling past
    marginBottom: 28,
  },
  networkTab: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  networkTabSelected: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: colors.purpleBright,
  },
  networkTabText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  networkTabTextSelected: {
    color: colors.purpleBright,
  },

  /* --- Massive Amount Area --- */
  amountArea: {
    marginBottom: 24,
  },
  massiveInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  massiveInputFocused: {
    borderBottomColor: colors.purpleBright,
  },
  massiveInput: {
    flex: 1,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 48,
    color: colors.white,
    paddingVertical: 0,
    includeFontPadding: false,
    lineHeight: 56, // ensure cursor doesn't jump
  },
  amountAddons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySuffix: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  maxBtn: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  maxBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.purpleBright,
  },
  balanceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  errorText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: '#ef4444',
  },

  /* --- Form Card --- */
  cardDisabled: {
    opacity: 0.5,
  },
  card: {
    backgroundColor: 'rgba(18, 16, 31, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 20,
    zIndex: 2,
  },
  alertCard: {
    borderColor: 'rgba(239, 68, 68, 0.4)', 
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    marginBottom: 20,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 24,
    color: colors.white,
    marginBottom: 8,
  },
  
  /* --- Sleek Inputs --- */
  fieldLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  field: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldFocused: {
    borderColor: colors.purpleBright,
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
  },
  fieldError: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    color: colors.white,
    paddingVertical: 14,
  },
  eyeBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- Receipt Summary --- */
  summaryContainer: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  summaryLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  summaryValue: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: colors.white,
  },
  summaryFee: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: '#fb7185', // Rose pink for fees
  },
  summaryTotalLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: colors.white,
  },
  summaryTotal: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    color: '#4ade80',
  },

  /* --- Status Indicators --- */
  closedStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    padding: 12,
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderRadius: 12,
  },
  scheduleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotClosed: {
    backgroundColor: '#facc15',
  },
  closedHint: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: '#fde68a',
  },

  /* --- Success State Styling --- */
  successGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    borderRadius: 100,
    top: '30%',
    opacity: 0.5,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    gap: 12,
    backgroundColor: colors.bgDeep, // prevent scrolling beneath it looking weird
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  secondaryBtn: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
});
