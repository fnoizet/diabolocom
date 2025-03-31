// src/stores/useNotificationStore.test.ts
import type { Notification } from '@/definitions';
import { useNotificationStore } from '../useNotificationStore';
import { describe, expect, it } from "vitest";

describe('useNotificationStore tests', () => {

  it('should initialize notifications as empty array', () => {
    const store = useNotificationStore()
    expect(store.notifications).toEqual([])
  })

  it('should add notifications to the store', () => {
    const store = useNotificationStore();
    store.addNotification({ namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    expect(store.getNotificationsByNamespace('app')).toHaveLength(1);
  });

  it('remove notification', () => {
    const store = useNotificationStore();
    store.clearNotifications();
    const newNotif = store.addNotification({ namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.removeNotification(newNotif.id);
    expect(store.getNotifications()).toHaveLength(0);
  });

  it('mark as read & get unread count', () => {
    const store = useNotificationStore();
    const notification = store.addNotification({ namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    expect(store.getUnreadCount('app')).toEqual(1);
    store.markAsRead(notification.id);
    expect(store.getUnreadCount('app')).toEqual(0);
  });

  it('get notifications by namespace', () => {
    const store = useNotificationStore();
    store.clearNotifications();
    store.addNotification({ namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.addNotification({ namespace: 'phone', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.addNotification({ namespace: 'phone', title: 'Test Notification', description: 'This is a test notification', type: 'info' });

    expect(store.getNotificationsByNamespace('app')).toHaveLength(1);
    expect(store.getNotificationsByNamespace('phone')).toHaveLength(2);
  });


  it('clear notifications', () => {
    const store = useNotificationStore();
    store.clearNotifications();
    store.addNotification({namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.addNotification({namespace: 'phone', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.addNotification({namespace: 'phone', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.clearNotifications();
    expect(store.getNotifications()).toHaveLength(0);
  });

  it('delete notification', () => {
    const store = useNotificationStore();
    store.addNotification({namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    const newNotif = store.addNotification({namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.addNotification({namespace: 'app', title: 'Test Notification', description: 'This is a test notification', type: 'info' });
    store.deleteNotification(newNotif.id);
    expect(store.getNotificationsByNamespace('app').length).toEqual(2);
  });

})