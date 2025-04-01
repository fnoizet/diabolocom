<template>
  <main class="relative h-screen bg-gray-100 p-8">
    <h2 class="text-2xl my-2">Vue Components</h2>
    <div class="flex flex-row justify-center items-start gap-4">
      <NotificationWidget namespace="app" />
      <NotificationWidget namespace="phone" id="phone1" />
      <NotificationWidget namespace="phone" id="phone2" />
      <NotificationWidget namespace="message" />
    </div>

    <h2 class="text-2xl my-2">Web Components</h2>
    <div class="flex flex-row justify-center items-start gap-4 mt-4">
      <cc-notification-widget data-namespace="app" class="grow w-1/4"/>
      <cc-notification-widget data-namespace="phone" data-id="cc-phone1" class="grow w-1/4"/>
      <cc-notification-widget data-namespace="phone" data-id="cc-phone2" class="grow w-1/4"/>
      <cc-notification-widget data-namespace="message" class="grow w-1/4"/>
    </div>

    <NotificationForm />
  </main>
</template>
<script setup lang="ts">
import NotificationForm from './components/notification/NotificationForm.vue';
import NotificationWidget from './components/notification/NotificationWidget.vue'
import '@/web-components/notification/notificationWidget';
</script>

<style scoped></style>
