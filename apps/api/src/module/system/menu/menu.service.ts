import { Inject, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { menuTable, type Menu } from "../../../db/modules";
import { eq, ne, and, like } from "drizzle-orm";
import { Dirzzle, type DirzzleDBType } from "../../../db/dirzzle.module";
import { BusinessException } from "../../../common/exceptions";
import { ResponseCode } from "../../../common/response";
import { generateId } from "@workspace/utils";

type MenuTree = Menu & {
  children?: MenuTree[];
};

@Injectable()
export class MenuService {
  constructor(@Inject(Dirzzle) private db: DirzzleDBType) {}

  async create(createMenuDto: CreateMenuDto) {
    const [newMenu] = await this.db
      .insert(menuTable)
      .values({
        id: generateId(),
        parentId: createMenuDto.parentId ?? "",
        name: createMenuDto.name,
        title: createMenuDto.title,
        icon: createMenuDto.icon ?? "",
        path: createMenuDto.path,
        order: createMenuDto.order ?? 0,
        menuType: createMenuDto.menuType,
        hideInMenu: createMenuDto.hideInMenu ?? false,
        badge: createMenuDto.badge ?? "",
        affixTab: createMenuDto.affixTab ?? false,
        keepAlive: createMenuDto.keepAlive ?? false,
        hideInTab: createMenuDto.hideInTab ?? false,
        affixTabOrder: createMenuDto.affixTabOrder ?? 0,
        query: createMenuDto.query ?? "",
        iframeSrc: createMenuDto.iframeSrc ?? "",
        status: createMenuDto.status ?? false,
        component: createMenuDto.component ?? "",
      })
      .returning();

    return { id: newMenu.id };
  }

  async findAll() {
    return this.db.select().from(menuTable).orderBy(menuTable.order);
  }

  async findList() {
    return this.db
      .select()
      .from(menuTable)
      .where(ne(menuTable.menuType, "3"))
      .orderBy(menuTable.order);
  }

  async findTree(
    title?: string,
    name?: string,
    menuType?: string,
    status?: string,
  ) {
    const conditions: any[] = [];

    if (title) {
      conditions.push(like(menuTable.title, `%${title}%`));
    }
    if (name) {
      conditions.push(like(menuTable.name, `%${name}%`));
    }
    if (menuType) {
      conditions.push(eq(menuTable.menuType, menuType));
    }
    if (status !== undefined && status !== "") {
      conditions.push(eq(menuTable.status, status === "true"));
    }

    const menus = await this.db
      .select()
      .from(menuTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(menuTable.order);

    return this.buildTree(menus);
  }

  async findOne(id: string) {
    const menus = await this.db
      .select()
      .from(menuTable)
      .where(eq(menuTable.id, id))
      .limit(1);

    if (menus.length === 0) {
      throw new BusinessException(ResponseCode.DATA_NOT_FOUND, "菜单不存在");
    }

    return menus[0];
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const existing = await this.findOne(id);

    await this.db
      .update(menuTable)
      .set({
        ...updateMenuDto,
        updateTime: new Date(),
      })
      .where(eq(menuTable.id, id));

    return { id };
  }

  async remove(id: string) {
    await this.findOne(id);

    // 检查是否有子菜单
    const children = await this.db
      .select()
      .from(menuTable)
      .where(eq(menuTable.parentId, id));

    if (children.length > 0) {
      throw new BusinessException(ResponseCode.BAD_REQUEST, "请先删除子菜单");
    }

    await this.db.delete(menuTable).where(eq(menuTable.id, id));

    return { id };
  }

  private buildTree(menus: Menu[]): MenuTree[] {
    const map = new Map<string, MenuTree>();
    const roots: MenuTree[] = [];

    menus.forEach((menu) => {
      map.set(menu.id, { ...menu, children: [] });
    });

    map.forEach((menu) => {
      if (!menu.parentId || menu.parentId === "" || menu.parentId === "0") {
        roots.push(menu);
      } else {
        const parent = map.get(menu.parentId);
        if (parent) {
          (parent.children as MenuTree[]).push(menu);
        }
      }
    });

    // 清理叶子节点的空 children，避免前端表格显示多余的展开图标
    return this.stripEmptyChildren(roots);
  }

  /** 递归移除空 children 数组，叶子节点不携带 children 字段 */
  private stripEmptyChildren(nodes: MenuTree[]): MenuTree[] {
    return nodes.map((node) => {
      if (!node.children || node.children.length === 0) {
        const { children: _, ...rest } = node;
        return rest;
      }
      return { ...node, children: this.stripEmptyChildren(node.children) };
    });
  }
}
