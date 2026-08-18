import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
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
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { Key, Zap, Clock, CheckCircle } from '../components/Icons';
import { useTradeCode } from '../hooks/useTradeCode';

const useNativeDriver = Platform.OS !== 'web';

type TradeScreenProps = {
  onBack?: () => void;
  user?: any;
};

import { apiClient } from '../lib/api';

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [schedules, setSchedules] = useState<string[]>([]);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    apiClient.get('/settings/trade')
      .then(res => {
        setSchedules(res.schedules || []);
        setDuration(res.duration_minutes || 30);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let diff = 0;

      if (!schedules || schedules.length === 0) {
        // Fallback to midnight
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        diff = tomorrow.getTime() - now.getTime();
      } else {
        const sorted = [...schedules].sort();
        let nextTime = null;

        for (const t of sorted) {
          const [hour, minute] = t.split(':').map(Number);
          const target = new Date(now);
          target.setHours(hour, minute, 0, 0);
          if (target.getTime() > now.getTime()) {
            nextTime = target;
            break;
          }
        }

        if (!nextTime) {
          const [hour, minute] = sorted[0].split(':').map(Number);
          nextTime = new Date(now);
          nextTime.setDate(now.getDate() + 1);
          nextTime.setHours(hour, minute, 0, 0);
        }

        diff = nextTime.getTime() - now.getTime();
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        h: h.toString().padStart(2, '0'),
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [schedules]);

  return { timeLeft, duration };
}

export function TradeScreen({ onBack, user }: TradeScreenProps) {
  const { code, setCode, submitting, redeemed, reward, newBalance, errorMsg, handleSubmit, handleReset } = useTradeCode(user);
  const { timeLeft: countdown, duration } = useCountdown();

  const successScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (redeemed) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, useNativeDriver }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver }),
      ])
    );
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.2, duration: 500, useNativeDriver }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver }),
      ])
    );
    loop.start();
    blinkLoop.start();
    return () => {
      loop.stop();
      blinkLoop.stop();
    };
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

      {/* Hero section */}
      <View style={styles.hero}>
        {redeemed ? (
          <Animated.View style={[styles.heroSuccessState, { transform: [{ scale: successScale }] }]}>
            <CheckCircle size={56} color="#4ade80" />
            <Text style={styles.heroSuccessTitle}>Quantified!</Text>
            <Text style={styles.heroSuccessReward}>+${Number(reward).toFixed(2)}</Text>
          </Animated.View>
        ) : (
          <Animated.View style={[styles.heroIdleState, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.heroIdleSub}>Next Trade In</Text>
            
            <View style={styles.timerRow}>
              <View style={styles.timeBox}>
                <Text style={styles.timeDigit}>{countdown.h}</Text>
                <Text style={styles.timeLabel}>HRS</Text>
              </View>
              <Animated.Text style={[styles.timeColon, { opacity: blinkAnim }]}>:</Animated.Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeDigit}>{countdown.m}</Text>
                <Text style={styles.timeLabel}>MIN</Text>
              </View>
              <Animated.Text style={[styles.timeColon, { opacity: blinkAnim }]}>:</Animated.Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeDigit}>{countdown.s}</Text>
                <Text style={styles.timeLabel}>SEC</Text>
              </View>
            </View>
          </Animated.View>
        )}

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
            colors={['rgba(18, 16, 31, 0.8)', 'rgba(18, 16, 31, 0.5)']}
            style={styles.inputCard}
          >
            <View style={styles.inputHeader}>
              <Key size={18} color="rgba(167,139,250,0.8)" />
              <Text style={styles.inputLabel}>Trading Code</Text>
            </View>

            <TextInput
              style={[
                styles.textInput,
                code.length === 0 && { fontSize: 15, letterSpacing: 1, fontFamily: 'Outfit_500Medium' }
              ]}
              value={code}
              onChangeText={(t) => { setCode(t.toUpperCase()); }}
              placeholder="Enter Code"
              placeholderTextColor="rgba(255,255,255,0.3)"
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
                <Text style={styles.submitBtnText}>
                  {submitting ? 'Trading...' : 'Trade'}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.expiryRow}>
              <Clock size={12} color="rgba(255,255,255,0.35)" />
              <Text style={styles.expiryText}>Codes expire {duration} minutes after broadcast</Text>
            </View>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.inputSection}>
          <LinearGradient
            colors={['rgba(18, 16, 31, 0.8)', 'rgba(18, 16, 31, 0.5)']}
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
      <LinearGradient
        colors={['rgba(18, 16, 31, 0.8)', 'rgba(18, 16, 31, 0.5)']}
        style={styles.infoCard}
      >
        <Text style={styles.infoTitle}>How it works</Text>
        {[
          'Admin broadcasts a unique trading code via notifications.',
          `You have ${duration} minutes to enter the code in the Trade tab.`,
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
      </LinearGradient>
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
  heroIdleState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  heroIdleSub: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: colors.purpleBright,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
  },
  timeBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 12,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDigit: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    color: colors.white,
    letterSpacing: 2,
  },
  timeLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 10,
    color: colors.purpleBright,
    marginTop: 2,
    letterSpacing: 1,
  },
  timeColon: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 32,
    color: 'rgba(255,255,255,0.4)',
    paddingTop: 8,
  },
  heroSuccessState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  heroSuccessTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 40,
    color: '#bbf7d0',
  },
  heroSuccessReward: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 24,
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
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.15)',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
