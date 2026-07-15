import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { PUBLIC_KEY } from "../decorators/public.decorator";
import { AuthorizationException } from "../exceptions/business.exception";
import { ResponseCode } from "../response/response.interface";

/**
 * 权限守卫
 *
 * @description 全局权限校验守卫，排在 JwtAuthGuard 之后执行。
 * 通过读取 @RequirePermission() 装饰器设置的元数据来检查用户权限。
 *
 * 权限检查逻辑:
 * 1. @Public() 路由跳过权限检查
 * 2. 未标记 @RequirePermission() 的路由默认允许访问（向后兼容）
 * 3. 超级管理员（permissions 中包含 "*"）直接放行
 * 4. OR 逻辑：满足任意一个所需权限即可访问
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 公开路由跳过权限检查
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. 获取所需权限
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 3. 无权限要求则直接放行
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 4. 检查用户权限
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions || user.permissions.length === 0) {
      throw new AuthorizationException(
        ResponseCode.PERMISSION_DENIED,
        "权限不足",
      );
    }

    // 5. 超级管理员通配符
    if (user.permissions.includes("*")) {
      return true;
    }

    // 6. OR 逻辑：满足任意一个即可
    const hasPermission = requiredPermissions.some((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new AuthorizationException(
        ResponseCode.PERMISSION_DENIED,
        "权限不足",
      );
    }

    return true;
  }
}
