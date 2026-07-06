import type { RouteRecordRaw } from "vue-router";
// import Login from "@/view/login/login.vue"
import { DEFAULT_HOME_PATH } from "@/constants/router";
import { Redirect } from "@workspace/ui";

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: "Root",
    },
    name: "Root",
    path: "/",
    redirect: DEFAULT_HOME_PATH,
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录页",
    },
  },
  {
    path: "/redirect/:path(.*)",
    name: "RedirectPath",
    component: Redirect,
  },
];

export { coreRoutes };
