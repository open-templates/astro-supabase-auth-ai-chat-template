<script setup lang="ts">
import { provide, ref, watch, onMounted, type Ref } from "vue";

type Theme = "dark" | "light" | "system";

const props = withDefaults(
  defineProps<{
    defaultTheme?: Theme;
    storageKey?: string;
  }>(),
  {
    defaultTheme: "system",
    storageKey: "vite-ui-theme",
  }
);

const theme = ref<Theme>(
  (typeof localStorage !== "undefined"
    ? (localStorage.getItem(props.storageKey) as Theme | null)
    : null) || props.defaultTheme
);

function applyTheme(value: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (value === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(value);
}

function setTheme(value: Theme) {
  localStorage.setItem(props.storageKey, value);
  theme.value = value;
}

watch(theme, (value) => applyTheme(value), { immediate: true });

onMounted(() => applyTheme(theme.value));

provide<{ theme: Ref<Theme>; setTheme: (t: Theme) => void }>("theme", {
  theme,
  setTheme,
});
</script>

<template>
  <slot />
</template>
