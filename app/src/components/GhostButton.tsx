import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { colors } from '../theme/colors';

type GhostButtonProps = PressableProps & {
  label: string;
};

export function GhostButton({
  label,
  style,
  onPress,
  ...props
}: GhostButtonProps) {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        typeof style === 'function' ? undefined : style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.85,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  label: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 17,
    color: colors.white,
  },
});
