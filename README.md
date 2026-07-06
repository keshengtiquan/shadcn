# Vue3 + Turborepo Monorepo

一个基于 Vue 3、TypeScript 和 Turborepo 的现代 monorepo 架构。

## 特性

- ⚡️ **Vue 3** - 使用 Composition API 和 `<script setup>` 语法
- 📦 **Turborepo** - 高性能构建系统，支持缓存和并行执行
- 🔷 **TypeScript** - 全栈类型安全
- 🎨 **Tailwind CSS** - 原子化 CSS 框架
- 🛣️ **Vue Router** - 客户端路由
- 📦 **pnpm** - 快速、节省磁盘空间的包管理器
- 🧩 **共享组件库** - 跨应用复用的 UI 组件

## 目录结构

```
.
├── apps/
│   └── web/              # Vue 3 主应用
├── packages/
│   └── ui/               # 共享 UI 组件库
├── package.json          # 根 package.json
├── pnpm-workspace.yaml   # pnpm workspace 配置
└── turbo.json            # Turborepo 配置
```

## 开始使用

### 1. 安装依赖

确保你已安装 pnpm：

```bash
npm install -g pnpm
```

然后安装项目依赖：

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

这将同时启动所有应用的开发服务器。

### 3. 构建项目

```bash
pnpm build
```

### 4. 代码检查

```bash
pnpm lint
```

### 5. 类型检查

```bash
pnpm check-types
```

### 6. 格式化代码

```bash
pnpm format
```

## 工作区配置

### 添加新应用

在 `apps/` 目录下创建新文件夹：

```bash
mkdir apps/my-new-app
cd apps/my-new-app
pnpm init
```

### 添加新包

在 `packages/` 目录下创建新文件夹：

```bash
mkdir packages/my-utils
cd packages/my-utils
pnpm init
```

### 包间依赖

在 apps/web 中引用 packages/ui：

```json
{
  "dependencies": {
    "@vue-monorepo/ui": "workspace:*"
  }
}
```

然后运行：

```bash
pnpm install
```

## 技术栈

- **Vue 3.4** - 前端框架
- **Vue Router 4** - 路由管理
- **TypeScript 5** - 类型系统
- **Vite** - 构建工具
- **Tailwind CSS** - CSS 框架
- **Turborepo** - Monorepo 构建系统
- **pnpm** - 包管理器

## 命令说明

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动所有应用的开发服务器 |
| `pnpm build` | 构建所有应用和包 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm format` | 使用 Prettier 格式化代码 |
| `pnpm check-types` | 运行 TypeScript 类型检查 |

## 许可证

MIT