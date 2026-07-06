<template>
  <div class="flex flex-col">
    <!-- Tab 栏 -->
    <div class="flex items-center bg-background border-b">
      <!-- 左箭头 -->
      <button
        v-show="hasScroll"
        :disabled="!canScrollLeft"
        class="flex items-center cursor-pointer justify-center h-9.5 w-8 border-r hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        @click="handleScrollLeft"
      >
        <ChevronLeft class="size-4 text-muted-foreground" />
      </button>

      <Tabs ref="tabsRef" class="flex-1" @scroll="updateArrowVisibility" />

      <!-- 右箭头 -->
      <button
        v-show="hasScroll"
        :disabled="!canScrollRight"
        class="flex items-center cursor-pointer justify-center h-9.5 w-8 border-l hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        @click="handleScrollRight"
      >
        <ChevronRight class="size-4 text-muted-foreground" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useTabbarStore } from "@workspace/stores";
import type { MenuItem } from "@workspace/types";
import Tabs from "./Tabs.vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineOptions({
  name: "LayoutTabView",
});

interface Props {
  menuItems?: MenuItem[];
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [],
});

const tabbarStore = useTabbarStore();
const route = useRoute();
const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);
const hasScroll = ref(false);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

/**
 * 根据路径递归查找菜单项
 */
const findMenuItemByPath = (items: MenuItem[], targetPath: string): MenuItem | null => {
  for (const item of items) {
    const fullPath = item.path?.startsWith("/")
      ? item.path
      : item.path
        ? `/${item.path}`
        : "";

    if (fullPath === targetPath) {
      return item;
    }

    if (item.children && item.children.length > 0) {
      const found = findMenuItemByPath(item.children, targetPath);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 同步路由状态到 tab 状态
 * - 根据当前路由查找对应的菜单项
 * - 如果存在则添加/激活该 tab
 */
const syncRouteToTab = (path: string) => {
  if (!props.menuItems.length) return;

  const menuItem = findMenuItemByPath(props.menuItems, path);
  if (menuItem) {
    tabbarStore.addTab({
      name: menuItem.name,
      path: path,
      title: menuItem.title,
      icon: menuItem.icon,
      query: menuItem.query,
      affixTab: menuItem.affixTab,
      keepAlive: menuItem.KeepAlive,
      affixTabOrder: menuItem.affixTabOrder,
      iframeSrc: menuItem.iframeSrc,
    });
  } else {
    // 如果找不到对应菜单项，直接设置激活路径
    tabbarStore.setActiveTab(path);
  }
};

// 监听 tabs 变化，更新箭头状态
watch(
  () => tabbarStore.getTabs,
  () => {
    nextTick(() => updateArrowVisibility());
  },
  { deep: true },
);

// 更新箭头显示状态
const updateArrowVisibility = () => {
  if (!tabsRef.value) return;
  const canLeft = tabsRef.value.canScrollLeft?.() ?? false;
  const canRight = tabsRef.value.canScrollRight?.() ?? false;

  // 只要有可滚动方向就显示按钮
  hasScroll.value = canLeft || canRight;
  // 更新各方向状态
  canScrollLeft.value = canLeft;
  canScrollRight.value = canRight;
};

// 处理向左滚动
const handleScrollLeft = () => {
  tabsRef.value?.scrollLeft?.();
  // 滚动动画完成后更新箭头状态
  setTimeout(updateArrowVisibility, 300);
};

// 处理向右滚动
const handleScrollRight = () => {
  tabsRef.value?.scrollRight?.();
  // 滚动动画完成后更新箭头状态
  setTimeout(updateArrowVisibility, 300);
};

// 监听路由变化，同步更新 tab 状态
watch(
  () => route.path,
  (newPath) => {
    if (newPath) {
      syncRouteToTab(newPath);
    }
  },
  { immediate: true },
);

// 监听 menuItems 变化，初始化固定 tabs
watch(
  () => props.menuItems,
  (newMenuItems) => {
    if (newMenuItems.length > 0 && tabbarStore.getTabs.length === 0) {
      tabbarStore.initAffixTabs(newMenuItems);
      // 初始化后同步当前路由到 tab
      if (route.path) {
        syncRouteToTab(route.path);
      }
    }
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  // 如果 store 中没有 tabs，初始化固定 tabs
  if (tabbarStore.getTabs.length === 0 && props.menuItems.length > 0) {
    tabbarStore.initAffixTabs(props.menuItems);
    // 初始化后同步当前路由到 tab
    if (route.path) {
      syncRouteToTab(route.path);
    }
  } else {
    // store 中已有 tabs，只同步当前路由到 tab
    syncRouteToTab(route.path);
  }
  // 初始化箭头显示状态
  nextTick(() => {
    updateArrowVisibility();
  });
});
</script>

<style scoped></style>
