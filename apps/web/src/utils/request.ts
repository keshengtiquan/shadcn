import { RequestClient } from "@workspace/axios";
import type { RequestClientOptions } from "@workspace/axios";
import { toast } from "vue-sonner";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const options: RequestClientOptions = {
  baseURL: import.meta.env.VITE_APP_API_URL,
  getToken() {
    const authStore = useAuthStore();
    return authStore.token;
  },
  onError(message) {
    console.error(message);
  },
  onUnauthorized() {
    const authStore = useAuthStore();
    authStore.logout(); // 清除 store 中的 token 和其他状态
    router.push("/login");
  },
};

const request = new RequestClient(options);

request.addInterceptors({
  response: (response) => {
    const res = response.data;
    console.log(res);

    if (res.code != 200) {
      toast.error(res.msg);
    }

    return response;
  },
});

// 初始化内置拦截器（最后执行，负责提取 data）
request.initInterceptors();

export { request };
export type { RequestClientOptions };
