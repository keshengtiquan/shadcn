import { request } from "@/utils/request";
import { ApiResponse } from "../types";
import { MenuList } from "./types";

export const getMenuListApi = (): Promise<ApiResponse<MenuList[]>> => {
  return request.get("/system/menu/menuList");
};
