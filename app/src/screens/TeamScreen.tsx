import { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { FilterChips } from '../components/FilterChips';
import { Copy } from '../components/Icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { copyToClipboard } from '../lib/clipboard';
import { colors } from '../theme/colors';
import { apiClient } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

const RATES = {
  1: 0.1,
  2: 0.05,
  3: 0.03,
} as const;

const FILTERS = ['All', 'Level 1', 'Level 2', 'Level 3'] as const;

type TeamMember = {
  name: string;
  joined: string;
  plan: string;
  level: 1 | 2 | 3;
  deposit: number;
  status: 'Active' | 'Pending';
};

type TeamScreenProps = {
  user?: any;
  onBack?: () => void;
};

function commissionFor(level: 1 | 2 | 3, deposit: number) {
  return deposit * RATES[level];
}

function formatUsdt(value: number) {
  return value.toFixed(2);
}

export function TeamScreen({ user, onBack }: TeamScreenProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    apiClient.get(`/users/${user.id}/team`)
      .then((data) => {
        setTeam(data.team || []);
        setTotalEarned(data.total_earned || 0);
        setReferralCode(data.referral_code || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const visible = team.filter((member) => {
    if (filter === 'All') return true;
    return `Level ${member.level}` === filter;
  });

  const handleCopy = async () => {
    if (!referralCode) return;
    await copyToClipboard(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Team & Referrals" onBack={onBack} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
        </View>
      ) : (
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Invite friends to trade and earn a percentage of their very first deposit. The more they trade, the more you earn!
        </Text>

        <Pressable onPress={handleCopy} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <LinearGradient
            colors={['#8B5CF6', '#C026D3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumCard}
          >
            <View style={styles.premiumCardInner}>
              <View>
                <Text style={styles.premiumCardLabel}>YOUR REFERRAL CODE</Text>
                <Text style={styles.premiumCardCode}>{referralCode || '...'}</Text>
              </View>
              <View style={styles.copyButton}>
                {copied ? (
                  <Text style={styles.copiedText}>COPIED!</Text>
                ) : (
                  <Copy color={colors.white} size={22} />
                )}
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Team Size</Text>
            <Text style={styles.statValue}>{String(team.length + 1)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Earned</Text>
            <Text style={[styles.statValue, styles.statGreen]}>
              +${formatUsdt(totalEarned)}
            </Text>
          </View>
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
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Invited Members</Text>
        </View>
        
        <FilterChips items={FILTERS} value={filter} onChange={setFilter} wrap />

        <View style={styles.list}>
          {visible.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No members found.</Text>
            </View>
          ) : (
            visible.map((member, i) => {
              const earned = commissionFor(member.level, member.deposit);
              const pending = member.status === 'Pending';
              return (
                <View key={member.name + i} style={styles.memberRow}>
                  <LinearGradient
                    colors={['rgba(139, 92, 246, 0.2)', 'rgba(192, 38, 211, 0.2)']}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>
                      {member.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </LinearGradient>
                  
                  <View style={styles.memberCopy}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberMeta}>
                      Lv {member.level} <Text style={{color: 'rgba(255,255,255,0.2)'}}>•</Text> {member.plan} <Text style={{color: 'rgba(255,255,255,0.2)'}}>•</Text>{' '}
                      {pending ? 'No deposit yet' : `$${member.deposit} in`}
                    </Text>
                  </View>
                  <Text
                    style={[styles.earned, pending && styles.earnedPending]}
                  >
                    {pending ? '—' : `+$${formatUsdt(earned)}`}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 18,
  },
  intro: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  premiumCard: {
    borderRadius: 24,
    padding: 2, // Border thickness
    shadowColor: '#C026D3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  premiumCardInner: {
    backgroundColor: 'rgba(15, 15, 15, 0.6)', // Glass effect
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumCardLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  premiumCardCode: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    letterSpacing: 2,
    color: colors.white,
  },
  copyButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  copiedText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
  },
  statGreen: {
    color: '#34d399',
  },
  statLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  ratesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rateCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 2,
  },
  rateLevel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  rateValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 20,
    color: '#c084fc',
  },
  sectionHeader: {
    marginTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
  },
  list: {
    gap: 12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 38, 211, 0.3)',
  },
  avatarText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
    letterSpacing: 1,
  },
  memberCopy: {
    flex: 1,
    gap: 4,
  },
  memberName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  memberMeta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  earned: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: '#34d399',
  },
  earnedPending: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
  },
});
