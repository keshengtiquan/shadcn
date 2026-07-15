import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateRoleSchema = z.object({
  name: z.string({ message: "角色名称不能为空" }).min(1).max(30),
  code: z.string({ message: "角色编码不能为空" }).min(1).max(100),
  sort: z.string().max(4).default("0"),
  status: z.string().max(1).default("0"),
  dataScope: z.string().max(1).default("1"),
  remark: z.string().max(500).optional(),
  menuIds: z.array(z.string()).optional(),
});

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}
