import type { RowData } from '@tanstack/vue-table'

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** 列在切换显示等 UI 中使用的展示标题，优先级高于 header 字符串 */
    title?: string
  }
}

export type {}
