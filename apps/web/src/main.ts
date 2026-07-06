import { createApp } from "vue";
import "@workspace/ui/base.css"; // 必须引入
import "./styles/index";
import App from "./App.vue";
import router from "./router";
import { initStores } from "@workspace/stores";
import { setupVxeTable } from "@workspace/vxe-table";

const app = createApp(App);

setupVxeTable(app);
initStores(app, {
  namespace: import.meta.env.VITE_APP_NAMESPACE,
});
app.use(router);
app.mount("#app");
