<template>
  <BasePage>
    <div class="flex flex-col gap-4">
      <div class='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 class='text-2xl font-bold tracking-tight'>菜单管理</h2>
          <p class='text-muted-foreground'>
            Here's a list of your tasks for this month!
          </p>
        </div>
        <div class='flex gap-2'>
          <Button class='space-x-1' @click="createDialogOpen = true">
            <span>创建</span>
            <Plus :size='18'/>
          </Button>
        </div>
      </div>
      <TableToolbar
          :table="table"
          searchPlaceholder="菜单名称"
          :filters="filters"
          @search="handleSearch"
          @reset="handleReset"
      />
      <div class="border rounded-md">
        <Table class="table-fixed ">
          <TableHeader>
            <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
            >
              <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  :style="{ width: header.getSize() + 'px' }"
              >
                <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <template v-if="table.getExpandedRowModel().rows.length">
              <TableRow
                  v-for="row in table.getExpandedRowModel().rows"
                  :key="row.id"
                  :data-state="row.getIsSelected() ? 'selected' : undefined"
              >
                <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    :style="{ width: cell.column.getSize() + 'px' }"
                >
                  <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>

    <MenuCreateDialog v-model:open="createDialogOpen" @created="getData()" />
  </BasePage>
</template>

<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { Plus } from '@lucide/vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, TableToolbar,
  BasePage,
  Button
} from "@workspace/ui";
import {columns, statuses} from "@/views/system/menu/components/columns.tsx";
import MenuCreateDialog from "@/views/system/menu/components/MenuCreateDialog.vue";
import {onMounted, ref} from "vue";
import {Menu} from "@/api/menu/types.ts";
import {getMenuListApi} from "@/api/menu";

export interface MenuTree extends Menu {
  children?: MenuTree[];
}


const filters = [
  {
    title: '类型',
    fieldName: 'type',
    options: statuses,
  },
]

const tableData = ref<MenuTree[]>([]);

// 将扁平数据转换成树形结构
function buildTree(flatData: Menu[]): MenuTree[] {
  const map = new Map<string, MenuTree>();
  const roots: MenuTree[] = [];

  flatData.forEach((item) => {
    map.set(item.id, {...item, children: []});
  });

  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
}

const createDialogOpen = ref(false);

async function getData() {
  const {data} = await getMenuListApi();
  tableData.value = buildTree(data);
}

const table = useVueTable({
  get data() {
    return tableData.value;
  },
  get columns() {
    return columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getSubRows: (originalRow) => (originalRow as any).children || [],
  getRowCanExpand: (row) => {
    const children = (row.original as any)?.children;
    return Array.isArray(children) && children.length > 0;
  },
});

function handleSearch(params: { searchValue: string } & Record<string, string[]>) {
  console.log("查询参数:", params)
}

function handleReset() {
  console.log("重置")
}

onMounted(async () => {
  await getData()
})
</script>

<style scoped></style>
