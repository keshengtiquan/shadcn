<template>
  <div class="px-4 py-6">
    <TableToolbar searchPlaceholder="菜单名称" :filters="filters"/>
    <DataTable :columns="columns" :data="tableData"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {columns,  statuses} from "./components/columns";
import DataTable from "./components/data-table.vue";
import {Menu} from "@/api/menu/types";
import {getMenuListApi} from "@/api/menu";
import {TableToolbar} from "@workspace/ui";

export interface MenuTree extends Menu {
  children?: MenuTree[];
}

const tableData = ref<MenuTree[]>([]);
const filters = [
  {
    title: '类型',
    options: statuses,
  },
]

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

async function getData() {
  const {data} = await getMenuListApi();
  tableData.value = buildTree(data);
}

onMounted(async () => {
  await getData();
});
</script>

<style scoped></style>
