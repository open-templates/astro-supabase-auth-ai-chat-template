<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { Toaster } from "vue-sonner";
import { provideAuth } from "@/vue/composables/useAuth";
import ThemeProvider from "@/vue/components/ThemeProvider.vue";

provideAuth(useRouter());
</script>

<template>
  <ThemeProvider default-theme="system" storage-key="vite-ui-theme">
    <Toaster position="top-right" rich-colors />
    <RouterView />
  </ThemeProvider>
</template>
