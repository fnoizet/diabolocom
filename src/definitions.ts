export interface Notification {
    id: string;
    type: 'info' | 'success' | 'error'
    title: string;
    description: string;
    namespace: string;
    timestamp: number;
    read: boolean;
}