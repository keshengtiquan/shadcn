import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
import { MenuList } from "@/api/menu/types";
import { MenuItem } from "@workspace/types";
import { MenuTypeEnum } from "@/constants/menu";

interface RouteModuleType {
  default: RouteRecordRaw[];
}

/**
 * 合并路由
 * @param routeModules
 */
export const mergeRouteModules = (
  routeModules: Record<string, unknown>,
): RouteRecordRaw[] => {
  const mergedRoutes: RouteRecordRaw[] = [];
  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = (routeModule as RouteModuleType)?.default ?? [];
    mergedRoutes.push(...moduleRoutes);
  }
  return mergedRoutes;
};

// 菜单树节点（带 children）
export interface MenuTreeNode extends MenuList {
  children: MenuTreeNode[];
}

/**
 * 将菜单列表构建为树形结构
 */
export function buildMenuTree(list: MenuList[]): MenuTreeNode[] {
  const map = new Map<string, MenuTreeNode>();
  const roots: MenuTreeNode[] = [];
  const visited = new Set<string>();

  // 过滤无效数据和按钮类型(menuType === C)
  const validList = list.filter(
    (menu) =>
      menu != null && menu.id != null && menu.menuType !== MenuTypeEnum.C,
  );

  // 初始化所有节点，添加 children 数组
  for (const menu of validList) {
    map.set(menu.id, { ...menu, children: [] });
  }

  // 构建树
  for (const menu of validList) {
    const node = map.get(menu.id);
    if (!node) continue;

    // 检测循环引用
    if (visited.has(menu.id)) {
      roots.push(node);
      continue;
    }
    visited.add(menu.id);

    if (
      menu.parentId === "" ||
      menu.parentId === "0" ||
      menu.parentId == null
    ) {
      roots.push(node);
    } else {
      const parent = map.get(menu.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  // 按 sort 排序
  const sortNodes = (nodes: MenuTreeNode[]) => {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    nodes.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);

  return roots;
}

/**
 * 动态导入组件
 */
const dynamicImport = (component: string) => {
  const modules = import.meta.glob("../views/**/**.vue");
  let componentPath =
    component && component.startsWith("/") ? component : "/" + component;
  let relativePath = `../views${componentPath}`;
  return modules[relativePath];
};

/**
 * 将菜单树转换为路由数组
 */
function transformMenuToRoutes(menus: MenuTreeNode[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = [];

  for (const menu of menus) {
    // 跳过无效路径
    if (!menu.path) {
      continue;
    }

    const route: any = {
      name: menu.name,
      path: menu.path,
      redirect: undefined,
      meta: {
        title: menu.title || "未命名",
        icon: menu.icon,
        order: menu.order,
        keepAlive: menu.keepAlive,
        hideInMenu: !menu.hideInMenu,
        menuType: menu.menuType,
      },
    };

    // 设置组件：目录类型(F)用 Layout，菜单类型(M)用实际组件
    if (menu.menuType === MenuTypeEnum.F) {
      // 目录类型，需要 Layout 包裹
      route.component = Layout;
    } else if (menu.iframeSrc) {
      // 外链iframe类型，使用 Iframe 组件
      route.component = () =>
        import("@workspace/ui").then((m) => ({
          default: m.Iframe,
        }));
      route.meta.iframeSrc = menu.iframeSrc;
    } else if (menu.component && menu.menuType === MenuTypeEnum.M) {
      // 菜单类型，使用实际组件
      route.component = dynamicImport(
        menu.component,
      ) as unknown as RouteRecordRaw["component"];
    }

    // 递归处理子路由
    if (menu.children && menu.children.length > 0) {
      const childRoutes = transformMenuToRoutes(menu.children);
      if (childRoutes.length > 0) {
        route.children = childRoutes;
        // 如果有子路由且没有设置 redirect，设置默认重定向
        if (!route.redirect) {
          route.redirect = `${menu.path}/${menu.children[0].path}`;
        }
      }
    }

    routes.push(route);
  }

  return routes;
}

/**
 * 从后端返回的菜单列表生成动态路由
 */
export function generateRoutesFromMenuList(
  menuList: MenuList[],
): RouteRecordRaw[] {
  if (!menuList || menuList.length === 0) {
    return [];
  }

  const tree = buildMenuTree(menuList);
  const routes = transformMenuToRoutes(tree);

  // 为根级别的叶子节点（menuType=2，有组件但parentId=0）创建Layout包裹
  const processedRoutes: RouteRecordRaw[] = [];

  for (const route of routes) {
    console.log(route);

    const menu = route.meta as any;
    // 检查是否是根级别叶子节点：有组件、有path、但没有children
    if (
      route.component &&
      !route.children &&
      menu?.menuType === MenuTypeEnum.M
    ) {
      // 为其创建一个虚拟父级路由，使用Layout包裹
      // children 的 path 设为空字符串，这样访问父级路径时会直接渲染 children
      const parentRoute: RouteRecordRaw = {
        path: route.path, // 保持原路径
        component: Layout,
        name: `${String(route.name)}-Layout`,
        redirect: "", // redirect 到空路径，配合 children 的空路径
        children: [
          {
            ...route,
            path: "", // 相对路径，相对于父级
          },
        ],
        meta: route.meta,
      };
      processedRoutes.push(parentRoute);
    } else {
      processedRoutes.push(route);
    }
  }

  return processedRoutes;
}

/**
 * 从路由配置生成菜单数据
 * @param routes - 路由配置数组
 * @param parentPath - 父级路径（用于递归）
 * @returns 菜单项数组
 */
export function generateMenuFromRoutes(
  routes: RouteRecordRaw[],
  parentPath = "",
): MenuItem[] {
  return routes
    .filter((route) => {
      // 过滤掉隐藏的路由
      return !route.meta?.hideInMenu;
    })
    .map((route) => {
      // 计算完整路径
      const fullPath =
        parentPath +
        (route.path.startsWith("/") ? route.path : `/${route.path}`);

      // 递归处理子路由
      const children = route.children?.length
        ? generateMenuFromRoutes(route.children as RouteRecordRaw[], fullPath)
        : undefined;

      return {
        name: route.name ? String(route.name) : route.path,
        title:
          (route.meta?.title as string) || (route.name as string) || route.path,
        icon: route.meta?.icon as string | undefined,
        path: fullPath,
        order: route.meta?.order as number | undefined,
        hidden: route.meta?.hideInMenu as boolean | undefined,
        children: children?.length ? children : undefined,
        affixTab: route.meta?.affixTab,
        KeepAlive: route.meta?.keepAlive,
        hideInTab: route.meta?.hideInTab,
        affixTabOrder: route.meta?.affixTabOrder,
        query: route.meta?.query,
        iframeSrc: route.meta?.iframeSrc,
      };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * 从菜单树生成菜单数据
 * @param menus - 菜单树节点数组
 * @returns 菜单项数组
 */
export function generateMenuFromMenuTree(menus: MenuTreeNode[]): MenuItem[] {
  return menus
    .filter((menu) => {
      // 过滤隐藏的菜单
      return !menu.hideInMenu;
    })
    .map((menu) => {
      // 递归处理子路由
      const children = menu.children?.length
        ? generateMenuFromMenuTree(menu.children)
        : undefined;

      return {
        name: menu.name,
        title: menu.title || menu.name,
        icon: menu.icon || undefined,
        path: menu.path,
        order: menu.order,
        hidden: menu.hideInMenu,
        children: children?.length ? children : undefined,
        affixTab: menu.affixTab,
        keepAlive: menu.keepAlive,
        hideInTab: menu.hideInTab,
        affixTabOrder: menu.affixTabOrder,
        query: menu.query || undefined,
        iframeSrc: menu.iframeSrc || undefined,
      };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
