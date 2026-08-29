import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Platform, Animated } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { ConfirmModal } from '../components/ConfirmModal';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';
import { useHomeStats } from '../hooks/useHomeStats';
import { AnimatedLoading } from '../components/AnimatedLoading';

type MenuKey =
  | 'assets'
  | 'transactions'
  | 'plans'
  | 'referral'
  | 'security'
  | 'support'
  | 'about';

type ProfileScreenProps = {
  user?: any;
  userName?: string;
  email?: string;
  planName?: string;
  onBack?: () => void;
  onLogout?: () => void;
  onOpenMenu?: (key: MenuKey) => void;
};

const MENU_ITEMS: { key: MenuKey; label: string; colors: string[] }[] = [
  { key: 'assets', label: 'My Assets', colors: ['#3b82f6', '#1d4ed8'] },
  { key: 'transactions', label: 'Transactions', colors: ['#10b981', '#047857'] },
  { key: 'plans', label: 'VIP Plans', colors: ['#a855f7', '#7e22ce'] },
  { key: 'referral', label: 'Referral Program', colors: ['#f59e0b', '#b45309'] },
  { key: 'security', label: 'Security', colors: ['#ef4444', '#b91c1c'] },
  { key: 'support', label: 'Support', colors: ['#6366f1', '#4338ca'] },
  { key: 'about', label: 'About', colors: ['#6b7280', '#374151'] },
];

function ChevronIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MenuIcon({ type }: { type: MenuKey }) {
  const stroke = '#ffffff';

  if (type === 'assets') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" stroke={stroke} strokeWidth={2} />
        <Path d="M4 8l2-3h12l2 3" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'transactions') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M8 7h12M8 12h12M8 17h12" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        <Circle cx="4.5" cy="7" r="1.5" fill={stroke} />
        <Circle cx="4.5" cy="12" r="1.5" fill={stroke} />
        <Circle cx="4.5" cy="17" r="1.5" fill={stroke} />
      </Svg>
    );
  }

  if (type === 'plans') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 15.4 7.2 17.6l.9-5.3L4.3 8.6l5.3-.8L12 3z" stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" />
      </Svg>
    );
  }

  if (type === 'referral') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx="9" cy="8" r="3" stroke={stroke} strokeWidth={2} />
        <Circle cx="17" cy="9" r="2.5" stroke={stroke} strokeWidth={2} />
        <Path d="M3.5 19c1.2-3 3.4-4.5 5.5-4.5S13.3 16 14.5 19" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        <Path d="M14.5 14.2c1.4-.4 2.8.1 4 1.6" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'security') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
        <Circle cx="12" cy="11" r="2" stroke={stroke} strokeWidth={1.8} />
        <Path d="M12 13v2.5" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'support') {
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth={2} />
        <Path d="M9.2 9.4a2.8 2.8 0 0 1 5.4.8c0 1.6-2.7 2.1-2.7 3.6" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
        <Circle cx="12" cy="17" r="1.5" fill={stroke} />
      </Svg>
    );
  }

  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth={2} />
      <Path d="M12 10.5v5" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="7.8" r="1.2" fill={stroke} />
    </Svg>
  );
}

function LogoutIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2-2h-7a2 2 0 0 1-2-2v-2"
        stroke="#f87171"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M4 12h11M12 8l4 4-4 4"
        stroke="#f87171"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AvatarPortrait({ initials }: { initials: string }) {
  return (
    <View style={styles.avatarWrapper}>
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.4)', 'rgba(124, 58, 237, 0)']}
        style={styles.avatarGlow}
      />
      <LinearGradient
        colors={['#7c3aed', '#4c1d95']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.avatar}
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </LinearGradient>
    </View>
  );
}

export function ProfileScreen({
  user,
  onBack,
  onLogout,
  onOpenMenu,
}: ProfileScreenProps) {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { userData, loading } = useHomeStats(user);

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <ScreenHeader title="Profile" onBack={onBack} padded={false} />
        <AnimatedLoading text="Loading Profile..." />
      </View>
    );
  }

  const userName = userData?.name || 'John Doe';
  const email = userData?.email || 'user@example.com';
  const activePlan = userData?.vip_plan;
  const planName = activePlan ? activePlan.level.toUpperCase() : 'NO VIP';
  const initials = userName
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Profile" onBack={onBack} padded={false} />

        <View style={styles.identity}>
          <AvatarPortrait initials={initials} />
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusPlan}>{planName}</Text>
            <View style={styles.statusDivider} />
            <View style={[styles.statusActive, !activePlan && { opacity: 0.5 }]}>
              <View style={[styles.statusDot, !activePlan && { backgroundColor: '#ef4444' }]} />
              <Text style={styles.statusActiveText}>{activePlan ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.menuRow,
                index < MENU_ITEMS.length - 1 && styles.menuRowBorder,
                pressed && { backgroundColor: 'rgba(255,255,255,0.03)' }
              ]}
              onPress={() => onOpenMenu?.(item.key)}
            >
              <View style={styles.menuLeft}>
                <LinearGradient
                  colors={item.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.menuIconBox}
                >
                  <MenuIcon type={item.key} />
                </LinearGradient>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <ChevronIcon />
            </Pressable>
          ))}
        </View>

        <Pressable 
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]} 
          onPress={() => setConfirmLogout(true)}
        >
          <LogoutIcon />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      <ConfirmModal
        visible={confirmLogout}
        title="Log out?"
        message="You’ll need to sign in again to see your plans, balance, and trades."
        cancelLabel="Stay"
        confirmLabel="Log out"
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          onLogout?.();
        }}
      />
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
    gap: 24,
  },
  identity: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarText: {
    fontFamily: 'Outfit_800ExtraBold',
    color: colors.white,
    fontSize: 36,
  },
  name: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 28,
    color: colors.white,
    letterSpacing: -0.5,
  },
  email: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  statusBadge: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusPlan: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 14,
    color: colors.purpleBright,
    letterSpacing: 0.5,
  },
  statusDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statusActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  statusActiveText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  menuCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuLabel: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  logoutBtn: {
    marginTop: 8,
    minHeight: 60,
    borderRadius: 20,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoutText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#ffffff',
  },
});
