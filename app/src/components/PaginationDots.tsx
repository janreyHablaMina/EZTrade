import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type PaginationDotsProps = {
  total: number;
  activeIndex: number;
};

export function PaginationDots({ total, activeIndex }: PaginationDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => {
        const active = index === activeIndex;
        return (
          <View
            key={index}
            style={[styles.dot, active ? styles.dotActive : styles.dotIdle]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.purpleBright,
  },
  dotIdle: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
});
