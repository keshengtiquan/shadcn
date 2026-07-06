interface MenuItem {
  name: string;
  title: string;
  icon?: string;
  path: string;
  order?: number;
  hideInMenu?: boolean;
  badge?: string | number;
  children?: MenuItem[];
  affixTab?: boolean;
  KeepAlive?: boolean;
  hideInTab?: boolean;
  affixTabOrder?: number;
  query?: any;
  iframeSrc?: string;
}

export type { MenuItem };
