import type { Notification } from "@/definitions";

export class CustomNotificationStore {
    #notifications: Notification[] = [];
    #listeners: (() => void)[] = [];
    #storageKey = 'custom_notifications';
    static #instance: CustomNotificationStore | undefined;

    static getInstance() {
        if (this.#instance) return this.#instance;
        this.#instance = new CustomNotificationStore();
        this.#instance.loadFromStorage();
        return this.#instance;

    }

    private saveToStorage(): void {
        localStorage.setItem(this.#storageKey, JSON.stringify(this.#notifications));
        this.notifyListeners();
    }

    private loadFromStorage(): void {
        const data = localStorage.getItem(this.#storageKey);
        if (data) {
            this.#notifications = JSON.parse(data);
        }
    }

    private notifyListeners(): void {
        this.#listeners.forEach(listener => listener());
    }

    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
        const newNotification: Notification = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            read: false,
            ...notification
        };
        this.#notifications.push(newNotification);
        this.saveToStorage();
        return newNotification;
    }

    deleteNotification(id: string): void {
        this.#notifications = this.#notifications.filter(n => n.id !== id);
        this.saveToStorage();
    }

    markAsRead(id: string): void {
        const notification = this.#notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveToStorage();
        }
    }

    getUnreadCount(namespace: string): number {
        return this.#notifications.filter(n => n.namespace === namespace && !n.read).length;
    }

    getNotifications(): Notification[] {
        return [...this.#notifications];
    }

    getNotificationsByNamespace(namespace: string): Notification[] {
        return this.#notifications.filter(n => n.namespace === namespace);
    }

    getNotification(id: string): Notification | undefined {
        return this.#notifications.find(n => n.id === id);
    }

    clearNotifications(namespace?: string): void {
        if (namespace) {
            this.#notifications = this.#notifications.filter(n => n.namespace !== namespace);
        } else {
            this.#notifications = [];
        }
        this.saveToStorage();
    }

    addListener(listener: () => void): void {
        this.#listeners.push(listener);
    }

    removeListener(listener: () => void): void {
        this.#listeners = this.#listeners.filter(l => l !== listener);
    }
}

const customNotificationStore = CustomNotificationStore.getInstance();
export default customNotificationStore;
