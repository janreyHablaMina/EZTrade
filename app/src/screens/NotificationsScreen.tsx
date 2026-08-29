import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Dimensions, RefreshControl, ActivityIndicator, Modal, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Gift, CreditCard, ShieldCheck, Settings, CheckCircle } from '../components/Icons';
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

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try {
      await apiClient.post(`/notifications/read-all`, { user_id: user.id });
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

  const hasUnread = notifications.some(n => !n.is_read);

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 32 : 0 }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {hasUnread ? (
          <Pressable onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all</Text>
          </Pressable>
        ) : (
          <View style={{ width: 60 }} />
        )}
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
          <View style={styles.emptyContainer}>
            <Bell size={48} color="rgba(255,255,255,0.1)" />
            <Text style={styles.emptyTitle}>All Caught Up</Text>
            <Text style={styles.emptyText}>You don't have any notifications right now.</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <Pressable 
              key={notif.id} 
              style={({ pressed }) => [
                styles.notificationCard, 
                !notif.is_read && styles.unreadCard,
                pressed && { opacity: 0.8 }
              ]}
              onPress={() => { 
                setSelectedNotification(notif);
                if (!notif.is_read) handleMarkAsRead(notif.id); 
              }}
            >
              <View style={[styles.iconContainer, !notif.is_read && styles.unreadIconContainer]}>
                {getIcon(notif.type)}
              </View>
              
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, !notif.is_read && styles.unreadTitle]} numberOfLines={1}>{notif.title}</Text>
                  <Text style={styles.time}>{new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                </View>
                <Text style={[styles.message, !notif.is_read && styles.unreadMessage]} numberOfLines={2}>{notif.message}</Text>
              </View>

              {!notif.is_read && <View style={styles.unreadDot} />}
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
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                {selectedNotification && getIcon(selectedNotification.type)}
              </View>
              <Pressable onPress={() => setSelectedNotification(null)} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            
            <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
            <Text style={styles.modalTime}>
              {selectedNotification ? new Date(selectedNotification.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
            </Text>
            
            <ScrollView style={styles.modalMessageScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalMessage}>{selectedNotification?.message}</Text>
            </ScrollView>
            
            <Pressable style={styles.modalDoneButton} onPress={() => setSelectedNotification(null)}>
              <Text style={styles.modalDoneText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
  },
  markAllButton: {
    backgroundColor: 'rgba(155, 92, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  markAllText: {
    color: '#9b5cff',
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    color: colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 16,
    alignItems: 'center',
  },
  unreadCard: {
    backgroundColor: 'rgba(155, 92, 255, 0.08)',
    borderColor: 'rgba(155, 92, 255, 0.2)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadIconContainer: {
    backgroundColor: 'rgba(155, 92, 255, 0.15)',
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
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    flex: 1,
    marginRight: 8,
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
  unreadMessage: {
    color: 'rgba(255,255,255,0.7)',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9b5cff',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#131320',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    borderRadius: 100,
    backgroundColor: 'rgba(155, 92, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'Outfit_700Bold',
  },
  modalTitle: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 20,
    color: colors.white,
    marginBottom: 6,
  },
  modalTime: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 20,
  },
  modalMessageScroll: {
    marginBottom: 24,
  },
  modalMessage: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
  },
  modalDoneButton: {
    backgroundColor: '#9b5cff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalDoneText: {
    color: colors.white,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
  }
});
