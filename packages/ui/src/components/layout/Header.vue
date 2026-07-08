<template>
  <header
    class="flex h-13 shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1 cursor-pointer" />
      <Button
        variant="ghost"
        size="icon-sm"
        class="w-7 h-7 cursor-pointer"
        @click="handleRefresh"
      >
        <RotateCw />
      </Button>
      <BreadcrumbNav />
    </div>

    <div class="flex items-center gap-2 px-4">
      <ThemeToggle />
      <FullscreenToggle />
      <UserMenu
        v-bind="userInfo"
        @profile="handleProfile"
        @logout="handleLogout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { SidebarTrigger } from "../sidebar";
import BreadcrumbNav from "./BreadcrumbNav.vue";
import ThemeToggle from "./ThemeToggle.vue";
import FullscreenToggle from "./FullscreenToggle.vue";
import UserMenu from "./UserMenu.vue";
import { Button } from "../button";
import { RotateCw } from "@lucide/vue";
import { useTabbarStore } from "@workspace/stores";
import { UserInfo } from "@workspace/types";

const tabbarStore = useTabbarStore();
const emit = defineEmits<{
  profile: [];
  logout: [];
}>();
const props = defineProps<{
  userInfo: UserInfo;
}>();
const handleRefresh = () => {
  tabbarStore.refresh();
};

const handleProfile = () => {
  // 处理个人中心点击
  emit("profile");
};

const handleLogout = () => {
  // 处理退出登录点击
  emit("logout");
};
</script>
