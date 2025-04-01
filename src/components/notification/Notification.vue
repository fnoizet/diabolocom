<template>
    <div class="notification">
        <div :class="'flex flex-row justify-between gap-1 '">
            <div :class="'flex grow-1 p-1 items-center nowrap rounded-sm '
                + (data.read ? '' : 'font-bold ')
                + cssClasses[data.type]">
                {{ data.title }}
            </div>
            <ButtonGroup>
                <Button :icon="'pi ' + (data.read ? 'pi-check' : 'pi-eye')" size="small" @click="() => { visible = !visible; notificationStore.markAsRead(data.id) }" />
                <Button icon="pi pi-trash" size="small" @click="() => { notificationStore.deleteNotification(data.id) }" />
            </ButtonGroup>
        </div>
        <div :class="'transition-all overflow-hidden ' + (visible ? 'max-h-40 opacity-100 p-2' : 'max-h-0 opacity-0 p-0')">
            {{ data.description }}
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Notification } from '@/definitions';
import { useNotificationStore } from '@/components/notification/useNotificationStore';
import { ButtonGroup, Button } from 'primevue';
import { ref } from 'vue';

defineProps<{ data: Notification }>();

const visible = ref(false);

const cssClasses = {
    'info': 'bg-blue-200 text-blue-500',
    'success': 'bg-green-200 text-green-500',
    'error': 'bg-red-200 text-red-500'
};

const notificationStore = useNotificationStore();
</script>