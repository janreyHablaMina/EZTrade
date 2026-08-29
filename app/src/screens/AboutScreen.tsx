import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { ScreenHeader } from '../components/ScreenHeader';
import { ShieldCheck, Zap, Clock, Lock, MessageCircle } from '../components/Icons';
import { colors } from '../theme/colors';

type AboutScreenProps = {
  onBack?: () => void;
};

export function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <View style={styles.root}>
      <ScreenHeader title="About EZTrade" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <BrandLogo size={70} />
          </View>
          <Text style={styles.brand}>EZTRADE</Text>
          <Text style={styles.tagline}>
            Next-generation quantitative trading platform driven by advanced AI algorithms.
          </Text>
        </View>

        {/* CORE FEATURES */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Zap size={22} color={colors.purpleBright} />
            </View>
            <Text style={styles.featureTitle}>Lightning Fast</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <ShieldCheck size={22} color={colors.green} />
            </View>
            <Text style={styles.featureTitle}>Bank-Grade Secure</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Clock size={22} color="#38bdf8" />
            </View>
            <Text style={styles.featureTitle}>24/7 Automated</Text>
          </View>
        </View>

        {/* DETAILS SECTION */}
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(124, 58, 237, 0.15)' }]}>
              <Lock size={20} color={colors.purpleBright} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.detailTitle}>Privacy & Security</Text>
              <Text style={styles.detailBody}>
                Your privacy is our priority. We employ end-to-end encryption and strict security protocols to safeguard your assets. We never share data with unauthorized third parties.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <ShieldCheck size={20} color="#38bdf8" />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.detailTitle}>Terms of Service</Text>
              <Text style={styles.detailBody}>
                By using EZTrade, you agree to our platform guidelines. Users must comply with regional regulations regarding digital asset trading.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={[styles.detailIconBox, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
              <MessageCircle size={20} color={colors.green} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.detailTitle}>24/7 Support</Text>
              <Text style={styles.detailBody}>
                Our customer support team is available 24/7 to assist you. Reach out to us through the official Telegram or WhatsApp support channels.
              </Text>
            </View>
          </View>
        </View>

        {/* SYSTEM INFO */}

        <Text style={styles.copyright}>© 2026 EZTRADE. All rights reserved.</Text>
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
    paddingBottom: 40,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    position: 'relative',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    width: 200,
    height: 150,
    borderRadius: 100,
    transform: [{ scaleX: 2 }],
    opacity: 0.5,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(15, 10, 25, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 16,
  },
  brand: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 28,
    letterSpacing: 2,
    color: colors.white,
  },
  tagline: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 4,
  },
  featureItem: {
    flex: 1,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: colors.white,
    marginBottom: 4,
  },
  detailBody: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 18,
  },
  systemCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  metaLast: {
    borderBottomWidth: 0,
  },
  metaLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  metaValue: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.white,
  },
  copyright: {
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 8,
  },
});
