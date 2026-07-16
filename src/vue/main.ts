import type { App } from "vue";
import { setupRouter } from "./router";

export default (app: App) => {
  app.use(setupRouter());
};
