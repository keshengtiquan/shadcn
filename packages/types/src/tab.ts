/**
 * Tab 类型定义
 */
export interface Tab {
  name: string;
  /** 路由路径 */
  path: string;
  /** 显示标题 */
  title: string;
  /** 图标 */
  icon?: string;
  /** 查询参数 */
  query?: Record<string, any>;
  /** 是否固定（不可关闭） */
  affixTab?: boolean;
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 固定 tab 的排序顺序 */
  affixTabOrder?: number;
  /** iframe 源地址 */
  iframeSrc?: string;
}

/** Tab 状态 */
export interface TabState {
  tabs: Tab[];
  activeTabPath: string;
}
