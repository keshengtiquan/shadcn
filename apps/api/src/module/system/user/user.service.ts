import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { userTable, roleTable, userRoleTable } from "../../../db/modules";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Dirzzle, type DirzzleDBType } from "../../../db/dirzzle.module";
import { BusinessException } from "../../../common/exceptions";
import { ResponseCode, Result } from "../../../common/response";
import { StatusEnum } from "../../../common/enum";
import { generateId } from "@workspace/utils";

@Injectable()
export class UserService {
  constructor(@Inject(Dirzzle) private db: DirzzleDBType) {}

  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existingUser = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.userName, createUserDto.userName))
      .limit(1);

    if (existingUser.length > 0) {
      throw new BusinessException(ResponseCode.USER_NAME_EXIST, "用户名已存在");
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    const [newUser] = await this.db
      .insert(userTable)
      .values({
        id: generateId(),
        userName: createUserDto.userName,
        nickName: createUserDto.nickName,
        userType: createUserDto.userType ?? "0",
        email: createUserDto.email ?? "",
        phonenumber: createUserDto.phonenumber ?? "",
        sex: createUserDto.sex ?? "0",
        avatar: createUserDto.avatar ?? "",
        password: hashedPassword,
        status: createUserDto.status ?? StatusEnum.NORMAL,
        remark: createUserDto.remark,
      })
      .returning();

    return Result.ok({ id: newUser.id });
  }

  async getUserInfo(id: string) {
    // 从数据库查询用户信息
    const user = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));

    if (user.length === 0) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    return Result.ok(user[0]);
  }

  async findAll() {
    const users = await this.db
      .select({
        id: userTable.id,
        userName: userTable.userName,
        nickName: userTable.nickName,
        email: userTable.email,
        phonenumber: userTable.phonenumber,
        sex: userTable.sex,
        avatar: userTable.avatar,
        status: userTable.status,
        deptId: userTable.deptId,
        createTime: userTable.createTime,
      })
      .from(userTable)
      .where(eq(userTable.delFlag, "0"));

    return Result.ok(users);
  }

  async findOne(id: string) {
    const users = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    if (users.length === 0) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    return Result.ok(users[0]);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // 检查用户是否存在
    const existing = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    // 如果修改用户名，检查是否与其他用户重复
    if (updateUserDto.userName) {
      const duplicate = await this.db
        .select()
        .from(userTable)
        .where(eq(userTable.userName, updateUserDto.userName))
        .limit(1);

      if (duplicate.length > 0 && duplicate[0].id !== id) {
        throw new BusinessException(
          ResponseCode.USER_NAME_EXIST,
          "用户名已存在",
        );
      }
    }

    // 如果更新密码，需要加密
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.db
      .update(userTable)
      .set({
        ...updateData,
        updateTime: new Date(),
      })
      .where(eq(userTable.id, id));

    return Result.ok({ id });
  }

  async remove(id: string) {
    // 检查用户是否存在
    const existing = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    // 软删除
    await this.db
      .update(userTable)
      .set({
        delFlag: "1",
        updateTime: new Date(),
      })
      .where(eq(userTable.id, id));

    return Result.ok({ id });
  }

  /** 获取用户已分配的角色列表 */
  async getUserRoles(userId: string) {
    const roles = await this.db
      .select({
        id: roleTable.id,
        name: roleTable.name,
        code: roleTable.code,
      })
      .from(roleTable)
      .innerJoin(userRoleTable, eq(roleTable.id, userRoleTable.roleId))
      .where(eq(userRoleTable.userId, userId));

    return Result.ok(roles);
  }

  /** 分配用户角色（全量替换） */
  async assignRoles(userId: string, roleIds: string[]) {
    // 检查用户是否存在
    const existing = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (existing.length === 0) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    // 先删除旧的角色分配
    await this.db.delete(userRoleTable).where(eq(userRoleTable.userId, userId));

    // 再插入新的角色分配
    if (roleIds.length > 0) {
      await this.db
        .insert(userRoleTable)
        .values(roleIds.map((roleId) => ({ userId, roleId })));
    }

    return Result.ok({ userId, roleIds });
  }
}
