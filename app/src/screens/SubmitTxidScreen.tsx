import { LinearGradient } from 'expo-linear-gradient';
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

type SubmitTxidScreenProps = {
  amount?: string;
  planName?: string;
  networkLabel?: string;
  onBack?: () => void;
  onSubmit?: (txid: string) => void;
};

function HashIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="3"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth={1.6}
      />
      <Path
        d="M8.5 9h7M8.5 13h7M8.5 17h4.5"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="rgba(34,197,94,0.2)" />
      <Path
        d="M7.5 12.5l3 3 6-6.5"
        stroke="#86efac"
        strokeWidth={2.2}
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
  const [focused, setFocused] = useState(false);
  const trimmed = txid.trim();
  const canSubmit = trimmed.length >= 8;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.(trimmed);
  };

  const pasteTxid = async () => {
    try {
      const clip = (
        globalThis as {
          navigator?: { clipboard?: { readText?: () => Promise<string> } };
        }
      ).navigator?.clipboard;
      const value = await clip?.readText?.();
      if (value) setTxid(value.trim());
    } catch {
      // Frontend-only paste
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Confirm Payment" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <LinearGradient
              colors={['#a855f7', '#6d28d9']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.iconCircle}
            >
              {submitted ? <CheckIcon /> : <HashIcon />}
            </LinearGradient>
          </View>

          <Text style={styles.headline}>
            {submitted ? 'Payment is under review' : 'Last step to activate'}
          </Text>
          <Text style={styles.intro}>
            {submitted
              ? `We’ll match this TXID and unlock ${planName} once it confirms.`
              : 'Paste the Transaction ID from your wallet to verify the USDT you just sent.'}
          </Text>

          <View style={styles.amountCard}>
            <View>
              <Text style={styles.amountLabel}>Amount sent</Text>
              <Text style={styles.amountValue}>{amount} USDT</Text>
            </View>
            <View style={styles.planPill}>
              <Text style={styles.planPillText}>{planName}</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Network</Text>
          <View style={styles.field}>
            <Text style={styles.fieldValue}>{networkLabel}</Text>
          </View>

          {submitted ? (
            <>
              <Text style={styles.fieldLabel}>Submitted TXID</Text>
              <View style={styles.field}>
                <Text style={styles.txidPreview} numberOfLines={3}>
                  {trimmed}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.fieldHead}>
                <Text style={styles.fieldLabel}>Transaction ID (TXID)</Text>
                <Pressable onPress={pasteTxid} hitSlop={8}>
                  <Text style={styles.pasteText}>Paste</Text>
                </Pressable>
              </View>
              <View style={[styles.txidField, focused && styles.txidFocused]}>
                <TextInput
                  style={styles.txidInput}
                  placeholder="Paste TXID from your wallet"
                  placeholderTextColor="rgba(255,255,255,0.32)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                  value={txid}
                  onChangeText={setTxid}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </View>
            </>
          )}

          <View style={styles.noteRow}>
            <View style={styles.noteDot} />
            <Text style={styles.noteText}>
              {submitted
                ? 'Keep this screen or return home — we’ll update your plan automatically.'
                : `This should match the ${amount} USDT you sent for ${planName}.`}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={submitted ? 'Back to Home' : 'Submit TXID'}
          onPress={submitted ? onBack : handleSubmit}
          disabled={!submitted && !canSubmit}
          style={!submitted && !canSubmit ? styles.disabledBtn : undefined}
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
  },
  card: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  headline: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.58)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
  },
  amountLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  amountValue: {
    marginTop: 4,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
  },
  planPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(155, 92, 255, 0.35)',
  },
  planPillText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
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
  pasteText: {
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
    justifyContent: 'center',
    marginBottom: 14,
  },
  fieldValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  txidField: {
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  txidFocused: {
    borderColor: colors.purpleBright,
  },
  txidInput: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: colors.white,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  txidPreview: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(221, 214, 254, 0.95)',
    lineHeight: 18,
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
