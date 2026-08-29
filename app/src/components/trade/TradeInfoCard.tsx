import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function TradeInfoCard({ duration }: { duration: number }) {
  return (
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
  );
}

const styles = StyleSheet.create({
  infoCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: '#a78bfa',
  },
  infoText: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.6)',
  },
});
