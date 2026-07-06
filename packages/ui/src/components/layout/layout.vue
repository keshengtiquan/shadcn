<script setup lang="ts">
import { SidebarInset, SidebarProvider } from "../sidebar";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import type { MenuItem, UserInfo } from "@workspace/types";
import TabView from "./TabView.vue";
import { storeToRefs, useTabbarStore } from "@workspace/stores";
import { computed } from "vue";

withDefaults(
  defineProps<{
    menuItems: MenuItem[];
    userInfo: UserInfo;
  }>(),
  {
    menuItems: () => [],
  },
);
const emit = defineEmits<{
  profile: [];
  logout: [];
}>();
const useTabbar = useTabbarStore();
const { renderRouteView, tabs } = storeToRefs(useTabbar);
const cacheTab = computed(() => {
  const cacheRoute = tabs.value.filter((item) => item.keepAlive);
  return cacheRoute.map((item) => item.name);
});

const handleProfile = () => {
  // 处理个人中心点击
  emit("profile");
};

const handleLogout = () => {
  // 处理退出登录点击
  emit("logout");
};
</script>

<template>
  <SidebarProvider>
    <Sidebar :menu-items="menuItems"></Sidebar>
    <SidebarInset class="min-w-0 h-screen overflow-hidden flex flex-col">
      <Header
        :user-info="userInfo"
        @profile="handleProfile"
        @logout="handleLogout"
      />
      <TabView :menu-items="menuItems" />
      <div class="flex-1  min-h-0">
        <div class="flex flex-col h-full">
          <router-view v-slot="{ Component, route }">
            <transition name="slide-right" appear mode="out-in">
              <keep-alive :include="cacheTab">
                <component
                  :is="Component"
                  v-if="renderRouteView"
                  :key="route.path"
                />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
