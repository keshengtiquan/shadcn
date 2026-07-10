import { request } from "@/utils/request";
import { ApiResponse } from "../types";
import { MenuList, CreateMenuParams } from "./types";

export const getMenuListApi = (): Promise<ApiResponse<MenuList[]>> => {
  return request.get("/system/menu/menuList");
};

export const createMenuApi = (
  params: CreateMenuParams,
): Promise<ApiResponse<void>> => {
  return request.post("/system/menu/create", params);
};
