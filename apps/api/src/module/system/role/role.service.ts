import { Inject, Injectable } from "@nestjs/common";
import { Dirzzle, type DirzzleDBType } from "../../../db/dirzzle.module";
import { roleTable, userRoleTable, roleMenuTable } from "../../../db/modules";
import { eq } from "drizzle-orm";
import { BusinessException } from "../../../common/exceptions";
import { ResponseCode, Result } from "../../../common/response";
import { generateId } from "@workspace/utils";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RoleService {
  constructor(@Inject(Dirzzle) private db: DirzzleDBType) {}

  async create(dto: CreateRoleDto) {
    // 检查角色编码是否已存在
    const existing = await this.db
      .select()
      .from(roleTable)
      .where(eq(roleTable.code, dto.code))
      .limit(1);

    if (existing.length > 0) {
      throw new BusinessException(
        ResponseCode.DATA_ALREADY_EXISTS,
        "角色编码已存在",
      );
    }

    const roleId = generateId();
    await this.db.insert(roleTable).values({
      id: roleId,
      name: dto.name,
      code: dto.code,
      sort: dto.sort ?? "0",
      status: dto.status ?? "0",
      dataScope: dto.dataScope ?? "1",
      remark: dto.remark,
    });

    // 如果提供了菜单权限，一并分配
    if (dto.menuIds && dto.menuIds.length > 0) {
      await this.db
        .insert(roleMenuTable)
        .values(dto.menuIds.map((menuId) => ({ roleId, menuId })));
    }

    return Result.ok({ id: roleId });
  }

  async findAll() {
    const roles = await this.db
      .select()
      .from(roleTable)
      .orderBy(roleTable.sort);

    return Result.ok(roles);
  }

  async findOne(id: string) {
    const roles = await this.db
      .select()
      .from(roleTable)
      .where(eq(roleTable.id, id))
      .limit(1);

    if (roles.length === 0) {
      throw new BusinessException(ResponseCode.DATA_NOT_FOUND, "角色不存在");
    }

    return Result.ok(roles[0]);
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.checkExists(id);

    // 如果修改编码，检查是否与其他角色重复
    if (dto.code) {
      const existing = await this.db
        .select()
        .from(roleTable)
        .where(eq(roleTable.code, dto.code))
        .limit(1);

      if (existing.length > 0 && existing[0].id !== id) {
        throw new BusinessException(
          ResponseCode.DATA_ALREADY_EXISTS,
          "角色编码已存在",
        );
      }
    }

    const { menuIds, ...roleData } = dto;

    await this.db
      .update(roleTable)
      .set({
        ...roleData,
        updateTime: new Date(),
      })
      .where(eq(roleTable.id, id));

    // 如果提供了 menuIds，重新分配菜单权限（先删后增）
    if (menuIds !== undefined) {
      await this.db.delete(roleMenuTable).where(eq(roleMenuTable.roleId, id));
      if (menuIds.length > 0) {
        await this.db
          .insert(roleMenuTable)
          .values(menuIds.map((menuId) => ({ roleId: id, menuId })));
      }
    }

    return Result.ok({ id });
  }

  async remove(id: string) {
    await this.checkExists(id);

    // 检查该角色下是否有用户
    const userRoles = await this.db
      .select()
      .from(userRoleTable)
      .where(eq(userRoleTable.roleId, id))
      .limit(1);

    if (userRoles.length > 0) {
      throw new BusinessException(
        ResponseCode.DATA_IN_USE,
        "该角色下存在用户，无法删除",
      );
    }

    // 删除角色菜单关联
    await this.db.delete(roleMenuTable).where(eq(roleMenuTable.roleId, id));
    // 删除角色
    await this.db.delete(roleTable).where(eq(roleTable.id, id));

    return Result.ok({ id });
  }

  /** 获取角色已分配的菜单 ID 列表 */
  async getRoleMenuIds(roleId: string) {
    await this.checkExists(roleId);

    const records = await this.db
      .select({ menuId: roleMenuTable.menuId })
      .from(roleMenuTable)
      .where(eq(roleMenuTable.roleId, roleId));

    return Result.ok(records.map((r) => r.menuId));
  }

  private async checkExists(id: string) {
    const roles = await this.db
      .select()
      .from(roleTable)
      .where(eq(roleTable.id, id))
      .limit(1);

    if (roles.length === 0) {
      throw new BusinessException(ResponseCode.DATA_NOT_FOUND, "角色不存在");
    }
  }
}
