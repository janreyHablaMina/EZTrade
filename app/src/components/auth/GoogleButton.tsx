import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { GoogleIcon } from '../icons/GoogleIcon';

type GoogleButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
};

export function GoogleButton({ onPress, disabled }: GoogleButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={() => {
        if (disabled) return;
        onPress?.();
      }}
    >
      <GoogleIcon />
      <Text style={styles.label}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.55)',
    backgroundColor: 'rgba(18, 8, 36, 0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pressed: {
    opacity: 0.88,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
});
