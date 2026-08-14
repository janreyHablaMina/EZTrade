import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { PrimaryButton } from '../components/PrimaryButton';
import { colors } from '../theme/colors';

type DepositSuccessScreenProps = {
  planName?: string;
  amount?: string;
  onGoDashboard?: () => void;
};

function SuccessMark() {
  return (
    <View style={styles.markWrap}>
      <View style={styles.markGlow} />
      <View style={styles.markRing} />
      <Svg width={88} height={88} viewBox="0 0 88 88">
        <Circle cx="44" cy="44" r="40" fill="#22c55e" />
        <Path
          d="M26 45.5l12 12 24-26"
          stroke={colors.white}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

export function DepositSuccessScreen({
  planName = 'VIP 1',
  amount = '10.00',
  onGoDashboard,
}: DepositSuccessScreenProps) {
  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <SuccessMark />
        <Text style={styles.title}>Deposit Successful!</Text>
        <Text style={styles.subtitle}>Your account has been activated.</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Plan</Text>
            <Text style={styles.value}>{planName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>{amount} USDT</Text>
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.status}>Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Go to Dashboard" onPress={onGoDashboard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  markWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  markGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(34, 197, 94, 0.22)',
  },
  markRing: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 2,
    borderColor: 'rgba(134, 239, 172, 0.45)',
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.58)',
    textAlign: 'center',
    marginBottom: 28,
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  value: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  status: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#4ade80',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
});
