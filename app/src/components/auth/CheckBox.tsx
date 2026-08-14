import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type CheckBoxProps = {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CheckBox({ checked, onToggle, children }: CheckBoxProps) {
  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.mark}>✓</Text> : null}
      </View>
      {typeof children === 'string' ? (
        <Text style={styles.label}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  boxChecked: {
    backgroundColor: colors.purpleBright,
    borderColor: colors.purpleBright,
  },
  mark: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 14,
  },
  label: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
});
