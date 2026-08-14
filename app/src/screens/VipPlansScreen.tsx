import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NebulaBackground } from '../components/NebulaBackground';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const VIP_PLANS = [
  {
    id: 'vip1',
    name: 'VIP 1',
    amount: '10',
    profit: '20%',
    minDeposit: '10 USDT',
    popular: true,
  },
  {
    id: 'vip2',
    name: 'VIP 2',
    amount: '50',
    profit: '25%',
    minDeposit: '50 USDT',
    popular: false,
  },
  {
    id: 'vip3',
    name: 'VIP 3',
    amount: '100',
    profit: '30%',
    minDeposit: '100 USDT',
    popular: false,
  },
  {
    id: 'vip4',
    name: 'VIP 4',
    amount: '300',
    profit: '35%',
    minDeposit: '300 USDT',
    popular: false,
  },
] as const;

const FEATURES = [
  'Daily automatic profit',
  'Withdraw anytime',
  'Secure & transparent',
] as const;

type VipPlansScreenProps = {
  onBack?: () => void;
  onGetPlan?: (planId: string) => void;
};

function CheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={colors.green}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function VipPlansScreen({ onBack, onGetPlan }: VipPlansScreenProps) {
  const [selectedId, setSelectedId] = useState<string>('vip1');
  const selected =
    VIP_PLANS.find((plan) => plan.id === selectedId) ?? VIP_PLANS[0];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />

      <ScreenHeader title="VIP Plans" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Choose your growth plan</Text>
          <Text style={styles.introSubtitle}>
            Higher VIP tiers unlock stronger daily returns.
          </Text>
        </View>

        <View style={styles.grid}>
          {VIP_PLANS.map((plan) => {
            const active = plan.id === selectedId;

            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedId(plan.id)}
                style={[styles.planCard, active && styles.planCardActive]}
              >
                {active ? (
                  <LinearGradient
                    colors={[
                      'rgba(139, 92, 246, 0.28)',
                      'rgba(76, 29, 149, 0.12)',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />
                ) : null}

                <View style={styles.planTop}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.popular ? (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.amountRow}>
                  <Text style={styles.planAmount}>{plan.amount}</Text>
                  <Text style={styles.planCurrency}>USDT</Text>
                </View>

                <View style={styles.profitChip}>
                  <Text style={styles.profitText}>+{plan.profit} daily</Text>
                </View>

                <Text style={styles.minDeposit}>Min {plan.minDeposit}</Text>

                <View
                  style={[styles.radio, active && styles.radioActive]}
                >
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What you get</Text>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <CheckIcon />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerMeta}>
          <Text style={styles.footerLabel}>Selected</Text>
          <Text style={styles.footerValue}>
            {selected.name} · {selected.amount} USDT · +{selected.profit}
          </Text>
        </View>
        <PrimaryButton
          label={`Get ${selected.name}`}
          onPress={() => onGetPlan?.(selected.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    zIndex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 18,
  },
  intro: {
    gap: 6,
    marginBottom: 2,
  },
  introTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 26,
    color: colors.white,
    letterSpacing: -0.4,
  },
  introSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(226, 214, 255, 0.68)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  planCard: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.18)',
    backgroundColor: 'rgba(14, 10, 28, 0.92)',
    padding: 16,
    overflow: 'hidden',
    minHeight: 168,
  },
  planCardActive: {
    borderColor: 'rgba(168, 85, 247, 0.85)',
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    minHeight: 22,
  },
  planName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
  },
  popularBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.22)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: '#e9d5ff',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    marginBottom: 10,
  },
  planAmount: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    color: colors.white,
    lineHeight: 34,
  },
  planCurrency: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 4,
  },
  profitChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  profitText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#86efac',
  },
  minDeposit: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  radio: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.purpleBright,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purpleBright,
  },
  featuresCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.16)',
    backgroundColor: 'rgba(14, 10, 28, 0.8)',
    padding: 18,
    gap: 12,
  },
  featuresTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
    marginBottom: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  footer: {
    zIndex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(5, 1, 15, 0.88)',
    gap: 12,
  },
  footerMeta: {
    gap: 2,
  },
  footerLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  footerValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
});
