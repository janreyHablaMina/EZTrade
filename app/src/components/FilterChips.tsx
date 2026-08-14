import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type FilterChipsProps<T extends string> = {
  items: readonly T[];
  value: T;
  onChange: (item: T) => void;
  wrap?: boolean;
};

export function FilterChips<T extends string>({
  items,
  value,
  onChange,
  wrap = false,
}: FilterChipsProps<T>) {
  return (
    <View style={[styles.row, wrap && styles.wrap]}>
      {items.map((item) => {
        const active = item === value;
        return (
          <Pressable
            key={item}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(item)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderColor: colors.purpleBright,
  },
  text: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  textActive: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
});
