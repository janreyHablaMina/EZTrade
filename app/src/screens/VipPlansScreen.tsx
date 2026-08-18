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
                colors={['#4c1d95', '#09090b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeCard}
              >
              <View style={styles.activeCardHeader}>
                <Text style={styles.activeCardTitle}>{activePlan.name}</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              </View>
              <View style={styles.activeCardBody}>
                <Text style={styles.activeCardValue}>${formatUsdt(activePlan.amount)}</Text>
                <Text style={styles.activeCardLabel}>Deposit Required</Text>
              </View>
              <View style={styles.activeCardFooter}>
                <Text style={styles.activeCardLabel}>Est. Daily Yield: </Text>
                <Text style={styles.activeCardProfit}>+${formatUsdt(activePlan.daily)}</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {inactivePlans.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: activePlan ? 32 : 0 }]}>Available Upgrades</Text>
            <View style={styles.list}>
              {inactivePlans.map((plan) => (
                <LinearGradient
                  key={plan.id}
                  colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.elegantCard}
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
                      <Text style={styles.elegantUnlockText}>Upgrade</Text>
                    </Pressable>
                  </View>
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
  root: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  headerTitle: { fontFamily: 'Outfit_700Bold', fontSize: 32, color: '#ffffff', marginBottom: 4 },
  headerSubtitle: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: '#a0a0a0', marginBottom: 32 },
  sectionLabel: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: '#888888', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
  activePlanSection: { marginBottom: 16 },
  activeCard: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' },
  activeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  activeCardTitle: { fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#ffffff' },
  activeBadge: { backgroundColor: 'rgba(139, 92, 246, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  activeBadgeText: { fontFamily: 'Outfit_700Bold', fontSize: 10, color: '#a78bfa', letterSpacing: 1 },
  activeCardBody: { marginBottom: 24 },
  activeCardValue: { fontFamily: 'Outfit_800ExtraBold', fontSize: 38, color: '#ffffff' },
  list: { gap: 16 },
  elegantCard: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  elegantCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  elegantTitleRow: { flex: 1, alignItems: 'flex-start' },
  elegantCardTitle: { fontFamily: 'Outfit_700Bold', fontSize: 20, color: '#ffffff', marginBottom: 8 },
  elegantBadge: { backgroundColor: 'rgba(139, 92, 246, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' },
  elegantBadgeText: { fontFamily: 'Outfit_600SemiBold', fontSize: 11, color: '#a78bfa' },
  elegantCardPrice: { fontFamily: 'Outfit_800ExtraBold', fontSize: 26, color: '#ffffff' },
  elegantCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  elegantCardDaily: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: '#9ca3af' },
  elegantUnlockButton: { backgroundColor: '#ffffff', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, shadowColor: '#ffffff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  elegantUnlockText: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#000000' },
  
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
