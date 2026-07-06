import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    component: Layout,
    meta: {
      icon: "lucide:layout-dashboard",
      title: "测试",
      order: 2,
    },
    name: "Test",
    path: "/test",
    redirect: "/test/test01",
    children: [
      {
        name: "Test01",
        path: "test01",
        component: () => import("@/views/test/test01.vue"),
        meta: {
          affixTab: true,
          icon: "lucide:airplay",
          title: "test01",
          keepAlive: true,
          affixTabOrder: 3,
          order: 2,
        },
        children: [],
      },
      {
        name: "Test02",
        path: "test02",
        component: () => import("@/views/test/test02.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test02",
          keepAlive: true,
          order: 3,
          hideInMenu: false,
        },
      },
      {
        name: "Test03",
        path: "test03",
        component: () => import("@/views/test/test03.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test03",
          keepAlive: true,
          order: 4,
        },
      },
      {
        name: "Test04",
        path: "test04",
        component: () => import("@/views/test/test04.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test04",
          keepAlive: true,
          order: 5,
        },
      },
      {
        name: "Test05",
        path: "test05",
        component: () => import("@/views/test/test05.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test05",
          keepAlive: true,
          order: 6,
        },
      },
      {
        name: "Test06",
        path: "test06",
        component: () => import("@/views/test/test06.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test06",
          keepAlive: true,
          order: 7,
        },
      },
      {
        name: "Test07",
        path: "test07",
        component: () => import("@/views/test/test07.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test07",
          keepAlive: true,
          order: 8,
        },
      },
      {
        name: "Test08",
        path: "test08",
        component: () => import("@/views/test/test08.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test08",
          keepAlive: true,
          order: 9,
        },
      },
      {
        name: "Test09",
        path: "test09",
        component: () => import("@/views/test/test09.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test09",
          keepAlive: true,
          order: 10,
        },
      },
      {
        name: "Test10",
        path: "test10",
        component: () => import("@/views/test/test10.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test10",
          keepAlive: true,
          order: 11,
        },
      },
      {
        name: "Test11",
        path: "test11",
        component: () => import("@/views/test/test11.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test11",
          keepAlive: true,
          order: 12,
        },
      },
      {
        name: "Test12",
        path: "test12",
        component: () => import("@/views/test/test12.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test12",
          keepAlive: true,
          order: 13,
        },
      },
      {
        name: "Test13",
        path: "test13",
        component: () => import("@/views/test/test13.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test13",
          keepAlive: true,
          order: 14,
        },
      },
      {
        name: "Test14",
        path: "test14",
        component: () => import("@/views/test/test14.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test14",
          keepAlive: true,
          order: 15,
        },
      },
      {
        name: "Test15",
        path: "test15",
        component: () => import("@/views/test/test15.vue"),
        meta: {
          icon: "lucide:airplay",
          title: "test15",
          keepAlive: true,
          order: 16,
        },
      },
    ],
  },
];

export default routes;
