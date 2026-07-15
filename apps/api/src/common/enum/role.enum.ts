/**
 * 角色状态枚举
 * - NORMAL (0): 正常
 * - DISABLED (1): 停用
 */
export enum RoleStatusEnum {
  /** 正常 */
  NORMAL = "0",
  /** 停用 */
  DISABLED = "1",
}

/** RoleStatusEnum Swagger Schema */
export const RoleStatusEnumSchema = {
  description: `角色状态枚举
- NORMAL (0): 正常
- DISABLED (1): 停用`,
};
