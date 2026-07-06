import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Canceler,
} from "axios";
import axios from "axios";
import { merge } from "lodash-es";
import qs from "qs";

import type {
  InterceptorOptions,
  RequestClientOptions,
  RequestConfig,
  RequestError,
  UploadConfig,
} from "./types";

export class RequestClient {
  public readonly instance: AxiosInstance;
  private cancelMap: Map<string, Canceler> = new Map();
  private options: RequestClientOptions;

  constructor(options: RequestClientOptions = {}) {
    this.options = options;
    const defaultConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      timeout: 10000,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "brackets" });
      },
    };
    const config = merge({}, defaultConfig, options);
    this.instance = axios.create(config);
    // 注意：setupInterceptors 最后调用，让用户通过 addInterceptors 添加的拦截器先执行
    // 这样才能获取完整的 AxiosResponse 对象
  }

  /**
   * 初始化拦截器（应在所有自定义拦截器添加完成后调用）
   */
  public initInterceptors(): void {
    this.setupInterceptors();
  }

  /**
   * 设置拦截器（基础拦截器，用户自定义拦截器会先执行）
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 可以在这里添加 token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: RequestError) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器（最后执行，负责提取 data）
    this.instance.interceptors.response.use(
      (response) => {
        // 如果已经被之前的拦截器处理过（不是 AxiosResponse），直接返回
        if (!response || !response.config) {
          return response;
        }
        const { data, config } = response as AxiosResponse;
        // 如果 raw 为 true，直接返回原始响应
        if ((config as RequestConfig).raw) {
          return response;
        }
        // 默认返回 data
        return data;
      },
      (error: RequestError) => {
        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * 获取 token（优先使用传入的 getToken 回调）
   */
  private getToken(): string | null {
    // 优先使用构造函数传入的 getToken 方法
    if (this.options.getToken) {
      return this.options.getToken();
    }
    // 默认从 localStorage 获取
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  /**
   * 错误处理
   */
  private handleError(error: RequestError): void {
    const { config, response, message } = error;

    // 如果配置了不显示错误，则不处理
    if (config?.showError === false) {
      return;
    }

    let errorMessage = message;

    if (response) {
      const { status, data } = response;
      switch (status) {
        case 400:
          errorMessage =
            (data as { message?: string })?.message || "请求参数错误";
          break;
        case 401:
          errorMessage = "未授权，请重新登录";
          this.handleUnauthorized();
          break;
        case 403:
          errorMessage = "拒绝访问";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器内部错误";
          break;
        default:
          errorMessage =
            (data as { message?: string })?.message || `请求失败: ${status}`;
      }
    } else if (message.includes("timeout")) {
      errorMessage = "请求超时，请稍后重试";
    } else if (message.includes("Network Error")) {
      errorMessage = "网络错误，请检查网络连接";
    }

    // 调用错误回调（优先使用传入的 onError）
    if (this.options.onError) {
      this.options.onError(errorMessage);
    } else {
      console.error("[Request Error]:", errorMessage);
    }
  }

  /**
   * 处理未授权（401）
   */
  private handleUnauthorized(): void {
    // 优先使用传入的 onUnauthorized 回调
    if (this.options.onUnauthorized) {
      this.options.onUnauthorized();
      return;
    }

    // 默认处理：清除 token 并跳转到登录页
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  /**
   * GET 请求
   */
  public get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.get(url, {
      params,
      ...config,
    });
  }

  /**
   * POST 请求
   */
  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  /**
   * PUT 请求
   */
  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  /**
   * DELETE 请求
   */
  public delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.delete(url, {
      params,
      ...config,
    });
  }

  /**
   * PATCH 请求
   */
  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  /**
   * 发送 FormData 请求（用于文件上传等）
   */
  public postForm<T = unknown>(
    url: string,
    data: FormData | Record<string, unknown>,
    config?: RequestConfig,
  ): Promise<T> {
    const formData =
      data instanceof FormData ? data : this.objectToFormData(data);

    return this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
  }

  /**
   * 对象转 FormData
   */
  private objectToFormData(obj: Record<string, unknown>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }

  /**
   * 上传文件
   */
  public upload<T = unknown>(
    url: string,
    file: File,
    config: UploadConfig = {},
  ): Promise<T> {
    const { fieldName = "file", data, onProgress, ...restConfig } = config;
    const formData = new FormData();
    formData.append(fieldName, file);

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    return this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress?.(percent);
        }
      },
      ...restConfig,
    });
  }

  /**
   * 下载文件
   */
  public async download(
    url: string,
    filename?: string,
    config?: RequestConfig,
  ): Promise<void> {
    const response = await this.instance.get<Blob>(url, {
      responseType: "blob",
      raw: true,
      ...config,
    });

    const blob =
      response instanceof Blob
        ? response
        : (response as unknown as AxiosResponse<Blob>).data;
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || this.extractFilenameFromUrl(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * 从 URL 提取文件名
   */
  private extractFilenameFromUrl(url: string): string {
    const pathname = new URL(url, window.location.origin).pathname;
    return pathname.split("/").pop() || "download";
  }

  /**
   * 取消请求
   */
  public cancel(message = "请求被取消"): void {
    this.cancelMap.forEach((cancel) => cancel(message));
    this.cancelMap.clear();
  }

  /**
   * 取消指定请求
   */
  public cancelRequest(url: string, method = "get"): void {
    const key = `${method}-${url}`.toLowerCase();
    const cancel = this.cancelMap.get(key);
    if (cancel) {
      cancel("请求被取消");
      this.cancelMap.delete(key);
    }
  }

  /**
   * 添加自定义拦截器
   */
  public addInterceptors(options: InterceptorOptions): void {
    if (options.request) {
      this.instance.interceptors.request.use(
        options.request,
        options.requestError,
      );
    }
    if (options.response) {
      this.instance.interceptors.response.use(
        options.response,
        options.responseError,
      );
    }
  }

  /**
   * 移除拦截器
   */
  public removeInterceptor(
    type: "request" | "response",
    interceptorId: number,
  ): void {
    if (type === "request") {
      this.instance.interceptors.request.eject(interceptorId);
    } else {
      this.instance.interceptors.response.eject(interceptorId);
    }
  }
}
