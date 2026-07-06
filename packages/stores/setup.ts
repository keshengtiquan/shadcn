import { createPinia, Pinia } from "pinia";
import type { App } from "vue";
import { createPersistedState } from "pinia-plugin-persistedstate";

export interface InitStoreOptions {
  /**
   * @zh_CN 应用名,由于 @vben/stores 是公用的，后续可能有多个app，为了防止多个app缓存冲突，可在这里配置应用名,应用名将被用于持久化的前缀
   */
  namespace: string;
}
let pinia: Pinia;

export function initStores(app: App, options: InitStoreOptions) {
  pinia = createPinia();
  pinia.use(
    createPersistedState({
      key: (id) => `${options.namespace ?? "默认"}-${id}`,
      storage: localStorage,
    }),
  );
  app.use(pinia);
  return pinia;
}
