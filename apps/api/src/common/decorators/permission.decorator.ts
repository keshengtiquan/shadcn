import { SetMetadata } from "@nestjs/common";

export const PERMISSION_KEY = "permission";

/**
 * 权限校验装饰器
 *
 * @description 用于标记接口所需的权限，支持传入多个权限（OR 逻辑：满足任意一个即可访问）
 *
 * @example
 * // 单个权限
 * @RequirePermission('system:user:create')
 *
 * // 多个权限（OR 逻辑）
 * @RequirePermission('system:user:create', 'system:user:edit')
 */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
