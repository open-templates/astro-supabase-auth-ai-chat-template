<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
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

const { signIn, loginWithGoogle, loading } = useAuth();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const isGoogleLoading = ref(false);

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    const { error } = await signIn(email.value, password.value);
    if (error) {
      toast.error(error.message || "Failed to sign in");
    } else {
      const redirect =
        typeof route.query.redirect === "string" ? route.query.redirect : "/";
      await router.replace(redirect);
    }
  } catch {
    toast.error("An unexpected error occurred");
  } finally {
    isSubmitting.value = false;
  }
}

async function handleGoogleLogin() {
  isGoogleLoading.value = true;
  try {
    const { error } = await loginWithGoogle();
    if (error) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  } catch {
    toast.error("An unexpected error occurred with Google login");
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
              <h1 class="text-2xl font-bold">Welcome back</h1>
              <p class="text-muted-foreground text-balance">
                Login to your account to continue
              </p>
            </div>
            <UiButton
              variant="outline"
              type="button"
              class="w-full cursor-pointer"
              :disabled="loading || isSubmitting || isGoogleLoading"
              @click="handleGoogleLogin"
            >
              <Icon
                v-if="isGoogleLoading"
                icon="lucide:loader-2"
                class="animate-spin"
                width="18"
              />
              <Icon v-else icon="flat-color-icons:google" width="26" />
              <span>{{ isGoogleLoading ? "Loading" : "Login with Google" }}</span>
            </UiButton>
            <AuthDivider>Or continue with email</AuthDivider>
            <div class="grid gap-3">
              <UiLabel for="email">Email</UiLabel>
              <UiInput
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Email"
                required
                :disabled="loading || isSubmitting"
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <UiLabel for="password">Password</UiLabel>
                <RouterLink
                  to="/recover-password"
                  class="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot password
                </RouterLink>
              </div>
              <UiInput
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                :disabled="loading || isSubmitting"
              />
            </div>
            <UiButton type="submit" class="w-full" :disabled="loading || isSubmitting">
              <Icon v-if="isSubmitting" icon="lucide:loader-2" class="animate-spin" />
              {{ isSubmitting ? "Loading" : "Login" }}
            </UiButton>
            <div class="text-center text-sm">
              Don't have an account?
              <RouterLink to="/signup" class="underline underline-offset-4"> Sign up </RouterLink>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            :src="logo"
            alt="Astro Supabase Auth Template"
            class="h-full w-full object-cover"
          />
        </div>
      </UiCardContent>
    </UiCard>
    <p class="text-center text-xs text-balance text-muted-foreground">
      By continuing, you agree to our Terms of service and Privacy policy.
    </p>
  </div>
</template>
