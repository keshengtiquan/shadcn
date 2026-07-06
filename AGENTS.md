# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目概览

这是一个基于 Vue 3 + TypeScript + Turborepo 的 monorepo 项目，使用 pnpm 作为包管理器。

## 常用命令

### 根目录命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（所有应用）
pnpm dev

# 构建所有应用和包
pnpm build

# 运行 ESLint 检查
pnpm lint

# 运行 TypeScript 类型检查
pnpm check-types

# 格式化代码
pnpm format

# 清理所有依赖
pnpm clean
```

### 应用级别命令（apps/web）

```bash
cd apps/web

# 启动开发服务器
pnpm dev

# 构建应用
pnpm build

# 预览生产构建
pnpm preview

# 运行 ESLint
pnpm lint

# 类型检查
pnpm check-types
```

## 工作区结构

```
.
├── apps/
│   └── web/              # Vue 3 主应用 (包名: @vue-monorepo/web)
├── packages/
│   ├── ui/               # 共享 UI 组件库 (包名: @workspace/ui)
│   ├── utils/            # 共享工具函数 (包名: @workspace/utils)
│   └── types/            # 共享类型定义 (包名: @workspace/types)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 包命名规范

- 应用包名: `@vue-monorepo/*`
- 共享包名: `@workspace/*`

## 技术栈

- Vue 3.5 + Composition API + `<script setup>` 语法
- Vue Router 4，支持动态路由模块加载
- TypeScript 5.8
- Vite 6 + @tailwindcss/vite
- Tailwind CSS 4
- Reka UI（shadcn-vue 组件基础）
- class-variance-authority (CVA) 用于组件变体
- lucide-vue-next 用于图标

## UI 组件开发规范

### 组件结构

组件位于 `packages/ui/src/components/`，每个组件有自己的目录：

```
packages/ui/src/components/button/
├── Button.vue           # 组件实现
└── index.ts             # 导出组件和变体
```

### 组件变体定义

使用 `class-variance-authority` 定义组件变体：

```typescript
import { cva } from "class-variance-authority";

export const buttonVariants = cva("基础样式类", {
  variants: {
    variant: {
      default: "...",
      destructive: "...",
    },
    size: {
      default: "...",
      sm: "...",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 类名合并工具

使用 `cn()` 工具函数合并 Tailwind 类名，位于 `packages/ui/src/lib/utils.ts`：

```typescript
import { cn } from "@workspace/ui/lib/utils";

// 使用
const classes = cn(
  "base-class",
  conditional && "conditional-class",
  "hover:opacity-80",
);
```

### UI 包导出

```typescript
// 导入组件
import { Button } from "@workspace/ui/components/button";

// 导入工具函数
import { cn } from "@workspace/ui/lib/utils";

// 导入全局样式
import "@workspace/ui/globals.css";
```

## 路由结构

路由配置位于 `apps/web/src/router/`：

```
router/
├── index.ts           # 路由实例创建
├── routes/
│   ├── index.ts       # 路由合并导出
│   ├── core.ts        # 核心路由
│   └── modules/       # 动态路由模块
```

### 动态路由加载

路由通过 `import.meta.glob` 自动加载 `modules` 目录下的所有路由文件：

```typescript
const dynamicRouteFiles = import.meta.glob("./modules/**/*.ts", {
  eager: true,
});
```

## 路径别名

### 应用内 (apps/web)

- `@/` → `apps/web/src/`

在 `vite.config.ts` 中配置：

```typescript
resolve: {
  alias: {
    "@": resolve(__dirname, "src"),
  },
}
```

### 工作区包

- `@workspace/ui` → `packages/ui`
- `@workspace/utils` → `packages/utils`
- `@workspace/types` → `packages/types`

## 现有组件列表

- avatar, badge, breadcrumb, button, collapsible
- dropdown-menu, icon, input, layout, separator
- sheet, sidebar, skeleton, tooltip

## 添加新组件

1. 在 `packages/ui/src/components/` 创建组件目录
2. 实现组件 Vue 文件
3. 创建 `index.ts` 导出组件和变体
4. 在 `packages/ui/src/components/index.ts` 添加导出
5. 在应用中使用 `import { Xxx } from "@workspace/ui/components/xxx"`

## 代码编写规范

### 必须使用项目 UI 组件

**写代码时需要使用 `@workspace/ui` 中的组件，不要直接使用原生 HTML 元素。**

```typescript
// ✅ 正确
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

<Button>提交</Button>
<Input v-model="value" />
```

```html
<!-- ❌ 错误 -->
<button>提交</button>
<input v-model="value" />
```

**原因**：项目维护了一套统一的 UI 组件库，包含样式、交互和主题支持。使用原生元素会导致样式不一致。
