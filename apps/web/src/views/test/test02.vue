<template>
  <BasePage class="flex flex-col gap-3">
    <div class='flex flex-wrap items-end justify-between gap-2'>
      <div>
        <h2 class='text-2xl font-bold tracking-tight'>用户管理</h2>
        <p class='text-muted-foreground'>
        </p>
      </div>
    </div>

    <TableToolbar
        :table="table"
        search-placeholder="搜索用户..."
        :filters="statusFilters"
        @search="handleSearch"
        @reset="handleReset"
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
  </BasePage>
</template>

<script setup lang="ts">
import {h} from "vue";
import type {ColumnDef} from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table";

import {
  BasePage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar
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
    meta: { title: '姓名' },
    header: () => {
      return h('div', {}, '姓名')
    },
    cell: ({getValue}) => {
      return h("span", {class: "font-medium"}, getValue() as string);
    },
  },
  {
    accessorKey: "email",
    header: "邮箱",
    cell: ({getValue}) => {
      return h("span", {class: "text-muted-foreground"}, getValue() as string);
    },
    enableHiding: false
  },
  {
    accessorKey: "role",
    header: "角色",
    cell: ({getValue}) => {
      const role = getValue() as string;
      const cls = roleBadgeClass(role);
      return h("span", {class: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}, role);
    },
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({getValue}) => {
      const status = getValue() as string;
      return h("span", {class: `inline-flex items-center gap-1.5 text-sm ${statusClass(status)}`}, [
        h("span", {class: `inline-block size-1.5 rounded-full ${statusDotClass(status)}`}),
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
    cell: ({getValue}) => {
      return h("span", {class: "tabular-nums"}, `¥${(getValue() as number).toLocaleString("zh-CN")}`);
    },
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
  },
];

// ---------- mock data ----------
// 随机工具函数
const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (startYear: number, endYear: number) => {
  const year = randomNum(startYear, endYear);
  const month = String(randomNum(1, 12)).padStart(2, "0");
  const day = String(randomNum(1, 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// 随机手机号
const randomPhone = () => {
  const prefix = ["135", "138", "139", "158", "188", "177"];
  return randomPick(prefix) + randomNum(10000000, 99999999);
};

// 基础枚举数据
const namePool = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"];
const roleList: User["role"][] = ["管理员", "普通员工", "主管", "实习生"];
const statusList: User["status"][] = ["在线", "离线", "休假"];
const deptList = ["技术部", "市场部", "人事部", "财务部", "运营部", "产品部", "行政部"];
const addressList = [
  "北京市朝阳区建国路88号",
  "上海市浦东新区张江科技园",
  "广州市天河区珠江新城",
  "深圳市南山区科技园",
  "杭州市西湖区阿里园区",
  "成都市高新区天府大道",
  "西安市雁塔区软件新城"
];
const data: User[] = Array.from({ length: 100 }, (_, index) => {
  const baseName = randomPick(namePool);
  const role = randomPick(roleList);
  const dept = randomPick(deptList);
  // 分岗位设置薪资区间
  let salary = 0;
  if (role === "管理员") salary = randomNum(22000, 35000);
  else if (role === "主管") salary = randomNum(16000, 24000);
  else if (role === "普通员工") salary = randomNum(7000, 15000);
  else salary = randomNum(3000, 6000); // 实习生

  return {
    id: index + 1,
    name: `${baseName}${index + 1}`,
    email: `${baseName}${index + 1}@company.com`,
    phone: randomPhone(),
    age: randomNum(20, 48),
    role,
    status: randomPick(statusList),
    department: dept,
    salary,
    address: randomPick(addressList),
    avatar: `https://picsum.photos/id/${randomNum(10, 1000)}/64/64`,
    createdAt: randomDate(2022, 2026)
  };
});

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
    fieldName: "role",
    options: [
      {label: "管理员", value: "admin"},
      {label: "编辑", value: "editor"},
      {label: "访客", value: "guest"},
    ],
  },
  {
    title: "状态",
    fieldName: "status",
    options: [
      {label: "在线", value: "online"},
      {label: "离线", value: "offline"},
      {label: "忙碌", value: "busy"},
    ],
  },
];

// ---------- helpers ----------
function handleSearch(params: { searchValue: string } & Record<string, string[]>) {
  console.log("查询参数:", params)
}

function handleReset() {
  console.log("重置")
}

function roleBadgeClass(role: string): string {
  const map: Record<string, string> = {
    "管理员": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    "实习生": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    "普通员工": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    "主管": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
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
