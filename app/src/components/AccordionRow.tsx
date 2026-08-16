import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { ChevronDown } from 'lucide-react-native';

type AccordionRowProps = {
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
  last?: boolean;
};

export function AccordionRow({
  title,
  body,
  open,
  onToggle,
  last,
}: AccordionRowProps) {
  return (
    <View style={[styles.item, last && styles.last]}>
      <Pressable style={styles.head} onPress={onToggle}>
        <Text style={styles.title}>{title}</Text>
        <ChevronDown open={open} />
      </Pressable>
      {open ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
  },
  last: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    flex: 1,
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  body: {
    marginTop: 8,
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.58)',
    lineHeight: 20,
  },
});
