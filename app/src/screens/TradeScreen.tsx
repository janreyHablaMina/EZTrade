import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { Key, Zap, Clock, CheckCircle } from 'lucide-react-native';
import { useTradeCode } from '../hooks/useTradeCode';

const useNativeDriver = Platform.OS !== 'web';
const RING_SIZE = 188;
const RING_R = 82;
const RING_C = 2 * Math.PI * RING_R;

type TradeScreenProps = {
  onBack?: () => void;
  user?: any;
};

function ProgressRing({ progress }: { progress: number }) {
  const offset = RING_C * (1 - progress);
  return (
    <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
      <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} stroke="rgba(167, 139, 250, 0.18)" strokeWidth={8} fill="none" />
      <Circle
        cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
        stroke={colors.purpleBright} strokeWidth={8} fill="none"
        strokeDasharray={`${RING_C} ${RING_C}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    </Svg>
  );
}

export function TradeScreen({ onBack, user }: TradeScreenProps) {
  const { code, setCode, submitting, redeemed, reward, newBalance, errorMsg, handleSubmit, handleReset } = useTradeCode(user);

  const successScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (redeemed) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, useNativeDriver }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [redeemed]);

  useEffect(() => {
    if (redeemed) {
      Animated.spring(successScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver }).start();
    } else {
      successScale.setValue(0);
    }
  }, [redeemed]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader title="Trade" onBack={onBack} padded={false} />
      <Text style={styles.subtitle}>Enter your trading code to quantify today's yield</Text>

      {/* Hero orb */}
      <View style={styles.hero}>
        <View style={styles.orbWrap}>
          <ProgressRing progress={redeemed ? 1 : 0} />
          {redeemed ? (
            <Animated.View style={[styles.orbSuccess, { transform: [{ scale: successScale }] }]}>
              <CheckCircle size={32} color="#4ade80" />
              <Text style={styles.orbSuccessLabel}>Quantified!</Text>
              <Text style={styles.orbSuccessReward}>+${Number(reward).toFixed(2)}</Text>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.orbIdle, { transform: [{ scale: pulseAnim }] }]}>
              <Zap size={32} color="rgba(167,139,250,0.8)" />
              <Text style={styles.orbIdleLabel}>Awaiting</Text>
              <Text style={styles.orbIdleSub}>Code</Text>
            </Animated.View>
          )}
        </View>

        {redeemed ? (
          <Text style={styles.heroHintSuccess}>
            Your VIP yield has been credited to your balance.
          </Text>
        ) : (
          <Text style={styles.heroHint}>
            Check your notifications for the latest trading code from the admin.
          </Text>
        )}
      </View>

      {/* Code Input Section */}
      {!redeemed ? (
        <View style={styles.inputSection}>
          <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.03)']}
            style={styles.inputCard}
          >
            <View style={styles.inputHeader}>
              <Key size={18} color="rgba(167,139,250,0.8)" />
              <Text style={styles.inputLabel}>Trading Code</Text>
            </View>

            <TextInput
              style={styles.textInput}
              value={code}
              onChangeText={(t) => { setCode(t.toUpperCase()); setErrorMsg(''); }}
              placeholder="e.g. EZ9X2P4A"
              placeholderTextColor="rgba(255,255,255,0.2)"
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!submitting}
            />

            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}

            <Pressable
              style={[styles.submitBtn, (!code.trim() || submitting) && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!code.trim() || submitting}
            >
              <LinearGradient
                colors={['#c084fc', '#7c3aed', '#4c1d95']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.submitBtnGradient}
              >
                <Zap size={18} color={colors.white} />
                <Text style={styles.submitBtnText}>
                  {submitting ? 'Quantifying...' : 'Quantify Yield'}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.expiryRow}>
              <Clock size={12} color="rgba(255,255,255,0.35)" />
              <Text style={styles.expiryText}>Codes expire 30 minutes after broadcast</Text>
            </View>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.inputSection}>
          <LinearGradient
            colors={['rgba(74,222,128,0.08)', 'rgba(74,222,128,0.03)']}
            style={[styles.inputCard, styles.successCard]}
          >
            <Text style={styles.successTitle}>Reward Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Code Used</Text>
              <Text style={styles.summaryValue}>{code}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Yield Earned</Text>
              <Text style={[styles.summaryValue, styles.summaryGreen]}>+${Number(reward).toFixed(2)} USDT</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>New Balance</Text>
              <Text style={styles.summaryValue}>${Number(newBalance).toFixed(2)} USDT</Text>
            </View>

            <Pressable style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>Enter Another Code</Text>
            </Pressable>
          </LinearGradient>
        </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        {[
          'Admin broadcasts a unique trading code via notifications.',
          'You have 30 minutes to enter the code in the Trade tab.',
          'A valid code instantly earns your active VIP plan\'s daily yield.',
          'Each code can only be used once per user.',
        ].map((step, index) => (
          <View key={index} style={styles.infoRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.infoText}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 40,
    gap: 16,
  },
  subtitle: {
    marginTop: -8,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  orbWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbIdle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.3)',
  },
  orbIdleLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  orbIdleSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  orbSuccess: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.4)',
  },
  orbSuccessLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: '#bbf7d0',
  },
  orbSuccessReward: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#4ade80',
  },
  heroHint: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 12,
  },
  heroHintSuccess: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: '#86efac',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  inputSection: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  inputCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 14,
  },
  successCard: {
    borderColor: 'rgba(74,222,128,0.2)',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: colors.white,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 4,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: '#f87171',
    textAlign: 'center',
  },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  submitBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  expiryText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  // Success state
  successTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#bbf7d0',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  summaryValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  summaryGreen: {
    color: '#4ade80',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  resetBtnText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  // Info card
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  infoTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBadge: {
    width: 24, height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    marginTop: 1,
  },
  stepBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.white,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 19,
  },
});
