<script setup lang="ts">
import { cn } from "@/vue/lib/utils";

defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('leading-none font-semibold', $props.class)">
    <slot />
  </div>
</template>
