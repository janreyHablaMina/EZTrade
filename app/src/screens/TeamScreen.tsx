import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const REFERRAL_CODE = 'EZTRADE12';
const REFERRAL_LINK = 'https://eztrade.app/r/EZTRADE12';

const RATES = {
  1: 0.1,
  2: 0.05,
  3: 0.03,
} as const;

const TEAM = [
  {
    name: 'Maria Santos',
    joined: 'Today',
    plan: 'VIP 1',
    level: 1,
    deposit: 10,
    status: 'Active',
  },
  {
    name: 'Alex Chen',
    joined: 'Yesterday',
    plan: 'VIP 2',
    level: 1,
    deposit: 50,
    status: 'Active',
  },
  {
    name: 'Priya Shah',
    joined: '2 days ago',
    plan: '—',
    level: 1,
    deposit: 0,
    status: 'Pending',
  },
  {
    name: 'Noah Kim',
    joined: 'Last week',
    plan: 'VIP 1',
    level: 2,
    deposit: 10,
    status: 'Active',
  },
  {
    name: 'Liam Ortiz',
    joined: 'Last week',
    plan: 'VIP 1',
    level: 2,
    deposit: 10,
    status: 'Active',
  },
  {
    name: 'Sofia Reyes',
    joined: 'Last week',
    plan: 'VIP 1',
    level: 3,
    deposit: 10,
    status: 'Active',
  },
] as const;

const FILTERS = ['All', 'Level 1', 'Level 2', 'Level 3'] as const;

type TeamScreenProps = {
  onBack?: () => void;
};

function commissionFor(level: 1 | 2 | 3, deposit: number) {
  return deposit * RATES[level];
}

function formatUsdt(value: number) {
  return value.toFixed(2);
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

async function copyText(value: string) {
  try {
    const maybeClipboard = (
      globalThis as {
        navigator?: { clipboard?: { writeText?: (v: string) => Promise<void> } };
      }
    ).navigator?.clipboard;
    await maybeClipboard?.writeText?.(value);
  } catch {
    // Frontend-only copy feedback
  }
}

export function TeamScreen({ onBack }: TeamScreenProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const totalBonus = useMemo(
    () =>
      TEAM.reduce(
        (sum, member) => sum + commissionFor(member.level, member.deposit),
        0,
      ),
    [],
  );

  const visible = TEAM.filter((member) => {
    if (filter === 'All') return true;
    return `Level ${member.level}` === filter;
  });

  const handleCopy = async (kind: 'code' | 'link', value: string) => {
    await copyText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Team" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Each time someone in your team deposits, you earn a cut of that
          deposit: 10% level 1, 5% level 2, 3% level 3.
        </Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Your referral code</Text>
          <View style={styles.field}>
            <Text style={styles.fieldValue}>{REFERRAL_CODE}</Text>
            <Pressable
              onPress={() => handleCopy('code', REFERRAL_CODE)}
              hitSlop={10}
            >
              <CopyIcon />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>Invite link</Text>
          <View style={[styles.field, styles.fieldLast]}>
            <Text style={styles.linkText} numberOfLines={1}>
              {REFERRAL_LINK}
            </Text>
            <Pressable
              onPress={() => handleCopy('link', REFERRAL_LINK)}
              hitSlop={10}
            >
              <CopyIcon />
            </Pressable>
          </View>
          {copied ? (
            <Text style={styles.copied}>
              {copied === 'code' ? 'Code copied' : 'Link copied'}
            </Text>
          ) : null}
        </View>

        <View style={styles.ratesRow}>
          {(
            [
              { level: 'Lv 1', rate: '10%' },
              { level: 'Lv 2', rate: '5%' },
              { level: 'Lv 3', rate: '3%' },
            ] as const
          ).map((item) => (
            <View key={item.level} style={styles.rateCard}>
              <Text style={styles.rateLevel}>{item.level}</Text>
              <Text style={styles.rateValue}>{item.rate}</Text>
              <Text style={styles.rateHint}>of deposit</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{String(TEAM.length)}</Text>
            <Text style={styles.statLabel}>Team</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statGreen]}>
              +{formatUsdt(totalBonus)}
            </Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Invited members</Text>
        <View style={styles.filters}>
          {FILTERS.map((item) => {
            const active = item === filter;
            return (
              <Pressable
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.list}>
          {visible.map((member) => {
            const earned = commissionFor(member.level, member.deposit);
            const pending = member.status === 'Pending';
            return (
              <View key={member.name} style={styles.memberRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.memberCopy}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberMeta}>
                    Lv {member.level} · {member.plan} ·{' '}
                    {pending ? 'No deposit yet' : `${member.deposit} USDT in`}
                  </Text>
                </View>
                <Text
                  style={[styles.earned, pending && styles.earnedPending]}
                >
                  {pending ? '—' : `+${formatUsdt(earned)}`}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 14,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.55)',
  },
  card: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
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
    marginBottom: 14,
    gap: 10,
  },
  fieldLast: {
    marginBottom: 0,
  },
  fieldValue: {
    flex: 1,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    letterSpacing: 1,
    color: colors.white,
  },
  linkText: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: colors.white,
  },
  copied: {
    marginTop: 10,
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: colors.green,
  },
  ratesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rateCard: {
    flex: 1,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  rateLevel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  rateValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    color: colors.purpleBright,
  },
  rateHint: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: colors.white,
  },
  statGreen: {
    color: '#86efac',
  },
  statLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
    marginTop: 2,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -4,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderColor: colors.purpleBright,
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  chipTextActive: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
  list: {
    gap: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  memberCopy: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  memberMeta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  earned: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: '#86efac',
  },
  earnedPending: {
    color: 'rgba(255,255,255,0.35)',
  },
});
