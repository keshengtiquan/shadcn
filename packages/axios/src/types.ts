import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * 扩展的 Axios 请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否需要认证 */
  withToken?: boolean;
  /** 是否直接返回响应数据 */
  raw?: boolean;
}

/**
 * 请求错误类型
 */
export interface RequestError extends AxiosError {
  config: InternalAxiosRequestConfig & RequestConfig;
}

/**
 * 请求拦截器函数类型
 */
export type RequestInterceptor = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

/**
 * 响应拦截器函数类型
 */
export type ResponseInterceptor = (
  response: AxiosResponse,
) => AxiosResponse | Promise<AxiosResponse>;

/**
 * 错误拦截器函数类型
 */
export type ErrorInterceptor = (error: RequestError) => Promise<never>;

/**
 * 拦截器配置选项
 */
export interface InterceptorOptions {
  /** 请求拦截器 */
  request?: RequestInterceptor;
  /** 响应拦截器 */
  response?: ResponseInterceptor;
  /** 请求错误拦截器 */
  requestError?: ErrorInterceptor;
  /** 响应错误拦截器 */
  responseError?: ErrorInterceptor;
}

/**
 * 上传文件配置
 */
export interface UploadConfig extends RequestConfig {
  /** 文件字段名 */
  fieldName?: string;
  /** 额外参数 */
  data?: Record<string, unknown>;
  /** 上传进度回调 */
  onProgress?: (percent: number) => void;
}

/**
 * RequestClient 构造函数选项
 */
export interface RequestClientOptions extends AxiosRequestConfig {
  /** 错误提示回调，用于注入 UI 组件 */
  onError?: (message: string) => void;
  /** 401 未授权回调 */
  onUnauthorized?: () => void;
  /** 获取 token 的方法 */
  getToken?: () => string | null;
}
