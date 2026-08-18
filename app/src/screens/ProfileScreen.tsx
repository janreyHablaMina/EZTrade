import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  userName?: string;
  email?: string;
  planName?: string;
  onBack?: () => void;
  onLogout?: () => void;
  onOpenMenu?: (key: MenuKey) => void;
};

const MENU_ITEMS: { key: MenuKey; label: string }[] = [
  { key: 'assets', label: 'My Assets' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'plans', label: 'VIP Plans' },
  { key: 'referral', label: 'Referral Program' },
  { key: 'security', label: 'Security' },
  { key: 'support', label: 'Support' },
  { key: 'about', label: 'About' },
];

function ChevronIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MenuIcon({ type }: { type: MenuKey }) {
  const stroke = 'rgba(255,255,255,0.9)';

  if (type === 'assets') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"
          stroke={stroke}
          strokeWidth={1.7}
        />
        <Path
          d="M4 8l2-3h12l2 3"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (type === 'transactions') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M8 7h12M8 12h12M8 17h12"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Circle cx="4.5" cy="7" r="1.2" fill={stroke} />
        <Circle cx="4.5" cy="12" r="1.2" fill={stroke} />
        <Circle cx="4.5" cy="17" r="1.2" fill={stroke} />
      </Svg>
    );
  }

  if (type === 'plans') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 15.4 7.2 17.6l.9-5.3L4.3 8.6l5.3-.8L12 3z"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (type === 'referral') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Circle cx="9" cy="8" r="3" stroke={stroke} strokeWidth={1.7} />
        <Circle cx="17" cy="9" r="2.4" stroke={stroke} strokeWidth={1.7} />
        <Path
          d="M3.5 19c1.2-3 3.4-4.5 5.5-4.5S13.3 16 14.5 19"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Path
          d="M14.5 14.2c1.4-.4 2.8.1 4 1.6"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'security') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinejoin="round"
        />
        <Circle cx="12" cy="11" r="2" stroke={stroke} strokeWidth={1.5} />
        <Path
          d="M12 13v2.5"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 'support') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth={1.7} />
        <Path
          d="M9.2 9.4a2.8 2.8 0 0 1 5.4.8c0 1.6-2.7 2.1-2.7 3.6"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
        <Circle cx="12" cy="17" r="1" fill={stroke} />
      </Svg>
    );
  }

  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={stroke} strokeWidth={1.7} />
      <Path
        d="M12 10.5v5"
        stroke={stroke}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="7.8" r="1" fill={stroke} />
    </Svg>
  );
}

function LogoutIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2"
        stroke="#f87171"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M4 12h11M12 8l4 4-4 4"
        stroke="#f87171"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AvatarPortrait({ initials }: { initials: string }) {
  return (
    <LinearGradient
      colors={['#7c3aed', '#4c1d95']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.avatar}
    >
      <Text style={styles.avatarText}>{initials}</Text>
    </LinearGradient>
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
            style={[
              styles.menuRow,
              index < MENU_ITEMS.length - 1 && styles.menuRowBorder,
            ]}
            onPress={() => onOpenMenu?.(item.key)}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <MenuIcon type={item.key} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <ChevronIcon />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutBtn} onPress={() => setConfirmLogout(true)}>
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
    paddingTop: 58,
    paddingBottom: 28,
    gap: 20,
  },
  identity: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(192, 132, 252, 0.55)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  avatarText: {
    fontFamily: 'Outfit_800ExtraBold',
    color: colors.white,
    fontSize: 34,
  },
  name: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 26,
    color: colors.white,
  },
  email: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(196, 181, 253, 0.75)',
  },
  statusBadge: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statusPlan: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.purpleBright,
  },
  statusDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  statusActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  statusActiveText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.white,
  },
  menuCard: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIcon: {
    width: 28,
    alignItems: 'center',
  },
  menuLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    color: colors.white,
  },
  logoutBtn: {
    marginTop: 4,
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(248, 113, 113, 0.55)',
    backgroundColor: 'rgba(127, 29, 29, 0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 16,
    color: '#f87171',
  },
});
