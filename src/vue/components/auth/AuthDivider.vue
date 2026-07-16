<script setup lang="ts">
import { cn } from "@/vue/lib/utils";

defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="cn('relative', $props.class)">
    <div class="absolute inset-0 flex items-center" aria-hidden="true">
      <span class="w-full border-t border-border" />
    </div>
    <div class="relative flex justify-center text-sm">
      <span class="bg-card px-2 text-muted-foreground"><slot /></span>
    </div>
  </div>
</template>
