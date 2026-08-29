import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { Lock, Check, Zap, CheckCircle } from '../components/Icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { AnimatedLoading } from '../components/AnimatedLoading';
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
        const data = await apiClient.get('/vip-plans?status=Active');
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
    return <AnimatedLoading text="Loading Plans..." />;
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
  const inactivePlans = plans.filter(p => p.id !== currentPlanId).sort((a, b) => a.amount - b.amount);

  return (
    <View style={styles.root}>
      <ScreenHeader title="VIP Plans" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>VIP Plans</Text>
        <Text style={styles.headerSubtitle}>Simple, elegant yields for your investments.</Text>

        {activePlan && (
          <View style={styles.activePlanSection}>
            <Text style={styles.sectionLabel}>Current Plan</Text>
            <LinearGradient
                colors={['rgba(168, 85, 247, 0.6)', 'rgba(109, 40, 217, 0.6)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeCard}
              >
              {/* Background Watermark for Emphasis */}
              <View style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.1, transform: [{ rotate: '-15deg' }] }}>
                <CheckCircle size={180} color="#ffffff" />
              </View>
              
              <View style={styles.activeCardHeader}>
                <Text style={styles.activeCardTitle}>{activePlan.name}</Text>
                <View style={[styles.activeBadge, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#34d399' }} />
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              
              <View style={styles.activeCardBody}>
                <Text style={styles.activeCardLabel}>Current Deposit</Text>
                <Text style={styles.activeCardValue}>${formatUsdt(activePlan.amount)}</Text>
              </View>
              
              <View style={{ marginTop: 'auto', paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
                <Text style={styles.activeCardProfit}>+${formatUsdt(activePlan.daily)} / day return</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {inactivePlans.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: activePlan ? 32 : 0 }]}>Available Upgrades</Text>
            <View style={styles.list}>
              {inactivePlans.map((plan) => (
                <View
                  key={plan.id}
                  style={[styles.elegantCard, { backgroundColor: 'rgba(20, 15, 30, 0.8)' }]}
                >
                  <View style={styles.elegantCardHeader}>
                    <View style={styles.elegantTitleRow}>
                      <Text style={styles.elegantCardTitle}>{plan.name}</Text>
                      <View style={styles.elegantBadge}>
                        <Text style={styles.elegantBadgeText}>+{plan.profit}%/day</Text>
                      </View>
                    </View>
                    <Text style={styles.elegantCardPrice}>${formatUsdt(plan.amount)}</Text>
                  </View>
                  
                  <View style={styles.elegantCardFooter}>
                    <Text style={styles.elegantCardDaily}>Est. ${formatUsdt(plan.daily)} daily return</Text>
                    <Pressable 
                      style={styles.elegantUnlockButton} 
                      onPress={() => handleUnlockClick(plan)}
                    >
                      <Lock size={16} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.elegantUnlockText}>Unlock</Text>
                    </Pressable>
                  </View>
                </View>
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
  root: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  headerTitle: { fontFamily: 'Outfit_700Bold', fontSize: 32, color: '#ffffff', marginBottom: 4 },
  headerSubtitle: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: '#a0a0a0', marginBottom: 32 },
  sectionLabel: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: '#888888', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
  activePlanSection: { marginBottom: 16 },
  activeCard: { borderRadius: 24, padding: 28, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.4)', overflow: 'hidden', minHeight: 220 },
  activeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  activeBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  activeBadgeText: { fontFamily: 'Outfit_800ExtraBold', fontSize: 11, color: '#ffffff', letterSpacing: 1.5 },
  activeCardProfit: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: '#34d399' },
  activeCardBody: { alignItems: 'flex-start', flex: 1 },
  activeCardTitle: { fontFamily: 'Outfit_800ExtraBold', fontSize: 26, color: '#ffffff' },
  activeCardValue: { fontFamily: 'Outfit_800ExtraBold', fontSize: 44, color: '#ffffff', marginTop: 4 },
  activeCardLabel: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  list: { gap: 16 },
  elegantCard: { borderRadius: 24, padding: 24, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.4)' },
  elegantCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  elegantTitleRow: { flex: 1, alignItems: 'flex-start' },
  elegantCardTitle: { fontFamily: 'Outfit_700Bold', fontSize: 20, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  elegantBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  elegantBadgeText: { fontFamily: 'Outfit_700Bold', fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  elegantCardPrice: { fontFamily: 'Outfit_800ExtraBold', fontSize: 26, color: 'rgba(255,255,255,0.9)' },
  elegantCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  elegantCardDaily: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  elegantUnlockButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.2)' },
  elegantUnlockText: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: 'rgba(255,255,255,0.7)' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(5, 1, 15, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: colors.card, borderRadius: 28, padding: 32, width: '100%', borderWidth: 1, borderColor: colors.cardBorder, shadowColor: colors.purpleBright, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20 },
  modalTitle: { fontFamily: 'Outfit_800ExtraBold', fontSize: 24, color: colors.white, marginBottom: 12, textAlign: 'center' },
  modalMessage: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: colors.whiteMuted, lineHeight: 24, marginBottom: 32, textAlign: 'center' },
  modalError: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: '#ef4444', marginBottom: 16, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 16 },
  modalCancelButton: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  modalCancelText: { fontFamily: 'Outfit_600SemiBold', fontSize: 16, color: colors.whiteMuted },
  modalConfirmButton: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  modalConfirmText: { fontFamily: 'Outfit_800ExtraBold', fontSize: 16, color: colors.white },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34, 197, 94, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.3)' },
});
