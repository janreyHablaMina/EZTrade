import React from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type MassiveAmountInputProps = {
  amount: string;
  setAmount: (val: string) => void;
  currencySuffix?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  editable?: boolean;
  onMaxPress?: () => void;
  fieldName?: string;
};

export function MassiveAmountInput({
  amount,
  setAmount,
  currencySuffix = 'USDT',
  focusedField,
  setFocusedField,
  editable = true,
  onMaxPress,
  fieldName = 'amount',
}: MassiveAmountInputProps) {
  const isFocused = focusedField === fieldName;

  return (
    <View style={[styles.massiveInputContainer, isFocused && styles.massiveInputFocused]}>
      <TextInput
        style={styles.massiveInput}
        placeholder="0.00"
        placeholderTextColor="rgba(255,255,255,0.2)"
        keyboardType="numeric"
        editable={editable}
        value={amount}
        onChangeText={setAmount}
        onFocus={() => setFocusedField(fieldName)}
        onBlur={() => setFocusedField(null)}
      />
      <View style={styles.amountAddons}>
        <Text style={styles.currencySuffix}>{currencySuffix}</Text>
        {editable && onMaxPress && (
          <Pressable onPress={onMaxPress} style={styles.maxBtn}>
            <Text style={styles.maxBtnText}>MAX</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  massiveInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  massiveInputFocused: {
    borderBottomColor: colors.purpleBright,
  },
  massiveInput: {
    flex: 1,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 48,
    color: colors.white,
    paddingVertical: 0,
    includeFontPadding: false,
    lineHeight: 56, // ensure cursor doesn't jump
  },
  amountAddons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySuffix: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  maxBtn: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  maxBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 12,
    color: colors.purpleBright,
  },
});
