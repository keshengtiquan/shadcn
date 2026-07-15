import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateRoleSchema = z.object({
  name: z.string().min(1).max(30).optional(),
  code: z.string().min(1).max(100).optional(),
  sort: z.string().max(4).optional(),
  status: z.string().max(1).optional(),
  dataScope: z.string().max(1).optional(),
  remark: z.string().max(500).optional(),
  menuIds: z.array(z.string()).optional(),
});

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}
