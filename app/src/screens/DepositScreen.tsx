import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

const NETWORKS = [
  {
    id: 'trc20',
    label: 'TRC20 (USDT)',
    address: 'TUQeWfakqG2x9XbktH7nR4pL2mC8dY6aW1',
  },
  {
    id: 'erc20',
    label: 'ERC20 (USDT)',
    address: '0x8f3a21c9e4b7d0a1c6e5f92b4d8a7c3e1f0b9d62',
  },
  {
    id: 'bep20',
    label: 'BEP20 (USDT)',
    address: '0x4c1d95e7a2b8f0d6c3e9a1b7f5d2c8e4a0b6d193',
  },
] as const;

const STEPS = [
  'Send payment to the address',
  'Get the Transaction ID (TXID)',
  'Enter TXID in the next step',
] as const;

type DepositScreenProps = {
  amount?: string;
  planName?: string;
  onBack?: () => void;
  onSentPayment?: (networkLabel: string) => void;
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

function CopyIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 9h10v12H9z"
        stroke={colors.purpleBright}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M5 15H4V3h10v1"
        stroke={colors.purpleBright}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
  amount = '10.00',
  planName = 'VIP 1',
  onBack,
  onSentPayment,
}: DepositScreenProps) {
  const [networkId, setNetworkId] = useState<(typeof NETWORKS)[number]['id']>(
    'trc20',
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const network = NETWORKS.find((item) => item.id === networkId) ?? NETWORKS[0];

  const copyAddress = async () => {
    try {
      const maybeClipboard = (
        globalThis as { navigator?: { clipboard?: { writeText?: (v: string) => Promise<void> } } }
      ).navigator?.clipboard;
      await maybeClipboard?.writeText?.(network.address);
    } catch {
      // Frontend-only copy feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <BackIcon />
        </Pressable>
        <Text style={styles.title}>Deposit</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.intro}>Send USDT to the address below</Text>

          <View style={styles.networkWrap}>
            <Text style={styles.fieldLabel}>Network</Text>
            <Pressable
              style={styles.field}
              onPress={() => setPickerOpen((open) => !open)}
            >
              <Text style={styles.fieldValue}>{network.label}</Text>
              <View style={pickerOpen ? styles.chevronOpen : undefined}>
                <ChevronDown />
              </View>
            </Pressable>

            {pickerOpen ? (
              <View style={styles.picker}>
                {NETWORKS.map((item) => {
                  const active = item.id === networkId;
                  return (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.pickerItem,
                        active && styles.pickerItemActive,
                      ]}
                      onPress={() => {
                        setNetworkId(item.id);
                        setPickerOpen(false);
                        setCopied(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          active && styles.pickerTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <Text style={styles.fieldLabel}>Receiving Address</Text>
          <View style={styles.field}>
            <Text style={styles.addressText} numberOfLines={1}>
              {shortenAddress(network.address)}
            </Text>
            <Pressable onPress={copyAddress} hitSlop={10} style={styles.copyBtn}>
              <CopyIcon />
            </Pressable>
          </View>
          {copied ? <Text style={styles.copied}>Address copied</Text> : null}

          <AddressQr value={network.address} />

          <View style={styles.noteRow}>
            <View style={styles.noteDot} />
            <Text style={styles.noteText}>
              Send exactly <Text style={styles.noteStrong}>{amount} USDT</Text>{' '}
              to activate {planName} plan
            </Text>
          </View>
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
          onPress={() => onSentPayment?.(network.label)}
        />
      </View>
    </View>
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
  fieldValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
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
  qrFrame: {
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 18,
    padding: 8,
    borderRadius: 16,
    backgroundColor: colors.white,
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
