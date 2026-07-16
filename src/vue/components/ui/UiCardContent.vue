<script setup lang="ts">
import { cn } from "@/vue/lib/utils";

defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('px-6', $props.class)">
    <slot />
  </div>
</template>
