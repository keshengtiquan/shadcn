import { MenuTree } from "../menu-list.vue";
import { ColumnDef } from "@tanstack/vue-table";
import { Button } from "@workspace/ui";
import { Minus, Plus } from "lucide-vue-next";
import { h } from "vue";

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
  },
  {
    accessorKey: "path",
    header: "路径",
  },
  {
    accessorKey: "menuType",
    header: "类型",
  },
  {
    accessorKey: "component",
    header: "组件",

  },
  {
    accessorKey: "affixTab",
    header: "固定标签",
  },
  {
    accessorKey: "affixTabOrder",
    header: "固定标签顺序",
  },
];
