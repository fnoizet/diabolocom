<template>
    <Card class="relative flex-grow flex-1" :data-cy="id ?? namespace">
        <template #header>
            <div class="flex justify-center items-center gap-2">
                <h2 class="text-lg my-2 font-bold mb-2 uppercase">{{ namespace }}</h2><Badge :value="number"></Badge>
            </div>
        </template>
        <template #content>
            <div class="flex flex-row justify-center gap-1 mb-1 -mt-5">
                <Button icon="pi pi-check" data-cy="add-success" size="small" severity="success" @click="() => newNotif('success')"></Button>
                <Button icon="pi pi-info-circle" data-cy="add-info" size="small" severity="info" @click="() => newNotif('info')"></Button>
                <Button icon="pi pi-exclamation-circle" data-cy="add-error" size="small" severity="danger" @click="() => newNotif('error')"></Button>
            </div>
            <div class="flex flex-col gap-1">
                <Notification v-for="notif in notifications" :data="notif" :key="notif.id"></Notification>
            </div>
        </template>
    </Card>
</template>
<script setup lang="ts">
import { useNotificationStore } from '@/components/notification/useNotificationStore';
import { Badge, Button, Card } from 'primevue';
import { computed } from 'vue';
import Notification from './Notification.vue';

const { namespace } = defineProps<{
    namespace: string
    id?: string
}>();

const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.getNotificationsByNamespace(namespace));
const number = computed(() => notificationStore.getUnreadCount(namespace));

function newNotif(type: 'success' | 'info' | 'error') {
    notificationStore.addNotification({ namespace, title: 'New ' + type, description: 'A new ' + type + ' happened at ' + (new Date()).toLocaleDateString(), type });
}

</script>