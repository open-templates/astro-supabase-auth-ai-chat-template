import {
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  type InjectionKey,
  type Ref,
} from "vue";
import type { Router } from "vue-router";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/vue/lib/supabase";
import { clearAllChatState } from "@/vue/lib/chat-threads";

export interface AuthState {
  user: Ref<User | null>;
  session: Ref<Session | null>;
  loading: Ref<boolean>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  refreshToken: () => Promise<{ data: unknown; error: Error | null }>;
}

const authKey: InjectionKey<AuthState> = Symbol("auth");

export function provideAuth(router: Router): AuthState {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);

  let subscription: { unsubscribe: () => void } | undefined;

  onMounted(() => {
    let isInitialized = false;

    const {
      data: { subscription: sub },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isInitialized) {
        isInitialized = true;
        loading.value = false;
      }

      if (nextSession) {
        user.value = nextSession.user;
        session.value = nextSession;
        localStorage.setItem("x-auth-token", nextSession.access_token);
      } else {
        user.value = null;
        session.value = null;
        localStorage.removeItem("x-auth-token");
      }
    });

    subscription = sub;
  });

  onUnmounted(() => {
    subscription?.unsubscribe();
  });

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    clearAllChatState();
    await supabase.auth.signOut();
    await router.push("/login");
  };

  const refreshToken = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (data.session) {
      localStorage.setItem("x-auth-token", data.session.access_token);
    }
    return { data, error };
  };

  const state: AuthState = {
    user,
    session,
    loading,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
    loginWithGoogle,
    refreshToken,
  };

  provide(authKey, state);
  return state;
}

export function useAuth(): AuthState {
  const auth = inject(authKey);
  if (!auth) {
    throw new Error("useAuth must be used within a component that calls provideAuth");
  }
  return auth;
}
