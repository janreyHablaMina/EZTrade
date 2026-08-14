import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AccordionRow } from '../components/AccordionRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const FAQS = [
  {
    q: 'How long do deposits take?',
    a: 'USDT deposits are usually credited within a few minutes after the network confirms your transaction.',
  },
  {
    q: 'What is the minimum withdraw?',
    a: 'The minimum withdraw is 10 USDT. A 1 USDT network fee is deducted from the amount you send.',
  },
  {
    q: 'When can I claim Daily Quantify?',
    a: 'You can claim once per day. The next claim unlocks 24 hours after your last successful claim.',
  },
] as const;

const TOPICS = ['Deposit', 'Withdraw', 'VIP Plan', 'Other'] as const;

type SupportScreenProps = {
  onBack?: () => void;
};

export function SupportScreen({ onBack }: SupportScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('Deposit');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const canSend = message.trim().length >= 10;

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Support" onBack={onBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Need help?</Text>
          <Text style={styles.cardHint}>
            We usually reply within a few hours. Pick a topic and send a
            message, or check the FAQs below.
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>Online · 24/7</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Topic</Text>
          <View style={styles.chips}>
            {TOPICS.map((item) => {
              const active = item === topic;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setTopic(item)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Message</Text>
          <View style={styles.messageBox}>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue..."
              placeholderTextColor="rgba(255,255,255,0.32)"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {sent ? (
            <Text style={styles.successText}>
              Message sent. We’ll get back to you about {topic.toLowerCase()}{' '}
              soon.
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>FAQs</Text>
          {FAQS.map((item, index) => (
            <AccordionRow
              key={item.q}
              title={item.q}
              body={item.a}
              open={openFaq === index}
              onToggle={() =>
                setOpenFaq(openFaq === index ? null : index)
              }
              last={index === FAQS.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Send message"
          onPress={handleSend}
          disabled={!canSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
  },
  card: {
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 24,
    padding: 18,
  },
  cardTitle: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 18,
    color: colors.white,
    marginBottom: 6,
  },
  cardHint: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  metaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  metaText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: colors.white,
  },
  sectionLabel: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.28)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderColor: colors.purpleBright,
  },
  chipText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  chipTextActive: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
  messageBox: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.22)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageInput: {
    minHeight: 100,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: colors.white,
  },
  successText: {
    marginTop: 12,
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: colors.green,
    lineHeight: 19,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
