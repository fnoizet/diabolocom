export interface Notification {
    id: string;
    type: 'info' | 'success' | 'error'
    title: string;
    description: string;
    namespace: string;
    timestamp: number;
    read: boolean;
}

export interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Notification;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    deleteNotification: (id: string) => void;
    getUnreadCount: (namespace: string) => number;
    getNotifications: () => Notification[];
    getNotificationsByNamespace: (namespace: string) => Notification[];
    clearNotifications: (namespace?: string) => void
}