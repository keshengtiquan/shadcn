// 后端标准响应格式
export type ApiResponse<T> = {
  code: number;
  msg: string;
  data: T;
};
