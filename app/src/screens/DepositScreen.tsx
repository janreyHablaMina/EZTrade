import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Copy } from '../components/Icons';
import { NoteRow } from '../components/NoteRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { copyToClipboard } from '../lib/clipboard';
import {
  MIN_USDT,
  type NetworkId,
  getNetwork,
  NETWORKS,
  parseAmount,
} from '../lib/wallet';
import { colors } from '../theme/colors';
import { API_BASE_URL } from '../lib/api';

const STEPS = [
  'Send payment to the address below',
  'Get the Transaction ID (TXID) from your wallet',
  'Enter the TXID in the next step to verify',
] as const;

type DepositScreenProps = {
  amount?: string;
  planName?: string;
  systemSettings?: any;
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
  systemSettings,
  onBack,
  onSentPayment,
}: DepositScreenProps) {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(initialAmount);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Parse wallets from system settings (if available) or fallback to static networks
  const wallets = useMemo(() => {
    const dynamicWallets = systemSettings?.deposit_addresses?.wallets;
    if (Array.isArray(dynamicWallets) && dynamicWallets.length > 0) {
      return dynamicWallets;
    }
    // Fallback to static if setting hasn't loaded or is missing
    return NETWORKS.map(n => ({
      id: n.id,
      name: n.label,
      address: n.address,
      qr_url: null
    }));
  }, [systemSettings]);

  // Set default selection when wallets load
  useEffect(() => {
    if (wallets.length > 0 && (!walletId || !wallets.find(w => w.id === walletId))) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  const selectedWallet = useMemo(() => {
    return wallets.find(w => w.id === walletId) || wallets[0];
  }, [wallets, walletId]);

  const minDeposit = systemSettings?.deposit_addresses?.min_deposit ?? MIN_USDT;

  const parsed = parseAmount(amount);
  const hasAmount = amount.trim().length > 0;
  const validAmount = Number.isFinite(parsed) && parsed >= minDeposit;
  const amountError = hasAmount && !validAmount;
  const displayAmount = validAmount ? parsed.toFixed(2) : null;

  const copyAddress = async () => {
    if (!selectedWallet) return;
    await copyToClipboard(selectedWallet.address);
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
        bounces={true}
      >
        {/* Network Selection Tabs (Exchange Style) */}
        <Text style={styles.sectionTitle}>Select Network</Text>
        <NetworkTabs
          networks={wallets.map(w => ({ id: w.id, label: w.name }))}
          selectedId={walletId as NetworkId}
          onSelect={(id) => {
            setWalletId(id);
            setCopied(false);
          }}
        />

        {/* Massive Amount Input Area */}
        <View style={styles.amountArea}>
          <Text style={styles.sectionTitle}>Deposit Amount</Text>
          <MassiveAmountInput
            amount={amount}
            setAmount={setAmount}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
          />
          
          <View style={styles.balanceInfoRow}>
            <Text style={styles.availableText}>{planName ? `Plan: ${planName}` : 'Enter amount to deposit'}</Text>
            {amountError && (
              <Text style={styles.errorText}>
                Min. {minDeposit} USDT
              </Text>
            )}
          </View>
        </View>

        {/* Transfer Details Card */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Transfer Details</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Receiving Address</Text>
          <View style={styles.field}>
            <Text style={styles.addressText} numberOfLines={1}>
              {selectedWallet ? shortenAddress(selectedWallet.address) : ''}
            </Text>
            <Pressable onPress={copyAddress} hitSlop={10} style={styles.copyBtn}>
              <Copy size={16} color="rgba(255,255,255,0.6)" strokeWidth={2} />
            </Pressable>
          </View>
          {copied ? <Text style={styles.copied}>Address copied!</Text> : null}

          {selectedWallet?.qr_url ? (
            <Image 
              source={{ uri: `${API_BASE_URL.replace('/api', '')}/${selectedWallet.qr_url}` }} 
              style={styles.qrImage} 
              resizeMode="contain" 
            />
          ) : selectedWallet ? (
            <AddressQr value={selectedWallet.address} />
          ) : null}

          <NoteRow>
            Minimum {minDeposit} USDT. Send exactly{' '}
            <Text style={styles.noteStrong}>
              {displayAmount ?? `${minDeposit}.00`} USDT
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
            onSentPayment?.(selectedWallet?.name || 'Unknown', displayAmount ?? parsed.toFixed(2));
          }}
          disabled={!validAmount || !selectedWallet}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgDeep,
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
  
  /* --- Massive Amount Area --- */
  amountArea: {
    marginBottom: 24,
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
  card: {
    backgroundColor: 'rgba(18, 16, 31, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
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
    marginBottom: 12,
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
    marginTop: -4,
    marginBottom: 12,
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: colors.green,
  },
  qrFrame: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  qrImage: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  noteStrong: {
    fontFamily: 'Outfit_700Bold',
    color: colors.white,
  },

  /* --- Steps --- */
  steps: {
    gap: 14,
    paddingHorizontal: 4,
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
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.5)',
  },
  stepBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.purpleBright,
  },
  stepText: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    backgroundColor: colors.bgDeep,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
});
