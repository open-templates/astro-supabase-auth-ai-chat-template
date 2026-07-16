<script setup lang="ts">
import { RouterView } from "vue-router";
import { Loader2 } from "lucide-vue-next";
import AppHeader from "@/vue/components/layout/AppHeader.vue";
import { useAuth } from "@/vue/composables/useAuth";

const { loading } = useAuth();
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <AppHeader />
    <main
      class="mx-auto w-full max-w-6xl flex-1 p-4 [&:has(.chat-full-bleed)]:max-w-none [&:has(.chat-full-bleed)]:p-0"
    >
      <div v-if="loading" class="flex h-[50vh] items-center justify-center">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>
      <RouterView v-else />
    </main>
  </div>
</template>
