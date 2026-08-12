import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

export type TabKey = 'home' | 'plans' | 'trade' | 'assets' | 'profile';

type BottomTabBarProps = {
  active: TabKey;
  onChange?: (tab: TabKey) => void;
};

const TABS: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'plans', label: 'Plans' },
  { key: 'trade', label: 'Trade' },
  { key: 'assets', label: 'Assets' },
  { key: 'profile', label: 'Profile' },
];

function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const stroke = active ? colors.purpleBright : 'rgba(255,255,255,0.45)';

  if (tab === 'home') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (tab === 'plans') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="7" width="16" height="12" rx="2" stroke={stroke} strokeWidth={1.8} />
        <Path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={stroke} strokeWidth={1.8} />
      </Svg>
    );
  }

  if (tab === 'trade') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M5 16V8M10 16V5M15 16v-6M20 16V9" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }

  if (tab === 'assets') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"
          stroke={stroke}
          strokeWidth={1.8}
        />
        <Path d="M4 8l2-3h12l2 3" stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" />
      </Svg>
    );
  }

  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke={stroke}
        strokeWidth={1.8}
      />
      <Path
        d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function BottomTabBar({ active, onChange }: BottomTabBarProps) {
  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            style={styles.item}
            onPress={() => onChange?.(tab.key)}
          >
            <TabIcon tab={tab.key} active={isActive} />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(8, 4, 20, 0.96)',
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
  },
  labelActive: {
    color: colors.purpleBright,
  },
});
