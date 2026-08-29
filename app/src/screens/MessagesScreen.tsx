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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../components';
import { Send, Paperclip, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { apiClient } from '../lib/api';
import { API_BASE_URL } from '../lib/api';
import { colors } from '../theme/colors';

type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string | null;
  images: string[] | null;
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
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<'announcements' | 'support'>('announcements');

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const endpoint = activeTab === 'announcements' ? '/messages/global' : `/messages/${user.id}`;
      const data = await apiClient.get(endpoint);
      setMessages(data);
    } catch (err) {
      console.warn("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      if (selectedImages.length + result.assets.length > 5) {
        alert("You can only send up to 5 images per message.");
        return;
      }
      setSelectedImages((prev) => [...prev, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!inputText.trim() && selectedImages.length === 0) || sending) return;
    
    setSending(true);
    const textToSend = inputText;
    const imagesToSend = [...selectedImages];
    
    setInputText('');
    setSelectedImages([]);
    
    try {
      let res;
      if (imagesToSend.length > 0) {
        const formData = new FormData();
        formData.append('sender_id', String(user.id));
        if (textToSend.trim()) formData.append('content', textToSend);
        
        imagesToSend.forEach((img, index) => {
          const filename = img.uri.split('/').pop() || `image${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
          
          formData.append(`images[${index}]`, {
            uri: img.uri,
            name: filename,
            type,
          } as any);
        });

        // Use custom multipart/form-data fetch since axios/apiClient may override headers
        const fetchRes = await apiClient.post('/messages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        res = { data: fetchRes }; // Since apiClient already unrolls response
      } else {
        const jsonRes = await apiClient.post('/messages', {
          sender_id: user.id,
          receiver_id: null, // Admin
          content: textToSend,
        });
        res = { data: jsonRes };
      }
      
      setMessages((prev) => [...prev, res.data.data ? res.data.data : res.data]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      console.error(err);
      setInputText(textToSend);
      setSelectedImages(imagesToSend);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Messages" onBack={onBack} />

      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          <Pressable 
            style={[styles.tab, activeTab === 'announcements' && styles.activeTab]}
            onPress={() => { setLoading(true); setActiveTab('announcements'); }}
          >
            <Text style={[styles.tabText, activeTab === 'announcements' && styles.activeTabText]}>Announcements</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'support' && styles.activeTab]}
            onPress={() => { setLoading(true); setActiveTab('support'); }}
          >
            <Text style={[styles.tabText, activeTab === 'support' && styles.activeTabText]}>Live Support</Text>
          </Pressable>
        </View>
      </View>

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
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === 'announcements' 
                ? 'Check back later for important updates and announcements.' 
                : 'Send a message below and one of our support agents will reply shortly.'}
            </Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isOutgoing = msg.sender_id === user.id;
            return isOutgoing ? (
              <LinearGradient
                key={msg.id}
                colors={['#9b5cff', '#6d28d9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.messageBubble, styles.outgoingBubble]}
              >
                {msg.images && msg.images.length > 0 && (
                  <View style={[styles.imageGrid, msg.images.length > 1 ? styles.imageGridMulti : null]}>
                    {msg.images.map((img, i) => (
                      <Image 
                        key={i}
                        source={{ uri: `${API_BASE_URL.replace('/api', '')}/${img}` }}
                        style={[styles.messageImage, msg.images!.length > 1 ? styles.messageImageMulti : null]}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                )}
                {msg.content && (
                  <Text style={styles.messageText} selectable={true}>
                    {msg.content}
                  </Text>
                )}
                <Text style={styles.timeText}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </LinearGradient>
            ) : (
              <View
                key={msg.id}
                style={[styles.messageBubble, styles.incomingBubble]}
              >
                {msg.images && msg.images.length > 0 && (
                  <View style={[styles.imageGrid, msg.images.length > 1 ? styles.imageGridMulti : null]}>
                    {msg.images.map((img, i) => (
                      <Image 
                        key={i}
                        source={{ uri: `${API_BASE_URL.replace('/api', '')}/${img}` }}
                        style={[styles.messageImage, msg.images!.length > 1 ? styles.messageImageMulti : null]}
                        resizeMode="cover"
                      />
                    ))}
                  </View>
                )}
                {msg.content && (
                  <Text style={[styles.messageText, styles.incomingText]} selectable={true}>
                    {msg.content}
                  </Text>
                )}
                <Text style={[styles.timeText, styles.incomingTimeText]}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {activeTab === 'support' && (
        <View style={styles.inputContainerWrapper}>
        {selectedImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
            {selectedImages.map((img, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image source={{ uri: img.uri }} style={styles.imagePreview} />
                <Pressable style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                  <X size={12} color="#fff" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
        <View style={styles.inputContainer}>
          <Pressable style={styles.attachBtn} onPress={pickImage}>
            <Paperclip size={20} color="rgba(255,255,255,0.6)" />
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable
            style={[styles.sendBtn, (!inputText.trim() && selectedImages.length === 0) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={(!inputText.trim() && selectedImages.length === 0) || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={18} color="#fff" style={{ marginLeft: -2 }} />
            )}
          </Pressable>
        </View>
      </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    padding: 16,
    flexGrow: 1,
    gap: 12,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.purpleBright,
  },
  tabText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  activeTabText: {
    color: colors.white,
    fontFamily: 'Outfit_600SemiBold',
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
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outgoingBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  incomingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 6,
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
  inputContainerWrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  imagePreviewContainer: {
    padding: 12,
    paddingBottom: 0,
    flexDirection: 'row',
  },
  imagePreviewWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24, // safe area padding
    gap: 10,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    paddingHorizontal: 16,
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
  imageGrid: {
    marginBottom: 6,
    gap: 4,
  },
  imageGridMulti: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  messageImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  messageImageMulti: {
    width: 80,
    height: 80,
  },
});
