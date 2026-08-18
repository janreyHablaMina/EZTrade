import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

type TextFieldProps = TextInputProps & {
  label: string;
  isPassword?: boolean;
  error?: string;
};

function EyeIcon({ open }: { open: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="rgba(226,214,255,0.75)"
        strokeWidth={1.8}
      />
      <Circle
        cx="12"
        cy="12"
        r="3"
        stroke="rgba(226,214,255,0.75)"
        strokeWidth={1.8}
      />
      {!open ? (
        <Path
          d="M4 4l16 16"
          stroke="rgba(226,214,255,0.75)"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      ) : null}
    </Svg>
  );
}

export function TextField({
  label,
  isPassword = false,
  error,
  style,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused, error ? styles.fieldError : undefined]}>
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry={isPassword && !visible}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setVisible((value) => !value)}
            hitSlop={10}
            style={styles.eyeButton}
          >
            <EyeIcon open={visible} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  field: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
    backgroundColor: 'rgba(18, 8, 36, 0.85)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldFocused: {
    borderColor: colors.purpleBright,
  },
  fieldError: {
    borderColor: '#f87171',
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: colors.white,
    paddingVertical: 14,
  },
  eyeButton: {
    paddingLeft: 8,
  },
  errorText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: '#f87171',
    marginTop: -4,
    marginLeft: 4,
  },
});
