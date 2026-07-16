<script setup lang="ts">
import { inject } from "vue";
import { Moon, Sun } from "lucide-vue-next";
import UiButton from "@/vue/components/ui/UiButton.vue";

const themeCtx = inject<{ theme: { value: string }; setTheme: (t: "dark" | "light" | "system") => void }>("theme");

function toggleTheme() {
  if (!themeCtx) return;
  const theme = themeCtx.theme.value;
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  themeCtx.setTheme(isDark ? "light" : "dark");
}
</script>

<template>
  <UiButton
    variant="ghost"
    size="icon"
    class="relative size-8"
    aria-label="Toggle theme"
    @click="toggleTheme"
  >
    <Sun class="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    <Moon
      class="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
    />
  </UiButton>
</template>
