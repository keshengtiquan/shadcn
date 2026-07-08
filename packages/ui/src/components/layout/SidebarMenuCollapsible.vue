<template>
  <Collapsible asChild v-model:open="isOpen">
    <SidebarMenuItem>
      <CollapsibleTrigger asChild class="py-5">
        <SidebarMenuButton :tooltip="item.title">
          <div
            class="flex items-center w-full"
            :style="{
              paddingLeft: `${props.level * 8}px`,
            }"
          >
            <Icon v-if="item.icon" :name="item.icon" />
            <span class="ml-2">{{ item.title }}</span>
            <NavBadge v-if="item.badge">{{ item.badge }}</NavBadge>
            <ChevronRight
              :size="16"
              class="ms-auto text-sm transition-transform duration-200"
              :class="{ 'rotate-90': isOpen }"
            />
          </div>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent class="CollapsibleContent">
        <SidebarMenuSub class="mx-0 px-0 border-none translate-x-0">
          <template v-for="subItem in item.children" :key="subItem.path">
            <!-- 有子菜单：递归渲染嵌套 Collapsible -->
            <SidebarMenuCollapsible
              v-if="subItem.children && subItem.children.length > 0"
              :item="subItem"
              :level="props.level + 2"
            />
            <!-- 无子菜单：普通链接 -->
            <SidebarMenuSubItem v-else>
              <SidebarMenuSubButton
                as="a"
                :isActive="checkIsActive(subItem.path)"
                class="py-5 cursor-pointer"
                :style="{
                  paddingLeft: `${(props.level + 4) * 6}px`,
                }"
                @click="handleMenuClick(subItem)"
              >
                <Icon v-if="subItem.icon" :name="subItem.icon" />
                <span>{{ subItem.title }}</span>
                <NavBadge v-if="subItem.badge">{{ subItem.badge }}</NavBadge>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </template>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
</template>

<script setup lang="ts">
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "../sidebar";
import type { MenuItem } from "@workspace/types";
import { ChevronRight } from "@lucide/vue";
import NavBadge from "./NavBadge.vue";
import { Icon } from "../icon";
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useTabbarStore } from "@workspace/stores";

defineOptions({
  name: "SidebarMenuCollapsible",
});

interface Props {
  item: MenuItem;
  level?: number;
}
const route = useRoute();
const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

const isOpen = ref(checkIsChildActive(props.item));

// 监听路由变化，自动展开对应的 menu
watch(
  () => route.path,
  () => {
    isOpen.value = checkIsChildActive(props.item);
  },
);

const router = useRouter();
const tabbarStore = useTabbarStore();

const handleMenuClick = (menuItem: MenuItem) => {
  // 如果配置了 hideInTab，则不添加到 tab 栏
  if (menuItem.hideInTab) {
    router.push(menuItem.path);
    return;
  }

  // 添加 tab
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

  // 切换路由
  router.push({
    path: menuItem.path,
    query: menuItem.query,
  });
};

function checkIsActive(url: string): boolean {
  return route.path === url;
}
function checkIsChildActive(item: MenuItem): boolean {
  if (!item.children || item.children.length === 0) return false;
  return item.children.some(
    (child) => checkIsActive(child.path) || checkIsChildActive(child),
  );
}
</script>

<style scoped></style>
