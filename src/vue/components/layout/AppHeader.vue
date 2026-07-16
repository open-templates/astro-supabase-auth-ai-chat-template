<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useApiHealth } from "@/vue/composables/useApiHealth";
import { useAuth } from "@/vue/composables/useAuth";
import ThemeToggle from "@/vue/components/ThemeToggle.vue";
import UiButton from "@/vue/components/ui/UiButton.vue";
import { cn } from "@/vue/lib/utils";
import logo from "@/assets/astro-supabase-auth-template-logo.png";

const route = useRoute();
const apiStatus = useApiHealth();
const { user, signOut } = useAuth();

const statusLabel = computed(() => {
  if (apiStatus.value === "checking") return "Checking API…";
  if (apiStatus.value === "online") return "API online";
  return "API offline";
});

const statusColor = computed(() => {
  if (apiStatus.value === "checking") return "bg-yellow-500";
  if (apiStatus.value === "online") return "bg-green-500";
  return "bg-red-500";
});

function navLinkClass(active: boolean) {
  return cn(
    "text-sm font-medium transition-colors hover:text-foreground",
    active ? "text-foreground" : "text-muted-foreground"
  );
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
      <div class="flex items-center gap-3">
        <img :src="logo" alt="" class="h-8 w-8 rounded-md object-cover" />
        <span class="font-semibold">Astro Supabase AI Chat</span>
        <nav v-if="user" class="ml-2 hidden items-center gap-4 sm:flex">
          <RouterLink to="/" :class="navLinkClass(route.path === '/')">
            Home
          </RouterLink>
          <RouterLink to="/chat" :class="navLinkClass(route.path === '/chat')">
            Chat
          </RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="flex items-center gap-2 text-sm text-muted-foreground"
          :title="statusLabel"
        >
          <span class="h-2.5 w-2.5 rounded-full" :class="statusColor" />
          <span class="hidden sm:inline">{{ statusLabel }}</span>
        </div>

        <ThemeToggle />

        <template v-if="user">
          <span class="hidden text-sm text-muted-foreground md:inline">
            {{ user.email }}
          </span>
          <UiButton variant="outline" size="sm" @click="signOut()"> Sign out </UiButton>
        </template>
      </div>
    </div>
  </header>
</template>
