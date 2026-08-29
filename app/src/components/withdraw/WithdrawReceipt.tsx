import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckCircle } from '../Icons';
import { colors } from '../../theme/colors';
import { hourClockLabel, WITHDRAW_PROCESS_FROM_HOUR } from '../../lib/wallet';

type WithdrawReceiptProps = {
  receive: number;
  displayNetwork: string;
  withdrawFeePercent: number;
  settings?: { start_time?: string; end_time?: string } | null;
};

export function WithdrawReceipt({
  receive,
  displayNetwork,
  withdrawFeePercent,
  settings,
}: WithdrawReceiptProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} bounces={false}>
      <View style={[styles.card, { padding: 32, alignItems: 'center', marginTop: 40 }]}>
        <View style={styles.iconContainer}>
          <CheckCircle size={40} color="#4ade80" />
        </View>
        <Text style={[styles.successTitle, { textAlign: 'center' }]}>Withdraw Requested</Text>
        <Text style={[styles.intro, { textAlign: 'center', fontSize: 16 }]}>
          You will receive <Text style={styles.boldAmount}>{receive.toFixed(2)} USDT</Text> on {displayNetwork}{' '}
          after the {withdrawFeePercent}% fee.
        </Text>
        <View style={styles.divider} />
        <Text style={styles.disclaimerText}>
          Status is pending until processed. Processing hours are from {settings?.start_time || hourClockLabel(WITHDRAW_PROCESS_FROM_HOUR)} to {settings?.end_time || '12:00 AM'}.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 24,
    color: colors.white,
    marginBottom: 8,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  boldAmount: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 20,
  },
  disclaimerText: {
    fontFamily: 'Outfit_400Regular',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 22,
  },
});
