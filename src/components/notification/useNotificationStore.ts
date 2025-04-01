import { useStorage } from '@vueuse/core';
import type { Notification } from '@/definitions';

export interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Notification;
  deleteNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  getUnreadCount: (namespace: string) => number;
  getNotifications: () => Notification[];
  getNotificationsByNamespace: (namespace: string) => Notification[];
  getNotification: (id: string) => Notification | undefined;
  clearNotifications: (namespace?: string) => void
}

export function useNotificationStore(): NotificationStore {
  const notifications = useStorage<Notification[]>('notifications', []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };
    notifications.value = [...notifications.value, newNotification];

    return newNotification;
  };

  const markAsRead = (id: string) => {
    notifications.value = notifications.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
  };

  const getUnreadCount = (namespace: string) => {
    return notifications.value.filter(n => n.namespace === namespace && !n.read).length;
  };

  const getNotifications = () => {
    return notifications.value;
  }

  const getNotificationsByNamespace = (namespace: string) => {
    return notifications.value.filter(n => n.namespace === namespace);
  };

  const clearNotifications = (namespace?: string) => {
    if (namespace) {
      notifications.value = notifications.value.filter(n => n.namespace !== namespace);
    } else {
      notifications.value = [];
    }
  }

  const deleteNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }

  const getNotification = (id: string): Notification | undefined => {
    return notifications.value.find(n => n.id = id);
  }

  return {
    notifications: notifications.value,
    addNotification,
    markAsRead,
    deleteNotification,
    getUnreadCount,
    getNotifications,
    getNotificationsByNamespace,
    getNotification,
    clearNotifications
  };
}