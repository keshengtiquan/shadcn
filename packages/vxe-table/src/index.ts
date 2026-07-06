import type { App } from "vue";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";

/**
 * 注册 vxe-table，由 web 层传入 app 实例调用
 * 用法：setupVxeTable(app)
 */
export function setupVxeTable(app: App) {
  app.use(VxeUITable);
}

export { GridTable } from "./components/grid-table";
export type * from "./types";
