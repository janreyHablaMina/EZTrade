import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { AmountField } from '../components/AmountField';
import { Copy } from '../components/Icons';
import { NetworkPicker } from '../components/NetworkPicker';
import { NoteRow } from '../components/NoteRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { copyToClipboard } from '../lib/clipboard';
import {
  MIN_USDT,
  type NetworkId,
  getNetwork,
  parseAmount,
} from '../lib/wallet';
import { colors } from '../theme/colors';

const STEPS = [
  'Send payment to the address',
  'Get the Transaction ID (TXID)',
  'Enter TXID in the next step',
] as const;

type DepositScreenProps = {
  amount?: string;
  planName?: string;
  onBack?: () => void;
  onSentPayment?: (networkLabel: string, amount: string) => void;
};

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function AddressQr({ value }: { value: string }) {
  const size = 21;
  const cells = useMemo(() => {
    const seed = hashSeed(value);
    const grid = Array.from({ length: size * size }, (_, index) => {
      const n = (seed ^ Math.imul(index + 1, 2654435761)) >>> 0;
      return n % 3 !== 0;
    });

    const stampFinder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y += 1) {
        for (let x = 0; x < 7; x += 1) {
          const edge = x === 0 || y === 0 || x === 6 || y === 6;
          const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[(oy + y) * size + (ox + x)] = edge || inner;
        }
      }
    };

    stampFinder(0, 0);
    stampFinder(size - 7, 0);
    stampFinder(0, size - 7);
    return grid;
  }, [value]);

  const cell = 7.2;
  const pad = 10;
  const box = pad * 2 + size * cell;

  return (
    <View style={styles.qrFrame}>
      <Svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}>
        <Rect x={0} y={0} width={box} height={box} rx={8} fill={colors.white} />
        {cells.map((on, index) => {
          if (!on) return null;
          const x = index % size;
          const y = Math.floor(index / size);
          return (
            <Rect
              key={index}
              x={pad + x * cell}
              y={pad + y * cell}
              width={cell - 0.6}
              height={cell - 0.6}
              fill="#111827"
            />
          );
        })}
      </Svg>
    </View>
  );
}

function shortenAddress(address: string) {
  if (address.length <= 22) return address;
  return `${address.slice(0, 12)}...${address.slice(-6)}`;
}

export function DepositScreen({
  amount: initialAmount = '',
  planName = 'VIP 1',
  onBack,
  onSentPayment,
}: DepositScreenProps) {
  const [networkId, setNetworkId] = useState<NetworkId>('trc20');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(initialAmount);

  const network = getNetwork(networkId);
  const parsed = parseAmount(amount);
  const hasAmount = amount.trim().length > 0;
  const validAmount = Number.isFinite(parsed) && parsed >= MIN_USDT;
  const amountError = hasAmount && !validAmount;
  const displayAmount = validAmount ? parsed.toFixed(2) : null;

  const copyAddress = async () => {
    await copyToClipboard(network.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Deposit" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.intro}>Send USDT to the address below</Text>

          <AmountField
            value={amount}
            onChangeText={setAmount}
            error={
              amountError ? `Minimum deposit is ${MIN_USDT} USDT.` : null
            }
          />

          <NetworkPicker
            value={networkId}
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            onChange={(id) => {
              setNetworkId(id);
              setCopied(false);
            }}
          />

          <Text style={styles.fieldLabel}>Receiving Address</Text>
          <View style={styles.field}>
            <Text style={styles.addressText} numberOfLines={1}>
              {shortenAddress(network.address)}
            </Text>
            <Pressable onPress={copyAddress} hitSlop={10} style={styles.copyBtn}>
              <Copy size={16} color="rgba(255,255,255,0.6)" strokeWidth={2} />
            </Pressable>
          </View>
          {copied ? <Text style={styles.copied}>Address copied</Text> : null}

          <AddressQr value={network.address} />

          <NoteRow>
            Minimum {MIN_USDT} USDT. Send exactly{' '}
            <Text style={styles.noteStrong}>
              {displayAmount ?? `${MIN_USDT}.00`} USDT
            </Text>{' '}
            to this address
            {planName ? ` to activate ${planName}` : ''}.
          </NoteRow>
        </View>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="I Have Sent Payment"
          onPress={() => {
            if (!validAmount) return;
            onSentPayment?.(network.label, displayAmount ?? parsed.toFixed(2));
          }}
          disabled={!validAmount}
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
    gap: 16,
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
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
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
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  addressText: {
    flex: 1,
    marginRight: 10,
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: colors.white,
  },
  copyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
  },
  copied: {
    marginTop: -8,
    marginBottom: 10,
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: colors.green,
  },
  qrFrame: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    padding: 8,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  noteStrong: {
    fontFamily: 'Outfit_700Bold',
    color: colors.white,
  },
  steps: {
    gap: 14,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
  },
  stepBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
