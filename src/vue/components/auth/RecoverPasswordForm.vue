<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";
import { useAuth } from "@/vue/composables/useAuth";
import UiButton from "@/vue/components/ui/UiButton.vue";
import UiCard from "@/vue/components/ui/UiCard.vue";
import UiCardContent from "@/vue/components/ui/UiCardContent.vue";
import UiInput from "@/vue/components/ui/UiInput.vue";
import UiLabel from "@/vue/components/ui/UiLabel.vue";
import logo from "@/assets/astro-supabase-auth-template-logo.png";

const { resetPassword, loading } = useAuth();

const email = ref("");
const isSubmitting = ref(false);
const emailSent = ref(false);

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    const { error } = await resetPassword(email.value);
    if (error) {
      toast.error(error.message || "Failed to send reset email");
    } else {
      toast.success("Reset link sent to your email");
      emailSent.value = true;
    }
  } catch {
    toast.error("An unexpected error occurred");
  } finally {
    isSubmitting.value = false;
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
              <h1 class="text-2xl font-bold">Recover password</h1>
              <p class="text-muted-foreground text-balance">
                Enter your email to receive a reset link
              </p>
            </div>

            <template v-if="!emailSent">
              <div class="grid gap-3">
                <UiLabel for="email">Email</UiLabel>
                <UiInput
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  required
                  :disabled="loading || isSubmitting"
                />
              </div>
              <UiButton type="submit" class="w-full" :disabled="loading || isSubmitting">
                <Icon v-if="isSubmitting" icon="lucide:loader-2" class="animate-spin" />
                {{ isSubmitting ? "Loading" : "Send reset link" }}
              </UiButton>
            </template>
            <p v-else class="text-center text-sm text-muted-foreground">
              Check your email for a password reset link.
            </p>

            <div class="text-center text-sm">
              <RouterLink to="/login" class="underline underline-offset-4"> Back to login </RouterLink>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img :src="logo" alt="Astro Supabase Auth Template" class="h-full w-full object-cover" />
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
