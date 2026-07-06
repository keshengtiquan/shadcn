import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    title?: string;
    affixTab?: boolean;
    keepAlive?: boolean;
    hideInMenu?: boolean;
    activePath?: string;
    hideInTab?: boolean;
    affixTabOrder?: number;
    order?: number;
    query?: any;
    link?: string;
    iframeSrc?: string;
  }
}

export {};
