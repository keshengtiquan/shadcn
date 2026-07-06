// 菜单
export interface MenuList {
  id: string;
  parentId: string;
  name: string;
  title: string;
  icon: string;
  path: string;
  order: number;
  menuType: string;
  component: string;
  hideInMenu: boolean;
  badge: string;
  affixTab: boolean;
  keepAlive: boolean;
  hideInTab: boolean;
  affixTabOrder: number;
  query: string;
  iframeSrc: string;
  status: boolean;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export interface Menu extends MenuList {}
