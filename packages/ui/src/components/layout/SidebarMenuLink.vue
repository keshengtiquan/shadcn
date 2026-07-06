<template>
  <SidebarMenuItem
    class="flex justify-center items-center"
    :class="[state === 'expanded' ? 'pr-1' : '']"
  >
    <SidebarMenuButton
      as="a"
      :isActive="checkIsActive(item.path)"
      class="cursor-pointer py-5"
      :class="[state === 'expanded' ? 'ml-1' : '']"
      @click="handleMenuClick"
    >
      <div class="flex items-center w-full">
        <Icon v-if="item.icon" :name="item.icon" />
        <span class="ml-2">{{ item.title }}</span>
        <NavBadge v-if="item.badge">{{ item.badge }}</NavBadge>
      </div>
    </SidebarMenuButton>
  </SidebarMenuItem>
</template>

<script setup lang="ts">
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from "../sidebar";
import type { MenuItem } from "@workspace/types";
import NavBadge from "./NavBadge.vue";
import { Icon } from "../icon";
import { useRoute, useRouter } from "vue-router";
import { useTabbarStore } from "@workspace/stores";
const route = useRoute();
const router = useRouter();
const tabbarStore = useTabbarStore();
const { state } = useSidebar();

interface Props {
  item: MenuItem;
}

const props = defineProps<Props>();

function checkIsActive(url: string): boolean {
  return route.path === url;
}

const handleMenuClick = () => {
  const menuItem = props.item;

  // If configured to hide in tab bar, don't add to tab bar
  if (menuItem.hideInTab) {
    router.push(menuItem.path);
    return;
  }

  // Add tab
  tabbarStore.addTab({
    name: menuItem.name,
    path: menuItem.path,
    title: menuItem.title,
    icon: menuItem.icon,
    query: menuItem.query,
    affixTab: menuItem.affixTab,
    keepAlive: menuItem.KeepAlive,
    affixTabOrder: menuItem.affixTabOrder,
    iframeSrc: menuItem.iframeSrc,
  });

  // Switch route
  router.push({
    path: menuItem.path,
    query: menuItem.query,
  });
};
</script>

<style scoped></style>
