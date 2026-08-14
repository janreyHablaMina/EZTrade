import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors } from '../theme/colors';

type AmountFieldProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  onMax?: () => void;
};

export function AmountField({
  label = 'Amount',
  value,
  onChangeText,
  error,
  onMax,
  editable = true,
  ...props
}: AmountFieldProps) {
  return (
    <View>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        {onMax ? (
          <Pressable onPress={onMax} disabled={!editable}>
            <Text style={styles.maxText}>Max</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <TextInput
          {...props}
          style={styles.input}
          placeholder={props.placeholder ?? '0.00'}
          placeholderTextColor="rgba(255,255,255,0.32)"
          keyboardType="decimal-pad"
          editable={editable}
          value={value}
          onChangeText={onChangeText}
        />
        <Text style={styles.suffix}>USDT</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 8,
  },
  maxText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.purpleBright,
    marginBottom: 8,
  },
  field: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  fieldError: {
    borderColor: 'rgba(248, 113, 113, 0.7)',
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: colors.white,
    paddingVertical: 12,
  },
  suffix: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 8,
  },
  errorText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    color: '#f87171',
    marginBottom: 14,
  },
});
