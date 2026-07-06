<template>
  <Layout
    :user-info="userInfo"
    :menu-items="menuItems"
    @profile="handleProfile"
    @logout="handleLogout"
  >
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Layout } from "@workspace/ui";
import { dynamicRoutes } from "@/router/routes";
import {
  buildMenuTree,
  generateMenuFromMenuTree,
  generateMenuFromRoutes,
} from "@/utils/route";
import { useAuthStore } from "@/stores/auth";
import { MenuItem, UserInfo } from "@workspace/types";

const authStore = useAuthStore();
const userInfo: UserInfo = {
  userName: authStore.nickName,
  userId: authStore.userId,
  avatar: authStore.avatar,
  email: authStore.email,
};

// 从动态路由生成菜单数据，优先使用后端返回的菜单
const menuItems = computed<MenuItem[]>(() => {
  // 如果有后端菜单数据，直接从菜单生成菜单项
  if (authStore.menuList.length > 0) {
    const tree = buildMenuTree(authStore.menuList);
    console.log(generateMenuFromMenuTree(tree))
    return generateMenuFromMenuTree(tree);
  }
  // 否则使用静态路由
  return generateMenuFromRoutes(dynamicRoutes);
});

const handleProfile = () => {
  // 处理个人中心点击
  console.log("点击个人中心");
};

const handleLogout = () => {
  authStore.logout();
  window.location.href = "/login";
};

onMounted(() => {});
</script>

<style scoped></style>
