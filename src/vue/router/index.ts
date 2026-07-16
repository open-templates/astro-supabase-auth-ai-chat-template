import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  type Router,
} from "vue-router";
import AppLayout from "@/vue/components/layout/AppLayout.vue";
import HomeView from "@/vue/views/HomeView.vue";
import ChatView from "@/vue/views/ChatView.vue";
import LogInView from "@/vue/views/auth/LogInView.vue";
import SignUpView from "@/vue/views/auth/SignUpView.vue";
import RecoverPasswordView from "@/vue/views/auth/RecoverPasswordView.vue";
import ResetPasswordView from "@/vue/views/auth/ResetPasswordView.vue";
import { supabase } from "@/vue/lib/supabase";

const authPages = ["login", "signup", "recover-password", "reset-password"];

export function setupRouter(): Router {
  const history =
    typeof window === "undefined" ? createMemoryHistory() : createWebHistory();

  const router = createRouter({
    history,
    routes: [
      {
        path: "/",
        component: AppLayout,
        children: [
          {
            path: "",
            name: "home",
            component: HomeView,
            meta: { requireAuth: true },
          },
          {
            path: "chat",
            name: "chat",
            component: ChatView,
            meta: { requireAuth: true },
          },
          {
            path: "login",
            name: "login",
            component: LogInView,
            meta: { requireAuth: false },
          },
          {
            path: "signup",
            name: "signup",
            component: SignUpView,
            meta: { requireAuth: false },
          },
          {
            path: "recover-password",
            name: "recover-password",
            component: RecoverPasswordView,
            meta: { requireAuth: false },
          },
          {
            path: "reset-password",
            name: "reset-password",
            component: ResetPasswordView,
            meta: { requireAuth: true },
          },
          {
            path: "/:pathMatch(.*)*",
            redirect: "/",
          },
        ],
      },
    ],
  });

  router.beforeEach(async (to) => {
    if (typeof window === "undefined") {
      return true;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const requireAuth = to.meta.requireAuth === true;
    const loggedIn = !!session?.user;
    const segment = to.path.split("/")[1] ?? "";

    if (requireAuth && !loggedIn) {
      return { name: "login", query: { redirect: to.fullPath } };
    }

    if (!requireAuth && loggedIn && authPages.includes(segment)) {
      return { name: "home" };
    }

    return true;
  });

  return router;
}
