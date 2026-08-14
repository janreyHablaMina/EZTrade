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
import Svg, { Path } from 'react-native-svg';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';
import { colors } from '../theme/colors';

type SubmitTxidScreenProps = {
  amount?: string;
  planName?: string;
  networkLabel?: string;
  onBack?: () => void;
  onSubmit?: (txid: string) => void;
};

function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6l-6 6 6 6"
        stroke={colors.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={colors.white}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SubmitTxidScreen({
  amount = '10.00',
  planName = 'VIP 1',
  networkLabel = 'TRC20 (USDT)',
  onBack,
  onSubmit,
}: SubmitTxidScreenProps) {
  const [txid, setTxid] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const trimmed = txid.trim();
  const canSubmit = trimmed.length >= 8;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onSubmit?.(trimmed);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <BackIcon />
        </Pressable>
        <Text style={styles.title}>Confirm Payment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Payment details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Plan</Text>
            <Text style={styles.summaryValue}>{planName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Amount</Text>
            <Text style={styles.summaryValue}>{amount} USDT</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryKey}>Network</Text>
            <Text style={styles.summaryValue}>{networkLabel}</Text>
          </View>
        </View>

        {submitted ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <CheckIcon />
            </View>
            <Text style={styles.successTitle}>TXID submitted</Text>
            <Text style={styles.successText}>
              We will verify your transfer and activate {planName} shortly.
            </Text>
            <Text style={styles.txidPreview} numberOfLines={2}>
              {trimmed}
            </Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formIntro}>
              Paste the Transaction ID (TXID) from your wallet after sending
              USDT.
            </Text>
            <TextField
              label="Transaction ID (TXID)"
              placeholder="Paste your TXID here"
              autoCapitalize="none"
              autoCorrect={false}
              value={txid}
              onChangeText={setTxid}
            />
            <View style={styles.hintRow}>
              <View style={styles.hintDot} />
              <Text style={styles.hintText}>
                Verification usually takes a few minutes after submit.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {submitted ? (
          <PrimaryButton label="Back to Home" onPress={onBack} />
        ) : (
          <PrimaryButton
            label="Submit TXID"
            onPress={handleSubmit}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  summaryLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryKey: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  summaryValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  formCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  formIntro: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.58)',
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purpleBright,
    marginTop: 6,
  },
  hintText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 19,
  },
  successCard: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(134, 239, 172, 0.35)',
    marginBottom: 6,
  },
  successTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
  },
  successText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
    lineHeight: 20,
  },
  txidPreview: {
    marginTop: 8,
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: 'rgba(196, 181, 253, 0.85)',
    textAlign: 'center',
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
