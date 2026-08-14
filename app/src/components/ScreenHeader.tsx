import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { BackIcon } from './icons/BackIcon';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  padded?: boolean;
};

export function ScreenHeader({
  title,
  onBack,
  padded = true,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, padded && styles.padded]}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
        <BackIcon />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  padded: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  spacer: {
    width: 40,
  },
});
