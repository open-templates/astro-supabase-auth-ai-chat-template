<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Loader2, Send } from "lucide-vue-next";
import { sendChatMessage } from "@/vue/api/chat";
import ChatSidebar from "@/vue/components/chat/ChatSidebar.vue";
import ChatMarkdown from "@/vue/components/chat/ChatMarkdown.vue";
import UiButton from "@/vue/components/ui/UiButton.vue";
import {
  createThread,
  deleteThread,
  getActiveThreadId,
  loadChatState,
  setActiveThreadId,
  titleFromMessage,
  upsertThread,
  type ChatMessage,
  type ChatThread,
} from "@/vue/lib/chat-threads";
import { cn } from "@/vue/lib/utils";

function resolveInitialThread(): ChatThread {
  const { threads, activeThreadId } = loadChatState();
  if (threads.length === 0) {
    return createThread();
  }
  const active = threads.find((t) => t.id === activeThreadId) ?? threads[0];
  setActiveThreadId(active.id);
  return active;
}

const threads = ref<ChatThread[]>(loadChatState().threads);
const activeThread = ref<ChatThread>(resolveInitialThread());
const input = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const bottomRef = ref<HTMLDivElement | null>(null);

const messages = computed(() => activeThread.value.messages);

function syncThread(thread: ChatThread) {
  upsertThread(thread);
  threads.value = loadChatState().threads;
  activeThread.value = thread;
  setActiveThreadId(thread.id);
}

watch(
  () => [messages.value.length, loading.value, activeThread.value.id] as const,
  async () => {
    await nextTick();
    bottomRef.value?.scrollIntoView({ behavior: "smooth" });
  }
);

function handleNewChat() {
  const thread = createThread();
  threads.value = loadChatState().threads;
  activeThread.value = thread;
  input.value = "";
  error.value = null;
}

function handleSelectThread(id: string) {
  const thread = threads.value.find((t) => t.id === id);
  if (!thread) return;
  setActiveThreadId(id);
  activeThread.value = thread;
  input.value = "";
  error.value = null;
}

function handleDeleteThread(id: string) {
  deleteThread(id);
  const next = loadChatState();
  threads.value = next.threads;
  if (next.threads.length === 0) {
    activeThread.value = createThread();
    threads.value = loadChatState().threads;
    return;
  }
  const activeId = getActiveThreadId();
  const thread =
    next.threads.find((t) => t.id === activeId) ?? next.threads[0];
  activeThread.value = thread;
}

async function handleSend() {
  const trimmed = input.value.trim();
  if (!trimmed || loading.value) return;

  const userMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: "user",
    content: trimmed,
  };

  const history = activeThread.value.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const withUser: ChatThread = {
    ...activeThread.value,
    title:
      activeThread.value.messages.length === 0
        ? titleFromMessage(trimmed)
        : activeThread.value.title,
    messages: [...activeThread.value.messages, userMsg],
  };

  syncThread(withUser);
  input.value = "";
  loading.value = true;
  error.value = null;

  const { data, error: apiError } = await sendChatMessage(trimmed, history);
  loading.value = false;

  if (apiError || !data) {
    error.value = apiError ?? "Failed to get a reply";
    return;
  }

  const withReply: ChatThread = {
    ...withUser,
    messages: [
      ...withUser.messages,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      },
    ],
  };

  syncThread(withReply);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    void handleSend();
  }
}
</script>

<template>
  <div class="chat-full-bleed flex h-[calc(100vh-3.5rem)] flex-col md:flex-row">
    <ChatSidebar
      :threads="threads"
      :active-thread-id="activeThread.id"
      @select="handleSelectThread"
      @new-chat="handleNewChat"
      @delete="handleDeleteThread"
    />

    <div class="flex min-h-0 flex-1 flex-col p-4">
      <div class="mb-4">
        <h1 class="text-2xl font-bold tracking-tight">AI Chat</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Each thread keeps context for follow-up messages. History is stored in
          this browser session only.
        </p>
      </div>

      <div class="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
        <div class="flex-1 space-y-4 overflow-y-auto p-4">
          <p
            v-if="messages.length === 0 && !loading"
            class="py-12 text-center text-sm text-muted-foreground"
          >
            Send a message to start this conversation.
          </p>

          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')"
          >
            <div
              :class="
                cn(
                  'max-w-[85%] rounded-lg px-4 py-2 text-sm',
                  msg.role === 'user'
                    ? 'whitespace-pre-wrap bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )
              "
            >
              <ChatMarkdown v-if="msg.role === 'assistant'" :content="msg.content" />
              <template v-else>{{ msg.content }}</template>
            </div>
          </div>

          <div v-if="loading" class="flex justify-start">
            <div
              class="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground"
            >
              <Loader2 class="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          </div>

          <div ref="bottomRef" />
        </div>

        <p v-if="error" class="border-t px-4 py-2 text-sm text-destructive">
          {{ error }}
        </p>

        <div class="flex gap-2 border-t p-4">
          <textarea
            v-model="input"
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            rows="2"
            :disabled="loading"
            class="flex min-h-[2.5rem] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            @keydown="onKeyDown"
          />
          <UiButton
            type="button"
            size="icon"
            class="shrink-0 self-end"
            :disabled="loading || !input.trim()"
            aria-label="Send message"
            @click="handleSend"
          >
            <Send class="h-4 w-4" />
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
