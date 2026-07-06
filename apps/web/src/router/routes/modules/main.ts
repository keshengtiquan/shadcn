import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    component: Layout,
    meta: {
      icon: "lucide:layout-dashboard",
      title: "概览",
      order: 1,
    },
    name: "Main",
    path: "/main",
    redirect: "/main/dashboard",
    children: [
      {
        name: "Dashboard",
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          affixTab: true,
          icon: "lucide:airplay",
          title: "首页",
          keepAlive: true,
          affixTabOrder: 2,
          order: 2,
        },
        children: [],
      },
    ],
  },
];

export default routes;
