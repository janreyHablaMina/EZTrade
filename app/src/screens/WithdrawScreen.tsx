import { useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const NETWORKS = ['TRC20 (USDT)', 'ERC20 (USDT)', 'BEP20 (USDT)'] as const;
const AVAILABLE = 12.5;
const MIN_AMOUNT = 10;
const FEE = 1;

type WithdrawScreenProps = {
  onBack?: () => void;
};

function ChevronDown() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WithdrawScreen({ onBack }: WithdrawScreenProps) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<(typeof NETWORKS)[number]>(
    'TRC20 (USDT)',
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const parsed = Number(amount);
  const validAmount =
    Number.isFinite(parsed) && parsed >= MIN_AMOUNT && parsed <= AVAILABLE;
  const canSubmit = validAmount && address.trim().length >= 20;

  const handleWithdraw = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Withdraw" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {submitted ? (
          <View style={styles.card}>
            <Text style={styles.successTitle}>Withdraw requested</Text>
            <Text style={styles.intro}>
              {parsed.toFixed(2)} USDT will be sent to your {network} wallet
              after review.
            </Text>
            <View style={styles.noteRow}>
              <View style={styles.noteDot} />
              <Text style={styles.noteText}>
                This usually takes a few minutes. You can track it in
                Transactions.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available balance</Text>
              <Text style={styles.balanceValue}>{AVAILABLE.toFixed(2)} USDT</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.fieldHead}>
                <Text style={styles.fieldLabel}>Amount</Text>
                <Pressable onPress={() => setAmount(String(AVAILABLE))}>
                  <Text style={styles.maxText}>Max</Text>
                </Pressable>
              </View>
              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.32)"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />
                <Text style={styles.suffix}>USDT</Text>
              </View>

              <View style={styles.networkWrap}>
                <Text style={styles.fieldLabel}>Network</Text>
                <Pressable
                  style={styles.field}
                  onPress={() => setPickerOpen((open) => !open)}
                >
                  <Text style={styles.fieldValue}>{network}</Text>
                  <View style={pickerOpen ? styles.chevronOpen : undefined}>
                    <ChevronDown />
                  </View>
                </Pressable>
                {pickerOpen ? (
                  <View style={styles.picker}>
                    {NETWORKS.map((item) => (
                      <Pressable
                        key={item}
                        style={[
                          styles.pickerItem,
                          item === network && styles.pickerItemActive,
                        ]}
                        onPress={() => {
                          setNetwork(item);
                          setPickerOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            item === network && styles.pickerTextActive,
                          ]}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>

              <Text style={styles.fieldLabel}>Wallet address</Text>
              <View style={styles.field}>
                <TextInput
                  style={styles.input}
                  placeholder="Paste your USDT address"
                  placeholderTextColor="rgba(255,255,255,0.32)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.noteRow}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>
                  Minimum {MIN_AMOUNT} USDT. Network fee is {FEE} USDT.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {submitted ? (
          <PrimaryButton label="Back to Home" onPress={onBack} />
        ) : (
          <PrimaryButton
            label="Withdraw"
            onPress={handleWithdraw}
            disabled={!canSubmit}
            style={!canSubmit ? styles.disabledBtn : undefined}
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
  card: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
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
  fieldHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 8,
  },
  maxText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.purpleBright,
    marginBottom: 8,
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
  suffix: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 8,
  },
  fieldValue: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  networkWrap: {
    position: 'relative',
    zIndex: 30,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  picker: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 74,
    zIndex: 40,
    elevation: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#161325',
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  pickerItemActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  pickerText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  pickerTextActive: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  noteDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purpleBright,
    marginTop: 6,
  },
  noteText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.62)',
    lineHeight: 20,
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
