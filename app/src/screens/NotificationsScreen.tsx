import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Dimensions, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Gift, CreditCard, ShieldCheck, Settings } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { apiClient } from '../lib/api';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type NotificationsScreenProps = {
  user?: any;
  onBack: () => void;
};

export function NotificationsScreen({ user, onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await apiClient.get(`/notifications?user_id=${user.id}`);
      setNotifications(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications().finally(() => setLoading(false));
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await apiClient.post(`/notifications/${id}/read`);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'deposit': return <CreditCard size={20} color={colors.green} />;
      case 'promotion':
      case 'vip': return <Gift size={20} color="#9b5cff" />;
      case 'security': return <ShieldCheck size={20} color="#ffaa00" />;
      case 'system': return <Settings size={20} color="#a1a1aa" />;
      default: return <Bell size={20} color={colors.white} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.white} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#9b5cff" style={{ marginTop: 40 }} />
        ) : notifications.length === 0 ? (
          <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 40, fontFamily: 'Outfit_400Regular' }}>No notifications yet.</Text>
        ) : (
          notifications.map((notif) => (
            <Pressable key={notif.id} onPress={() => { 
              setSelectedNotification(notif);
              if (!notif.is_read) handleMarkAsRead(notif.id); 
            }}>
              <LinearGradient
                colors={notif.is_read ? ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)'] : ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.notificationCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: notif.is_read ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)' }]}>
                  {getIcon(notif.type)}
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, !notif.is_read && styles.unreadTitle]}>{notif.title}</Text>
                    <Text style={styles.time}>{new Date(notif.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.message}>{notif.message}</Text>
                </View>
              </LinearGradient>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Detailed View Modal */}
      <Modal
        visible={!!selectedNotification}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNotification(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedNotification(null)} />
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1c1c2e', '#131320']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <View style={[styles.modalIconContainer, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                  {selectedNotification && getIcon(selectedNotification.type)}
                </View>
                <Pressable onPress={() => setSelectedNotification(null)} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </Pressable>
              </View>
              
              <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
              <Text style={styles.modalTime}>{selectedNotification ? new Date(selectedNotification.created_at).toLocaleString() : ''}</Text>
              
              <ScrollView style={styles.modalMessageScroll}>
                <Text style={styles.modalMessage}>{selectedNotification?.message}</Text>
              </ScrollView>
              
              <Pressable style={styles.modalDoneButton} onPress={() => setSelectedNotification(null)}>
                <Text style={styles.modalDoneText}>Close</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  unreadTitle: {
    color: colors.white,
    fontFamily: 'Outfit_700Bold',
  },
  time: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  message: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalGradient: {
    padding: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  modalTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 22,
    color: colors.white,
    marginBottom: 8,
  },
  modalTime: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 24,
  },
  modalMessageScroll: {
    marginBottom: 24,
  },
  modalMessage: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  modalDoneButton: {
    backgroundColor: '#9b5cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalDoneText: {
    color: colors.white,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  }
});
