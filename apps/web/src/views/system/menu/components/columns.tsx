import { MenuTree } from "../menu-list.vue";
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@workspace/ui";
import { Minus, Plus } from "@lucide/vue";
import { h } from "vue";

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
  },
  {
    label: 'High',
    value: 'high' as const,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
  },
]
export const statuses = [
  {
    label: 'Backlog',
    value: 'backlog' as const,
  },
  {
    label: 'Todo',
    value: 'todo' as const,
  },
  {
    label: 'In Progress',
    value: 'in progress' as const,
  },
  {
    label: 'Done',
    value: 'done' as const,
  },
  {
    label: 'Canceled',
    value: 'canceled' as const,
  },
]

export const columns: ColumnDef<MenuTree>[] = [
  {
    id: "expander",
    header: "",
    size: 50,
    cell: ({ row }) => {
      if (!row.getCanExpand()) {
        return null;
      }
      return (
        <Button
          variant="outline"
          size="icon-small"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? <Minus /> : <Plus />}
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "菜单名称",
    size: 150,
    cell: ({ row }) => {
      return h(
        "span",
        { style: { paddingLeft: `${Number(row.depth) * 20}px` } },
        row.getValue("title"),
      );
    },
  },
  {
    accessorKey: "icon",
    header: "图标",
    size: 80,
  },
  {
    accessorKey: "path",
    header: "路径",
    size: 200,
  },
  {
    accessorKey: "menuType",
    header: "类型",
    size: 100,
  },
  {
    accessorKey: "component",
    header: "组件",
    size: 200,
  },
  {
    accessorKey: "affixTab",
    header: "固定标签",
    size: 100,
  },
  {
    accessorKey: "affixTabOrder",
    header: "固定标签顺序",
    size: 120,
  },
];
