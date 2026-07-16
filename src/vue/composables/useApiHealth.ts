import { onMounted, onUnmounted, ref } from "vue";
import { fetchHealth, type HealthStatus } from "@/vue/api/health";

const POLL_INTERVAL_MS = 30_000;

export function useApiHealth() {
  const status = ref<HealthStatus>("checking");
  let cancelled = false;
  let interval: ReturnType<typeof setInterval> | undefined;

  const check = async () => {
    const { data, error } = await fetchHealth();
    if (cancelled) return;
    status.value = data && !error ? "online" : "offline";
  };

  onMounted(() => {
    check();
    interval = setInterval(check, POLL_INTERVAL_MS);
  });

  onUnmounted(() => {
    cancelled = true;
    if (interval) clearInterval(interval);
  });

  return status;
}
