import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { Lock, Check } from '../components/Icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { apiClient } from '../lib/api';

type VipPlansScreenProps = {
  user?: any;
  onBack?: () => void;
};

function formatUsdt(value: number) {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

export function VipPlansScreen({ user, onBack }: VipPlansScreenProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(user?.vip_plan_id?.toString() || '');
  const [selectedPlanToUnlock, setSelectedPlanToUnlock] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await apiClient.get('/vip-plans');
        const mapped = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.level,
          amount: Number(p.min_deposit),
          profit: Number(p.daily_profit_percent),
          daily: Number(p.min_deposit) * (Number(p.daily_profit_percent) / 100),
          popular: false,
        }));
        setPlans(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleUnlockClick = (plan: any) => {
    if (!user || !user.id) return;
    setErrorMsg('');
    setSuccessMsg('');
    setSelectedPlanToUnlock(plan);
  };

  const confirmUnlock = async () => {
    if (!selectedPlanToUnlock) return;
    setIsUnlocking(true);
    setErrorMsg('');
    try {
      const res = await apiClient.post('/vip-plans/unlock', {
        user_id: user.id,
        plan_id: selectedPlanToUnlock.id,
      });
      setCurrentPlanId(selectedPlanToUnlock.id.toString());
      setSuccessMsg(res.message || 'VIP Plan unlocked successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not unlock plan.');
    } finally {
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.purpleBright} size="large" />
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="VIP Plans" onBack={onBack} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>No VIP Plans found.</Text>
        </View>
      </View>
    );
  }

  const activePlan = plans.find(p => p.id === currentPlanId);
  const inactivePlans = plans.filter(p => p.id !== currentPlanId);

  return (
    <View style={styles.root}>
      <ScreenHeader title="VIP Plans" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Unlock Your Potential</Text>
        <Text style={styles.headerSubtitle}>Choose a premium plan and start earning daily yields.</Text>

        {activePlan && (
          <View style={styles.activePlanSection}>
            <Text style={styles.sectionLabel}>Your Active Plan</Text>
            <View style={styles.creditCardContainer}>
              {/* Outer glow effect via absolute positioned gradient */}
              <LinearGradient
                colors={['#8b5cf6', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.creditCardGlow}
              />
              
              <LinearGradient
                colors={['#1c1c1e', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.creditCard}
              >
                <View style={styles.creditCardHeader}>
                  <Text style={styles.creditCardLogo}>EZTRADE VIP</Text>
                  <View style={styles.activeBadgeOutline}>
                    <View style={styles.activeDotPulse} />
                    <Text style={styles.activeBadgeTextOutline}>ACTIVE</Text>
                  </View>
                </View>

                <View style={styles.creditCardBody}>
                  <Text style={styles.creditCardLabel}>Balance Required</Text>
                  <View style={styles.creditCardBalance}>
                    <Text style={styles.creditCardSymbol}>$</Text>
                    <Text style={styles.creditCardAmount}>{formatUsdt(activePlan.amount)}</Text>
                  </View>
                </View>

                <View style={styles.creditCardFooter}>
                  <View>
                    <Text style={styles.creditCardFooterLabel}>TIER</Text>
                    <Text style={styles.creditCardFooterValue}>{activePlan.name}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.creditCardFooterLabel}>EST. DAILY</Text>
                    <Text style={[styles.creditCardFooterValue, { color: colors.green }]}>
                      +${formatUsdt(activePlan.daily)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}

        {inactivePlans.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: activePlan ? 24 : 0 }]}>Available Upgrades</Text>
            <View style={styles.list}>
              {inactivePlans.map((plan) => (
                <LinearGradient
                  key={plan.id}
                  colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardName}>{plan.name}</Text>
                    <View style={styles.lockContainer}>
                      <Lock size={16} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                    </View>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.priceSymbol}>$</Text>
                    <Text style={styles.priceAmount}>{formatUsdt(plan.amount)}</Text>
                    <Text style={styles.priceCurrency}>USDT</Text>
                  </View>

                  <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Daily Return</Text>
                      <Text style={styles.statValue}>+{plan.profit}%</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Est. Daily</Text>
                      <Text style={styles.statValue}>+${formatUsdt(plan.daily)}</Text>
                    </View>
                  </View>

                  <Pressable 
                    style={styles.unlockButton} 
                    onPress={() => handleUnlockClick(plan)}
                  >
                    <Text style={styles.unlockButtonText}>Unlock {plan.name}</Text>
                  </Pressable>
                </LinearGradient>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Custom Unlock Modal */}
      <Modal
        visible={!!selectedPlanToUnlock}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {successMsg ? (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <View style={styles.successCircle}>
                  <Check size={32} color={colors.green} />
                </View>
                <Text style={styles.modalTitle}>Success!</Text>
                <Text style={[styles.modalMessage, { textAlign: 'center' }]}>{successMsg}</Text>
                <Pressable 
                  style={[styles.modalConfirmButton, { width: '100%', flex: 0, marginTop: 10 }]} 
                  onPress={() => setSelectedPlanToUnlock(null)}
                >
                  <Text style={styles.modalConfirmText}>Awesome</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Confirm Unlock</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to spend <Text style={{ color: colors.white }}>${formatUsdt(selectedPlanToUnlock?.amount || 0)} USDT</Text> to unlock {selectedPlanToUnlock?.name}?
                </Text>
                {errorMsg ? <Text style={styles.modalError}>{errorMsg}</Text> : null}

                <View style={styles.modalActions}>
                  <Pressable 
                    style={styles.modalCancelButton} 
                    onPress={() => setSelectedPlanToUnlock(null)}
                    disabled={isUnlocking}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.modalConfirmButton, isUnlocking && { opacity: 0.7 }]} 
                    onPress={confirmUnlock}
                    disabled={isUnlocking}
                  >
                    {isUnlocking ? (
                      <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                      <Text style={styles.modalConfirmText}>Confirm</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  headerTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 28,
    color: colors.white,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
    marginBottom: 16,
  },
  activePlanSection: {
    marginBottom: 8,
  },
  creditCardContainer: {
    position: 'relative',
    borderRadius: 20,
    width: '100%',
    aspectRatio: 1.586, // Standard credit card aspect ratio
  },
  creditCardGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 22,
    opacity: 0.5,
    transform: [{ scale: 1.02 }],
  },
  creditCard: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'space-between',
  },
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditCardLogo: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
  },
  activeBadgeOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  activeDotPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.purpleBright,
  },
  activeBadgeTextOutline: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    color: colors.purpleBright,
    letterSpacing: 1,
  },
  creditCardBody: {
    marginTop: 20,
  },
  creditCardLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  creditCardBalance: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  creditCardSymbol: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 24,
    color: 'rgba(255,255,255,0.6)',
    marginRight: 4,
  },
  creditCardAmount: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 42,
    color: colors.white,
    letterSpacing: 2,
  },
  creditCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  creditCardFooterLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    marginBottom: 4,
  },
  creditCardFooterValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 1,
  },
  list: {
    gap: 16,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardName: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 22,
    color: colors.white,
  },
  lockContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  priceSymbol: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.5)',
    marginRight: 2,
  },
  priceAmount: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 36,
    color: colors.white,
    letterSpacing: -1,
  },
  priceCurrency: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  statLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    color: colors.green,
  },
  unlockButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1a1b23',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 20,
    color: colors.white,
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalError: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  modalCancelText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.purpleBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});
