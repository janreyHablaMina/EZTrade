import type { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BrandLogo } from '../BrandLogo';
import { NebulaBackground } from '../NebulaBackground';
import { colors } from '../../theme/colors';
import { GoogleButton } from './GoogleButton';

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  onGoogle?: () => void;
  googleDisabled?: boolean;
  footerPrompt: string;
  footerAction: string;
  onFooterPress?: () => void;
};

export function AuthScreen({
  title,
  subtitle,
  children,
  onGoogle,
  googleDisabled,
  footerPrompt,
  footerAction,
  onFooterPress,
}: AuthScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <NebulaBackground />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoGlow} />
            <BrandLogo size={78} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.form}>{children}</View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton onPress={onGoogle} disabled={googleDisabled} />

          <Pressable style={styles.footer} onPress={onFooterPress}>
            <Text style={styles.footerText}>
              {footerPrompt}{' '}
              <Text style={styles.footerAction}>{footerAction}</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    zIndex: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGlow: {
    position: 'absolute',
    top: -8,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  title: {
    marginTop: 18,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 30,
    color: colors.white,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: 'rgba(226, 214, 255, 0.7)',
  },
  form: {
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(226, 214, 255, 0.55)',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 28,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
  },
  footerAction: {
    fontFamily: 'Outfit_700Bold',
    color: colors.purpleBright,
  },
});
