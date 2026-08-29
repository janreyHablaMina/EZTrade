import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { NetworkId } from '../lib/wallet';

type NetworkTabsProps = {
  networks: { id: string; label: string }[];
  selectedId: NetworkId;
  onSelect: (id: NetworkId) => void;
  disabled?: boolean;
};

export function NetworkTabs({ networks, selectedId, onSelect, disabled = false }: NetworkTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.networkTabs}>
      {networks.map((net) => {
        const isSelected = selectedId === net.id;
        return (
          <Pressable
            key={net.id}
            disabled={disabled}
            onPress={() => onSelect(net.id as NetworkId)}
            style={[
              styles.networkTab,
              isSelected && styles.networkTabSelected,
              disabled && { opacity: 0.5 }
            ]}
          >
            <Text style={[
              styles.networkTabText,
              isSelected && styles.networkTabTextSelected
            ]}>
              {net.label.split(' ')[0]} {/* e.g. TRC20 */}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  networkTabs: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20, // allow scrolling past
    marginBottom: 28,
  },
  networkTab: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  networkTabSelected: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: colors.purpleBright,
  },
  networkTabText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  networkTabTextSelected: {
    color: colors.purpleBright,
  },
});
