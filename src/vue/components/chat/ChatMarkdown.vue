<script setup lang="ts">
import { computed } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

const props = defineProps<{
  content: string;
}>();

marked.setOptions({ gfm: true, breaks: true });

const html = computed(() => {
  const raw = marked.parse(props.content, { async: false }) as string;
  return DOMPurify.sanitize(raw);
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="chat-markdown break-words" v-html="html" />
</template>
