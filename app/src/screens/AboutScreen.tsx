import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { ChevronDown } from '../components/icons/ChevronDown';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const DETAILS = [
  {
    title: 'Terms of use',
    body: 'EZTRADE is a demo trading experience. Plans, deposits, and withdraws shown here are for UI preview only and are not live financial services.',
  },
  {
    title: 'Privacy',
    body: 'Account details on this screen are mock data stored on your device. No personal information is sent to a server in this frontend build.',
  },
] as const;

type AboutScreenProps = {
  onBack?: () => void;
};

export function AboutScreen({ onBack }: AboutScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={styles.root}>
      <ScreenHeader title="About" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoGlow} />
          <BrandLogo size={86} />
          <Text style={styles.brand}>EZTRADE</Text>
          <Text style={styles.tagline}>
            Smarter trading, bigger opportunities. Grow your assets with
            AI-driven strategies.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Version</Text>
            <Text style={styles.metaValue}>1.0.0</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Build</Text>
            <Text style={styles.metaValue}>Frontend preview</Text>
          </View>
          <View style={[styles.metaRow, styles.metaLast]}>
            <Text style={styles.metaLabel}>Network</Text>
            <Text style={styles.metaValue}>USDT · TRC20 / ERC20 / BEP20</Text>
          </View>
        </View>

        <View style={styles.card}>
          {DETAILS.map((item, index) => {
            const open = openIndex === index;
            return (
              <View
                key={item.title}
                style={[
                  styles.detailItem,
                  index === DETAILS.length - 1 && styles.detailLast,
                ]}
              >
                <Pressable
                  style={styles.detailHead}
                  onPress={() => setOpenIndex(open ? null : index)}
                >
                  <Text style={styles.detailTitle}>{item.title}</Text>
                  <ChevronDown open={open} />
                </Pressable>
                {open ? <Text style={styles.detailBody}>{item.body}</Text> : null}
              </View>
            );
          })}
        </View>

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
    paddingBottom: 28,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  logoGlow: {
    position: 'absolute',
    top: 18,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
  },
  brand: {
    marginTop: 14,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 26,
    letterSpacing: 1.4,
    color: colors.white,
  },
  tagline: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.58)',
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: 'rgba(18, 16, 31, 0.92)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  metaLast: {
    borderBottomWidth: 0,
  },
  metaLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  metaValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  detailItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
  },
  detailLast: {
    borderBottomWidth: 0,
  },
  detailHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailTitle: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  detailBody: {
    marginTop: 8,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.58)',
    lineHeight: 20,
  },
  copyright: {
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.38)',
    marginTop: 4,
  },
});
