import { defineStore } from "pinia";
import type { Tab } from "@workspace/types";
import { startProgress, stopProgress } from "@workspace/utils";

export const useTabbarStore = defineStore("core-tabbar", {
  state: () => ({
    tabs: [] as Tab[],
    activeTabPath: "",
    renderRouteView: true,
  }),
  getters: {
    /** 获取所有 tabs */
    getTabs: (state) => state.tabs,
    /** 获取当前激活的 tab */
    getActiveTab: (state) => {
      return state.tabs.find((tab) => tab.path === state.activeTabPath);
    },
    /** 获取当前激活的 tab path */
    getActiveTabPath: (state) => state.activeTabPath,
  },
  actions: {
    /**
     * 添加 tab
     * - 如果 tab 已存在，则切换到该 tab
     * - 如果 tab 不存在，则添加新 tab
     */
    addTab(tabInfo: Tab) {
      const { path } = tabInfo;
      const existingTab = this.tabs.find((tab) => tab.path === path);

      if (existingTab) {
        // 已存在，只切换
        this.activeTabPath = path;
      } else {
        // 不存在，添加新 tab
        this.tabs.push(tabInfo);
        this.activeTabPath = path;
      }
    },

    /**
     * 设置当前激活的 tab
     */
    setActiveTab(path: string) {
      this.activeTabPath = path;
    },

    /**
     * 关闭指定 tab
     * - 固定 tab 不能被关闭
     */
    closeTab(path: string) {
      const tabIndex = this.tabs.findIndex((tab) => tab.path === path);
      if (tabIndex === -1) return;

      const tab = this.tabs[tabIndex];
      if (tab.affixTab) return; // 固定 tab 不能关闭

      // 如果关闭的是当前激活的 tab，需要切换到其他 tab
      if (this.activeTabPath === path) {
        // 优先切换到右侧的 tab
        const nextTab = this.tabs[tabIndex + 1] || this.tabs[tabIndex - 1];
        if (nextTab) {
          this.activeTabPath = nextTab.path;
        } else {
          this.activeTabPath = "";
        }
      }

      this.tabs.splice(tabIndex, 1);
    },

    /**
     * 关闭左侧 tabs
     * - 固定 tab 不会被关闭
     * - 目标 tab 本身不会被关闭
     */
    closeLeftTabs(path: string) {
      const tabIndex = this.tabs.findIndex((tab) => tab.path === path);
      if (tabIndex === -1) return;

      // 过滤掉左侧的非固定 tab
      this.tabs = this.tabs.filter((tab, index) => {
        if (index >= tabIndex) return true; // 目标 tab 及其右侧保留
        return tab.affixTab; // 左侧只保留固定 tab
      });
    },

    /**
     * 关闭右侧 tabs
     * - 固定 tab 不会被关闭
     * - 目标 tab 本身不会被关闭
     */
    closeRightTabs(path: string) {
      const tabIndex = this.tabs.findIndex((tab) => tab.path === path);
      if (tabIndex === -1) return;

      // 过滤掉右侧的非固定 tab
      this.tabs = this.tabs.filter((tab, index) => {
        if (index <= tabIndex) return true; // 目标 tab 及其左侧保留
        return tab.affixTab; // 右侧只保留固定 tab
      });
    },

    /**
     * 关闭其他 tabs（只保留目标 tab 和固定 tabs）
     */
    closeOtherTabs(path: string) {
      this.tabs = this.tabs.filter((tab) => tab.path === path || tab.affixTab);
      this.activeTabPath = path;
    },

    /**
     * 关闭所有 tabs（保留固定 tabs）
     */
    closeAll() {
      // 只保留固定 tabs
      const affixTabs = this.tabs.filter((tab) => tab.affixTab);
      this.tabs = affixTabs;

      // 如果当前激活的 tab 被关闭了，切换到第一个固定 tab
      const hasActiveTab = this.tabs.some(
        (tab) => tab.path === this.activeTabPath,
      );
      if (!hasActiveTab && this.tabs.length > 0) {
        this.activeTabPath = this.tabs[0].path;
      } else if (this.tabs.length === 0) {
        this.activeTabPath = "";
      }
    },

    /**
     * 刷新指定 tab
     * 实际实现由调用方处理，这里只触发事件
     */
    async refresh() {
      this.$state.renderRouteView = false;
      startProgress();
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.$state.renderRouteView = true;
      stopProgress();
    },

    /**
     * 重置 tab 标题
     */
    resetTabTitle(path: string, title: string) {
      const tab = this.tabs.find((tab) => tab.path === path);
      if (tab) {
        tab.title = title;
      }
    },

    /**
     * 从菜单配置初始化固定 tabs (affixTab: true)
     * 在应用启动时调用
     */
    initAffixTabs(menuItems: any[]) {
      // 清空现有 tabs
      this.tabs = [];

      // 递归查找所有 affixTab = true 的菜单项
      const findAffixTabs = (items: any[], parentPath: string = ""): Tab[] => {
        const affixTabs: Tab[] = [];

        for (const item of items) {
          const fullPath = item.path?.startsWith("/")
            ? item.path
            : parentPath
              ? `${parentPath}/${item.path}`
              : `/${item.path}`;

          if (item.affixTab && fullPath) {
            affixTabs.push({
              name: item.name,
              path: fullPath,
              title: item.title,
              icon: item.icon,
              query: item.query,
              affixTab: true,
              keepAlive: item.keepAlive ?? item.KeepAlive,
              affixTabOrder: item.affixTabOrder,
              iframeSrc: item.iframeSrc,
            });
          }

          if (item.children && item.children.length > 0) {
            affixTabs.push(...findAffixTabs(item.children, fullPath));
          }
        }

        return affixTabs;
      };

      const affixTabs = findAffixTabs(menuItems);

      // 按 affixTabOrder 排序
      affixTabs.sort((a, b) => (a.affixTabOrder || 0) - (b.affixTabOrder || 0));

      // 添加到 store
      this.tabs = affixTabs;

      // 默认激活第一个固定 tab
      if (affixTabs.length > 0) {
        this.activeTabPath = affixTabs[0].path;
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
