import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from './Icons';
import { colors } from '../theme/colors';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  padded?: boolean;
  right?: ReactNode;
};

export function ScreenHeader({
  title,
  onBack,
  padded = true,
  right,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, padded && styles.padded]}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
        <ArrowLeft size={22} color="rgba(255,255,255,0.8)" strokeWidth={2} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {right ? <View style={styles.right}>{right}</View> : <View style={styles.spacer} />}
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
  right: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
