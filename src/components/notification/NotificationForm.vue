<template>
    <div class="absolute bottom-2 right-2 bg-white border-gray-300 p-4 rounded-lg flex flex-col shadow-lg">
        <h2 class="text-lg font-bold mb-2">Notification Factory</h2>
        <form @submit.prevent="createNotification()" class="flex flex-col gap-2" name="notificationForm">
            <label class="flex items-center gap-2">
                <ToggleSwitch :checked="true" class="mb-2" id="useWebComponent" v-model="useWebComponent"></ToggleSwitch>
                <span>WebComponents</span>
            </label>

            <Select fluid :options="namespaces" v-model="namespace"></Select>
            <Select fluid :options="types" v-model="type"></Select>
            <InputText type="text" placeholder="Title" v-model="title" />
            <Textarea type="text" placeholder="Content" v-model="description"></Textarea>
            <Button type="submit">Create Notification</Button>
        </form>
    </div>
</template>
<script setup lang="ts">
import type { Notification } from '@/definitions';
import { useNotificationStore } from '@/components/notification/useNotificationStore';
import { Button, InputText, Select, Textarea, ToggleSwitch } from 'primevue';
import { ref } from 'vue';
import customNotificationStore from '@/web-components/notification/customNotificationStore';

const title = ref('');
const description = ref('');
const type = ref<Notification['type']>('info');
const namespace = ref('app');
const useWebComponent = ref(false);

const namespaces = ['app', 'phone', 'message'];
const types = ['info', 'success', 'error'];

const notificationStore = useNotificationStore();


function createNotification() {
    const newNotif = { title: title.value, description: description.value, namespace: namespace.value, type: type.value };
    if (useWebComponent.value) {
        customNotificationStore.addNotification(newNotif)
    } else {
        notificationStore.addNotification(newNotif);
    }
    title.value = '';
    description.value = '';
}
</script>
