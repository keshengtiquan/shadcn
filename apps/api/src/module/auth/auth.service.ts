import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Dirzzle, type DirzzleDBType } from "../../db/dirzzle.module";
import {
  userTable,
  roleTable,
  userRoleTable,
  roleMenuTable,
  menuTable,
} from "../../db/modules";
import * as bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { BusinessException } from "../../common/exceptions";
import { ResponseCode } from "../../common/response";
import { LoginDto } from "./dto/login.dto";
import type { User } from "../../db/modules/userSchema";
import { isEmpty } from "@workspace/utils";

@Injectable()
export class AuthService {
  constructor(
    @Inject(Dirzzle) private db: DirzzleDBType,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by username
    const users = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.userName, loginDto.username))
      .limit(1);

    const user = users[0];

    if (!user) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BusinessException(ResponseCode.BAD_REQUEST, "密码错误");
    }

    // Check user status
    if (user.status === "1") {
      throw new BusinessException(ResponseCode.BAD_REQUEST, "用户已被禁用");
    }

    // 查询用户是否为超级管理员
    const isAdmin = await this.db
      .select()
      .from(userRoleTable)
      .innerJoin(roleTable, eq(userRoleTable.roleId, roleTable.id))
      .where(
        and(
          eq(userRoleTable.userId, user.id),
          eq(roleTable.code, "admin"),
          eq(roleTable.status, "0"),
        ),
      )
      .limit(1);

    let permissions: string[];

    if (isAdmin.length > 0) {
      // 超级管理员拥有所有权限
      permissions = ["*"];
    } else {
      // 查询用户权限：通过用户 → 角色 → 菜单（仅按钮类型）
      const userPermissions = await this.db
        .select({ permission: menuTable.name })
        .from(menuTable)
        .innerJoin(roleMenuTable, eq(menuTable.id, roleMenuTable.menuId))
        .innerJoin(roleTable, eq(roleMenuTable.roleId, roleTable.id))
        .innerJoin(userRoleTable, eq(roleTable.id, userRoleTable.roleId))
        .where(
          and(
            eq(userRoleTable.userId, user.id),
            eq(roleTable.status, "0"),
            eq(menuTable.menuType, "F"),
          ),
        );

      permissions = userPermissions.map((row) => row.permission);
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      username: user.userName,
      permissions,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async getUserInfo(userId: string) {
    if (isEmpty(userId)) {
      throw new BusinessException(ResponseCode.UNAUTHORIZED, "用户未登录");
    }
    const users = await this.db
      .select({
        id: userTable.id,
        userName: userTable.userName,
        nickName: userTable.nickName,
        email: userTable.email,
        phonenumber: userTable.phonenumber,
        avatar: userTable.avatar,
        status: userTable.status,
        deptId: userTable.deptId,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    const user = users[0];

    if (!user) {
      throw new BusinessException(ResponseCode.USER_NOT_FOUND, "用户不存在");
    }

    return user;
  }
}
