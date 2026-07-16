<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";
import { useAuth } from "@/vue/composables/useAuth";
import AuthDivider from "@/vue/components/auth/AuthDivider.vue";
import UiButton from "@/vue/components/ui/UiButton.vue";
import UiCard from "@/vue/components/ui/UiCard.vue";
import UiCardContent from "@/vue/components/ui/UiCardContent.vue";
import UiInput from "@/vue/components/ui/UiInput.vue";
import UiLabel from "@/vue/components/ui/UiLabel.vue";
import logo from "@/assets/astro-supabase-auth-template-logo.png";

const { signUp, loginWithGoogle, loading } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isSubmitting = ref(false);
const isGoogleLoading = ref(false);

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    toast.error("Passwords don't match");
    return;
  }

  isSubmitting.value = true;
  try {
    const { error } = await signUp(email.value, password.value);
    if (error) {
      toast.error(error.message || "Failed to create account");
    } else {
      toast.success("Account created successfully");
      await router.push("/");
    }
  } catch {
    toast.error("An unexpected error occurred");
  } finally {
    isSubmitting.value = false;
  }
}

async function handleGoogleSignUp() {
  isGoogleLoading.value = true;
  try {
    const { error } = await loginWithGoogle();
    if (error) {
      toast.error(error.message || "Failed to sign up with Google");
    }
  } catch {
    toast.error("An unexpected error occurred with Google sign up");
  } finally {
    isGoogleLoading.value = false;
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
              <h1 class="text-2xl font-bold">Create account</h1>
              <p class="text-muted-foreground text-balance">Create your account to continue</p>
            </div>
            <UiButton
              variant="outline"
              type="button"
              class="w-full"
              :disabled="loading || isSubmitting || isGoogleLoading"
              @click="handleGoogleSignUp"
            >
              <Icon
                v-if="isGoogleLoading"
                icon="lucide:loader-2"
                class="animate-spin"
                width="18"
              />
              <Icon v-else icon="flat-color-icons:google" width="26" />
              <span>{{ isGoogleLoading ? "Loading" : "Sign up with Google" }}</span>
            </UiButton>
            <AuthDivider>Or continue with email</AuthDivider>
            <div class="grid gap-3">
              <UiLabel for="email">Email</UiLabel>
              <UiInput
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                :disabled="loading || isSubmitting"
              />
            </div>
            <div class="grid gap-3">
              <UiLabel for="password">Password</UiLabel>
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
              {{ isSubmitting ? "Loading" : "Sign up" }}
            </UiButton>
            <div class="text-center text-sm">
              Already have an account?
              <RouterLink to="/login" class="underline underline-offset-4"> Login </RouterLink>
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
