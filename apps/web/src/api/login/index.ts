import { request } from "@/utils/request";
import { ApiResponse } from "../types";
import { CaptchaData, LoginParams, LoginResult, UserInfo } from "./types";

// 获取验证码
export const getCaptchaApi = (): Promise<ApiResponse<CaptchaData>> => {
  return request.get("/login/getCaptcha");
};

// 登录
export const loginApi = (
  params: LoginParams,
): Promise<ApiResponse<LoginResult>> => {
  return request.post("/auth/login", params);
};

export const getUserInfoApi = (): Promise<ApiResponse<UserInfo>> => {
  return request.get("/auth/info");
};
