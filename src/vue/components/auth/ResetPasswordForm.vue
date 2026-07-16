<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";
import { useAuth } from "@/vue/composables/useAuth";
import UiButton from "@/vue/components/ui/UiButton.vue";
import UiCard from "@/vue/components/ui/UiCard.vue";
import UiCardContent from "@/vue/components/ui/UiCardContent.vue";
import UiInput from "@/vue/components/ui/UiInput.vue";
import UiLabel from "@/vue/components/ui/UiLabel.vue";
import logo from "@/assets/astro-supabase-auth-template-logo.png";

const { updatePassword, signOut, loading } = useAuth();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const isSubmitting = ref(false);
const passwordUpdated = ref(false);

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    toast.error("Passwords don't match");
    return;
  }

  if (password.value.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return;
  }

  isSubmitting.value = true;
  try {
    const { error } = await updatePassword(password.value);
    if (error) {
      toast.error(error.message || "Failed to update password");
    } else {
      toast.success("Password updated successfully");
      passwordUpdated.value = true;
      setTimeout(async () => {
        try {
          await signOut();
        } finally {
          await router.replace("/");
        }
      }, 2000);
    }
  } catch {
    toast.error("An unexpected error occurred");
  } finally {
    isSubmitting.value = false;
  }
}

async function handleBackToLogin() {
  try {
    await signOut();
  } finally {
    await router.replace("/");
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <UiCard class="overflow-hidden p-0">
      <UiCardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Reset password</h1>
              <p class="text-muted-foreground text-balance">Enter your new password</p>
            </div>

            <template v-if="!passwordUpdated">
              <div class="grid gap-3">
                <UiLabel for="password">New password</UiLabel>
                <UiInput
                  id="password"
                  v-model="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  :disabled="loading || isSubmitting"
                />
              </div>
              <div class="grid gap-3">
                <UiLabel for="confirmPassword">Confirm password</UiLabel>
                <UiInput
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  :disabled="loading || isSubmitting"
                />
              </div>
              <UiButton type="submit" class="w-full" :disabled="loading || isSubmitting">
                <Icon v-if="isSubmitting" icon="lucide:loader-2" class="animate-spin" />
                {{ isSubmitting ? "Loading" : "Update password" }}
              </UiButton>
            </template>
            <p v-else class="text-center text-sm text-muted-foreground">
              Password updated. Redirecting…
            </p>

            <UiButton
              v-if="passwordUpdated"
              type="button"
              variant="outline"
              class="w-full"
              @click="handleBackToLogin"
            >
              Back to login
            </UiButton>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img :src="logo" alt="Astro Supabase Auth Template" class="h-full w-full object-cover" />
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
