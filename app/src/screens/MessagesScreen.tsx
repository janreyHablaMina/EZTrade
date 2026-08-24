import { useEffect, useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Send } from '../components/Icons';
import { apiClient } from '../lib/api';
import { colors } from '../theme/colors';

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
};

type MessagesScreenProps = {
  onBack?: () => void;
  user: { id: number; first_name: string; last_name: string };
};

export function MessagesScreen({ onBack, user }: MessagesScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await apiClient.get(`/messages/${user.id}`);
      setMessages(data);
    } catch (err) {
      console.warn("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    
    setSending(true);
    const textToSend = inputText;
    setInputText('');
    
    try {
      const res = await apiClient.post('/messages', {
        sender_id: user.id,
        receiver_id: null, // Admin
        content: textToSend,
      });
      setMessages((prev) => [...prev, res.data]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error(err);
      setInputText(textToSend);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Live Support" onBack={onBack} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.purpleBright} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>How can we help?</Text>
            <Text style={styles.emptyDesc}>
              Send a message below and one of our support agents will reply shortly.
            </Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isOutgoing = msg.sender_id === user.id;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
                ]}
              >
                <Text style={[styles.messageText, !isOutgoing && styles.incomingText]}>
                  {msg.content}
                </Text>
                <Text style={[styles.timeText, !isOutgoing && styles.incomingTimeText]}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <Pressable
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={18} color="#fff" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 16,
    flexGrow: 1,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
    marginBottom: 8,
  },
  emptyDesc: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  outgoingBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.purpleBright,
    borderBottomRightRadius: 4,
  },
  incomingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardFill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: colors.white,
    lineHeight: 22,
  },
  incomingText: {
    color: colors.white,
  },
  timeText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  incomingTimeText: {
    color: 'rgba(255,255,255,0.4)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: colors.bgDeep,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: colors.white,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purpleBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
