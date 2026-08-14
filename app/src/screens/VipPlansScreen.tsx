import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CheckIcon } from '../components/icons/CheckIcon';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const CURRENT_PLAN_ID = 'vip1';

const VIP_PLANS = [
  {
    id: 'vip1',
    name: 'VIP 1',
    amount: 10,
    profit: 20,
    daily: 2,
    popular: false,
  },
  {
    id: 'vip2',
    name: 'VIP 2',
    amount: 50,
    profit: 25,
    daily: 12.5,
    popular: true,
  },
  {
    id: 'vip3',
    name: 'VIP 3',
    amount: 100,
    profit: 30,
    daily: 30,
    popular: false,
  },
  {
    id: 'vip4',
    name: 'VIP 4',
    amount: 300,
    profit: 35,
    daily: 105,
    popular: false,
  },
] as const;

const FEATURES = [
  'Daily profit credited after Quantify',
  'Withdraw anytime to your USDT wallet',
  'Upgrade anytime to a higher VIP tier',
] as const;

type VipPlansScreenProps = {
  onBack?: () => void;
  onGetPlan?: (planId: string) => void;
};

function formatUsdt(value: number) {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

export function VipPlansScreen({ onBack, onGetPlan }: VipPlansScreenProps) {
  const [selectedId, setSelectedId] = useState<string>(CURRENT_PLAN_ID);
  const selected =
    VIP_PLANS.find((plan) => plan.id === selectedId) ?? VIP_PLANS[0];
  const isCurrent = selected.id === CURRENT_PLAN_ID;

  return (
    <View style={styles.root}>
      <ScreenHeader title="VIP Plans" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.currentChip}>
          <View style={styles.liveDot} />
          <Text style={styles.currentChipText}>Current plan · VIP 1</Text>
        </View>

        <LinearGradient
          colors={['#8b5cf6', '#6d28d9', '#4c1d95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroName}>{selected.name}</Text>
            {selected.popular ? (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most chosen</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.heroAmount}>{formatUsdt(selected.amount)} USDT</Text>
          <Text style={styles.heroHint}>One-time deposit to activate</Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Daily rate</Text>
              <Text style={styles.heroStatValue}>+{selected.profit}%</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>Est. daily</Text>
              <Text style={styles.heroStatValue}>
                +{formatUsdt(selected.daily)} USDT
              </Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Choose a tier</Text>
        <View style={styles.list}>
          {VIP_PLANS.map((plan) => {
            const active = plan.id === selectedId;
            const current = plan.id === CURRENT_PLAN_ID;
            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedId(plan.id)}
                style={[styles.row, active && styles.rowActive]}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowName}>
                    {plan.name}
                    {current ? '  ·  Active' : ''}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {formatUsdt(plan.amount)} USDT · +{plan.profit}% daily
                  </Text>
                </View>
                <Text style={styles.rowDaily}>+{formatUsdt(plan.daily)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Included with {selected.name}</Text>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <CheckIcon size={14} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={
            isCurrent
              ? `${selected.name} is active`
              : `Upgrade to ${selected.name}`
          }
          disabled={isCurrent}
          onPress={() => {
            if (isCurrent) return;
            onGetPlan?.(selected.id);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 14,
  },
  currentChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  currentChipText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroName: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
  },
  popularBadge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    color: colors.white,
  },
  heroAmount: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 36,
    color: colors.white,
    letterSpacing: -0.6,
  },
  heroHint: {
    marginTop: 4,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  heroStats: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  heroDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroStatLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  heroStatValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: '#bbf7d0',
  },
  sectionLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
    marginTop: 2,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowActive: {
    borderColor: colors.purpleBright,
    backgroundColor: 'rgba(124, 58, 237, 0.16)',
  },
  radio: {
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
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purpleBright,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  rowMeta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  rowDaily: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: '#86efac',
  },
  featuresCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  featuresTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
});
