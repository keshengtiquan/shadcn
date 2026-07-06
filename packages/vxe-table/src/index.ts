import type { App } from "vue";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";
import 'vxe-pc-ui/es/style.css'
import { VxePager } from 'vxe-pc-ui'
import { VxeUI } from 'vxe-table'

/**
 * 注册 vxe-table，由 web 层传入 app 实例调用
 * 用法：setupVxeTable(app)
 */
export function setupVxeTable(app: App) {
  VxeUI.setConfig({
    grid: {
      pagerConfig: {
        background: true,
        layouts: ['PrevPage', 'Number', 'NextPage', 'Sizes', 'Total'],
        align: 'center',
      },
    }
  })
  app.use(VxePager)
  app.use(VxeUITable);
}

export { GridTable } from "./components/grid-table";
export type * from "./types";
