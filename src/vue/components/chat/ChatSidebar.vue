<script setup lang="ts">
import { MessageSquarePlus, Trash2 } from "lucide-vue-next";
import type { ChatThread } from "@/vue/lib/chat-threads";
import { formatThreadTime } from "@/vue/lib/chat-threads";
import UiButton from "@/vue/components/ui/UiButton.vue";
import { cn } from "@/vue/lib/utils";

defineProps<{
  threads: ChatThread[];
  activeThreadId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
  newChat: [];
  delete: [id: string];
}>();
</script>

<template>
  <aside
    class="flex w-full shrink-0 flex-col border-b bg-muted/30 md:w-56 md:border-b-0 md:border-r"
  >
    <div class="p-3">
      <UiButton class="w-full justify-start gap-2" @click="emit('newChat')">
        <MessageSquarePlus class="h-4 w-4" />
        New chat
      </UiButton>
    </div>

    <nav
      class="flex max-h-40 gap-2 overflow-x-auto px-2 pb-3 md:max-h-none md:flex-1 md:flex-col md:overflow-y-auto md:pb-2"
    >
      <p
        v-if="threads.length === 0"
        class="px-2 py-4 text-center text-xs text-muted-foreground md:text-left"
      >
        Chats appear here for this browser session.
      </p>

      <div
        v-for="thread in threads"
        :key="thread.id"
        class="group relative shrink-0 md:shrink"
      >
        <button
          type="button"
          :class="
            cn(
              'w-44 rounded-lg px-3 py-2 text-left text-sm transition-colors md:w-full',
              thread.id === activeThreadId
                ? 'bg-background shadow-sm ring-1 ring-border'
                : 'hover:bg-background/70'
            )
          "
          @click="emit('select', thread.id)"
        >
          <p class="truncate font-medium">{{ thread.title }}</p>
          <p class="mt-0.5 truncate text-xs text-muted-foreground">
            {{ formatThreadTime(thread.updatedAt) }}
          </p>
        </button>
        <UiButton
          type="button"
          variant="ghost"
          size="icon"
          class="absolute right-1 top-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 md:right-0.5"
          :aria-label="`Delete ${thread.title}`"
          @click.stop="emit('delete', thread.id)"
        >
          <Trash2 class="h-3.5 w-3.5 text-muted-foreground" />
        </UiButton>
      </div>
    </nav>
  </aside>
</template>
