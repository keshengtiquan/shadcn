<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">用户管理</h1>

    <TableToolbar
      search-placeholder="搜索用户..."
      :filters="statusFilters"
    />

    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
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
          <template v-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
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
                暂无数据
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
} from "@workspace/ui";

// ---------- types ----------
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  salary: number;
  createdAt: string;
}

// ---------- column definitions ----------
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "姓名",
    cell: ({ getValue }) => {
      return h("span", { class: "font-medium" }, getValue() as string);
    },
  },
  {
    accessorKey: "email",
    header: "邮箱",
    cell: ({ getValue }) => {
      return h("span", { class: "text-muted-foreground" }, getValue() as string);
    },
  },
  {
    accessorKey: "role",
    header: "角色",
    cell: ({ getValue }) => {
      const role = getValue() as string;
      const cls = roleBadgeClass(role);
      return h("span", { class: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}` }, role);
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return h("span", { class: `inline-flex items-center gap-1.5 text-sm ${statusClass(status)}` }, [
        h("span", { class: `inline-block size-1.5 rounded-full ${statusDotClass(status)}` }),
        status,
      ]);
    },
  },
  {
    accessorKey: "department",
    header: "部门",
  },
  {
    accessorKey: "salary",
    header: "薪资",
    cell: ({ getValue }) => {
      return h("span", { class: "tabular-nums" }, `¥${(getValue() as number).toLocaleString("zh-CN")}`);
    },
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
  },
];

// ---------- mock data ----------
const data: User[] = [
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "管理员", status: "在线", department: "技术部", salary: 18000, createdAt: "2025-01-15" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "编辑", status: "在线", department: "内容部", salary: 12000, createdAt: "2025-02-20" },
  { id: 3, name: "王五", email: "wangwu@example.com", role: "访客", status: "离线", department: "市场部", salary: 9000, createdAt: "2025-03-10" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "管理员", status: "在线", department: "技术部", salary: 20000, createdAt: "2025-04-05" },
  { id: 5, name: "孙七", email: "sunqi@example.com", role: "编辑", status: "忙碌", department: "设计部", salary: 13000, createdAt: "2025-05-18" },
  { id: 6, name: "周八", email: "zhouba@example.com", role: "访客", status: "离线", department: "人事部", salary: 8500, createdAt: "2025-06-22" },
  { id: 7, name: "吴九", email: "wujiu@example.com", role: "管理员", status: "在线", department: "技术部", salary: 22000, createdAt: "2025-07-30" },
  { id: 8, name: "郑十", email: "zhengshi@example.com", role: "编辑", status: "忙碌", department: "内容部", salary: 11000, createdAt: "2025-08-14" },
];

// ---------- table instance ----------
const table = useVueTable({
  get data() {
    return data;
  },
  get columns() {
    return columns;
  },
  getCoreRowModel: getCoreRowModel(),
});

// ---------- toolbar filters ----------
const statusFilters = [
  {
    title: "角色",
    options: [
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "访客", value: "guest" },
    ],
  },
  {
    title: "状态",
    options: [
      { label: "在线", value: "online" },
      { label: "离线", value: "offline" },
      { label: "忙碌", value: "busy" },
    ],
  },
];

// ---------- helpers ----------
function roleBadgeClass(role: string): string {
  const map: Record<string, string> = {
    "管理员": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    "编辑": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    "访客": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return map[role] ?? "";
}

function statusClass(status: string): string {
  return status === "离线" ? "text-muted-foreground" : "text-foreground";
}

function statusDotClass(status: string): string {
  const map: Record<string, string> = {
    "在线": "bg-green-500",
    "离线": "bg-gray-400",
    "忙碌": "bg-amber-500",
  };
  return map[status] ?? "bg-gray-400";
}
</script>
