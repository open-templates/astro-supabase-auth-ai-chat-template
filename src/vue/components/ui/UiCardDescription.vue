<script setup lang="ts">
import { cn } from "@/vue/lib/utils";

defineProps<{ class?: string }>();
</script>

<template>
  <div :class="cn('text-muted-foreground text-sm', $props.class)">
    <slot />
  </div>
</template>
