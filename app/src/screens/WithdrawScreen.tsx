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
} from 'react-native';
import { AmountField } from '../components/AmountField';
import { Receipt } from '../components/Icons';
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
  onBack?: () => void;
  onViewStatus?: () => void;
  request?: WithdrawRequest | null;
  onRequested?: (request: WithdrawRequest) => void;
};

export function WithdrawScreen({
  onBack,
  onViewStatus,
  request = null,
  onRequested,
}: WithdrawScreenProps) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [networkId, setNetworkId] = useState<NetworkId>('trc20');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [settings, setSettings] = useState<{ is_enabled: boolean; start_time: string; end_time: string } | null>(null);
  const [open, setOpen] = useState(true);
  const submitted = Boolean(request);

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

  const entered = parseAmount(amount);
  const parsed = request?.amount ?? entered;
  const hasAmount = Number.isFinite(parsed) && parsed > 0;
  const { fee: handlingFee, receive } = hasAmount
    ? withdrawPayout(parsed)
    : { fee: 0, receive: 0 };
  const displayNetwork = request?.network ?? getNetwork(networkId).label;
  const validAmount =
    Number.isFinite(entered) && entered >= MIN_USDT && entered <= AVAILABLE;
  const amountError = amount.trim().length > 0 && !validAmount;
  const canSubmit = open && validAmount && address.trim().length > 0;

  const handleWithdraw = () => {
    if (!canSubmit) return;
    onRequested?.({ amount: entered, network: getNetwork(networkId).label });
  };

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
              after the {WITHDRAW_FEE_RATE * 100}% handling fee. We process
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
                      : `Minimum withdraw is ${MIN_USDT} USDT.`
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
                      Handling fee ({WITHDRAW_FEE_RATE * 100}%)
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
                Minimum {MIN_USDT} USDT. A {WITHDRAW_FEE_RATE * 100}% handling
                fee is deducted from the amount you withdraw.
              </NoteRow>
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
            label={open ? 'Withdraw' : `Opens at ${settings?.start_time || ''}`}
            onPress={handleWithdraw}
            disabled={!canSubmit}
          />
        )}
      </View>
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
