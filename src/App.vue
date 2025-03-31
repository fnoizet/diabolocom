<template>
  <main class="relative h-screen bg-gray-100 p-8">
    <div class="flex flex-row justify-center items-start gap-4">
      <NotificationWidget namespace="app" />
      <NotificationWidget namespace="phone" id="phone1" />
      <NotificationWidget namespace="phone" id="phone2" />
      <NotificationWidget namespace="message" />
    </div>
    <NotificationForm />
  </main>
</template>
<script setup lang="ts">
import NotificationForm from './components/NotificationForm.vue';
import NotificationWidget from './components/NotificationWidget.vue'
</script>

<style scoped></style>
