<template>
  <div class="flex items-center h-9.5 bg-background w-full min-w-0">
    <div
      ref="scrollContainerRef"
      class="flex-1 flex items-center overflow-x-auto scrollbar-hide min-w-0"
    >
      <ContextMenu v-for="tab in tabs" :key="tab.path">
        <ContextMenuTrigger asChild>
          <div
            :ref="(el) => setTabRef(el, tab.path)"
            :class="[
              'group flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border cursor-pointer select-none transition-colors shrink-0 mx-1 first:ml-2',
              activeTabPath === tab.path
                ? 'bg-sidebar-accent text-sidebar-accent-foreground border-border shadow-sm'
                : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-border/50',
            ]"
            @click="handleTabClick(tab)"
          >
            <Icon v-if="tab.icon" :name="tab.icon" class="size-4" />
            <span class="max-w-30 truncate">{{ tab.title }}</span>
            <button
              v-if="!tab.affixTab"
              class="ml-1 cursor-pointer rounded-sm hover:bg-muted-foreground/20 p-0.5 transition-colors"
              @click.stop="handleCloseTab(tab.path)"
            >
              <X class="size-3" />
            </button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            :disabled="activeTabPath !== tab.path"
            @click="handleRefresh()"
          >
            <RotateCcw class="size-4 mr-2" />
            刷新
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            :disabled="!canCloseCurrent(tab)"
            @click="handleCloseCurrent(tab)"
          >
            <X class="size-4 mr-2" />
            关闭
          </ContextMenuItem>
          <ContextMenuItem
            :disabled="!canCloseLeft(tab)"
            @click="handleCloseLeft(tab)"
          >
            <ArrowLeftToLine class="size-4 mr-2" />
            关闭左侧
          </ContextMenuItem>
          <ContextMenuItem
            :disabled="!canCloseRight(tab)"
            @click="handleCloseRight(tab)"
          >
            <ArrowRightToLine class="size-4 mr-2" />
            关闭右侧
          </ContextMenuItem>
          <ContextMenuItem @click="handleCloseOther(tab)">
            <PanelTopClose class="size-4 mr-2" />
            关闭其他
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem @click="handleCloseAll">
            <PanelTopClose class="size-4 mr-2" />
            关闭全部
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useTabbarStore } from "@workspace/stores";
import type { Tab } from "@workspace/types";
import { Icon } from "../icon";
import {
  X,
  RotateCcw,
  ArrowLeftToLine,
  ArrowRightToLine,
  PanelTopClose,
} from "lucide-vue-next";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../context-menu";

defineOptions({
  name: "LayoutTabs",
});

const emit = defineEmits<{
  scroll: [];
}>();

// 暴露滚动相关方法
const scrollContainerRef = ref<HTMLElement | null>(null);

// 检查是否可以向左滚动
const canScrollLeft = () => {
  if (!scrollContainerRef.value) return false;
  return scrollContainerRef.value.scrollLeft > 0;
};

// 检查是否可以向右滚动
const canScrollRight = () => {
  if (!scrollContainerRef.value) return false;
  const container = scrollContainerRef.value;
  return container.scrollLeft < container.scrollWidth - container.clientWidth;
};

// 向左滚动
const scrollLeft = () => {
  if (!scrollContainerRef.value) return;
  scrollContainerRef.value.scrollBy({ left: -200, behavior: "smooth" });
};

// 向右滚动
const scrollRight = () => {
  if (!scrollContainerRef.value) return;
  scrollContainerRef.value.scrollBy({ left: 200, behavior: "smooth" });
};

defineExpose({
  canScrollLeft,
  canScrollRight,
  scrollLeft,
  scrollRight,
});

const router = useRouter();
const tabbarStore = useTabbarStore();

// tab 元素引用
const tabRefs = ref<Map<string, HTMLElement>>(new Map());

// 滚动到激活的 tab
const scrollToActiveTab = (behavior: ScrollBehavior = "smooth") => {
  if (!activeTabPath.value || !scrollContainerRef.value) return;

  const tabEl = tabRefs.value.get(activeTabPath.value);
  if (tabEl) {
    tabEl.scrollIntoView({
      behavior,
      inline: "center",
      block: "nearest",
    });
  }
};

// 设置 tab 元素引用
const setTabRef = (el: unknown, path: string) => {
  if (el) {
    tabRefs.value.set(path, el as HTMLElement);
  }
};

// 从 store 获取数据
const tabs = computed(() => tabbarStore.getTabs);
const activeTabPath = computed(() => tabbarStore.getActiveTabPath);

// 监听激活 tab 变化，自动滚动到可视区域
watch(
  () => activeTabPath.value,
  () => {
    nextTick(() => scrollToActiveTab("smooth"));
  },
);

// 挂载后滚动到当前激活标签
onMounted(() => {
  nextTick(() => scrollToActiveTab("auto"));

  // 监听滚动事件
  if (scrollContainerRef.value) {
    scrollContainerRef.value.addEventListener("scroll", handleScroll);
  }
});

// 卸载时移除监听
onUnmounted(() => {
  if (scrollContainerRef.value) {
    scrollContainerRef.value.removeEventListener("scroll", handleScroll);
  }
});

// 滚动事件处理
const handleScroll = () => {
  emit("scroll");
};

// 右键菜单权限计算
const canCloseCurrent = (tab: Tab) => {
  return !tab.affixTab;
};

const canCloseLeft = (tab: Tab) => {
  const tabIndex = tabs.value.findIndex((t) => t.path === tab.path);
  if (tabIndex <= 0) return false;
  // 检查左侧是否有非固定 tab
  return tabs.value.slice(0, tabIndex).some((t) => !t.affixTab);
};

const canCloseRight = (tab: Tab) => {
  const tabIndex = tabs.value.findIndex((t) => t.path === tab.path);
  if (tabIndex === -1 || tabIndex >= tabs.value.length - 1) return false;
  // 检查右侧是否有非固定 tab
  return tabs.value.slice(tabIndex + 1).some((t) => !t.affixTab);
};

// 点击 tab
const handleTabClick = (tab: Tab) => {
  tabbarStore.setActiveTab(tab.path);
  router.push({
    path: tab.path,
    query: tab.query,
  });
};

// 关闭 tab
const handleCloseTab = (path: string) => {
  const tab = tabs.value.find((t) => t.path === path);
  if (tab?.affixTab) return;

  tabbarStore.closeTab(path);

  // 如果关闭的是当前激活的 tab，需要跳转到新的激活 tab
  if (tabbarStore.getActiveTabPath) {
    const activeTab = tabbarStore.getActiveTab;
    if (activeTab) {
      router.push({
        path: activeTab.path,
        query: activeTab.query,
      });
    }
  }
};

// 刷新
const handleRefresh = () => {
  tabbarStore.refresh();
};

// 关闭当前
const handleCloseCurrent = (tab: Tab) => {
  handleCloseTab(tab.path);
};

// 关闭左侧
const handleCloseLeft = (tab: Tab) => {
  tabbarStore.closeLeftTabs(tab.path);
};

// 关闭右侧
const handleCloseRight = (tab: Tab) => {
  tabbarStore.closeRightTabs(tab.path);
};

// 关闭其他
const handleCloseOther = (tab: Tab) => {
  tabbarStore.closeOtherTabs(tab.path);
  // 确保当前激活的是右键点击的 tab
  if (activeTabPath.value !== tab.path) {
    tabbarStore.setActiveTab(tab.path);
    router.push({
      path: tab.path,
      query: tab.query,
    });
  }
};

// 关闭全部
const handleCloseAll = () => {
  tabbarStore.closeAll();
  const activeTab = tabbarStore.getActiveTab;
  if (activeTab) {
    router.push({
      path: activeTab.path,
      query: activeTab.query,
    });
  }
};
</script>

<style scoped>
/* 隐藏滚动条 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
