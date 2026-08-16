import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NETWORKS, type NetworkId, getNetwork } from '../lib/wallet';
import { colors } from '../theme/colors';
import { ChevronDown } from 'lucide-react-native';

type NetworkPickerProps = {
  value: NetworkId;
  open: boolean;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (id: NetworkId) => void;
};

export function NetworkPicker({
  value,
  open,
  disabled = false,
  onOpenChange,
  onChange,
}: NetworkPickerProps) {
  const network = getNetwork(value);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Network</Text>
      <Pressable
        style={styles.field}
        onPress={() => {
          if (disabled) return;
          onOpenChange(!open);
        }}
      >
        <Text style={styles.value}>{network.label}</Text>
        <ChevronDown open={open} />
      </Pressable>
      {open ? (
        <View style={styles.picker}>
          {NETWORKS.map((item) => {
            const active = item.id === value;
            return (
              <Pressable
                key={item.id}
                style={[styles.item, active && styles.itemActive]}
                onPress={() => {
                  onChange(item.id);
                  onOpenChange(false);
                }}
              >
                <Text style={[styles.itemText, active && styles.itemTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    zIndex: 30,
  },
  label: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
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
  value: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 15,
    color: colors.white,
  },
  picker: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 74,
    zIndex: 40,
    elevation: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#161325',
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  itemActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  itemText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  itemTextActive: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
});
