import type { RouteRecordRaw } from "vue-router";
import { coreRoutes } from "./core";
import { mergeRouteModules } from "@/utils/route";

const dynamicRouteFiles = import.meta.glob("./modules/**/*.ts", {
  eager: true,
});
export const dynamicRoutes: RouteRecordRaw[] =
  mergeRouteModules(dynamicRouteFiles);

/** 路由列表，由基本路由+静态路由组成 */
const routes: RouteRecordRaw[] = [...coreRoutes, ...dynamicRoutes];
export { routes };
