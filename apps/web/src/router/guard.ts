import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { generateRoutesFromMenuList } from "@/utils/route";
import { getMenuListApi } from "@/api/menu";

/** 不需要登录即可访问的路由路径 */
const whiteList: string[] = ["/login"];

/**
 * 加载并添加动态路由
 */
async function loadDynamicRoutes(
  router: Router,
  authStore: ReturnType<typeof useAuthStore>,
) {
  // 如果没有 menuList，先获取菜单
  if (authStore.menuList.length === 0) {
    const { data } = await getMenuListApi();
    authStore.menuList = data;
  }

  // 生成并添加动态路由
  const dynamicRoutes = generateRoutesFromMenuList(authStore.menuList);
  dynamicRoutes.forEach((route) => {
    router.addRoute(route);
  });

  authStore.setRoutesLoaded();
}

/**
 * @zh_CN 路由守卫 - 检查用户是否已登录
 */
const setupAccessGuard = (router: Router) => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const authStore = useAuthStore();

      const hasToken =
        !!authStore.token &&
        typeof authStore.token === "string" &&
        authStore.token.length > 0;

      // 如果目标路由在白名单中，直接放行
      if (whiteList.includes(to.path)) {
        next();
        return;
      }

      // 没有 token，重定向到登录页
      if (!hasToken) {
        next({ name: "Login", query: { redirect: to.fullPath } });
        return;
      }

      // 登录后首次加载动态路由
      if (!authStore.hasLoadedDynamicRoutes) {
        await loadDynamicRoutes(router, authStore);
        next({ path: to.fullPath, replace: true });
        return;
      }

      next();
    },
  );
};

function createRouterGuard(router: Router) {
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
