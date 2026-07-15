import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateUserSchema = z.object({
  deptId: z.number().optional(),
  userName: z.string().min(1).max(30).optional(),
  nickName: z.string().min(1).max(30).optional(),
  userType: z.string().max(2).optional(),
  email: z.string().email().or(z.literal("")).optional(),
  phonenumber: z
    .string()
    .regex(/^1[3-9]\d{9}$/)
    .or(z.literal(""))
    .optional(),
  sex: z.string().max(1).optional(),
  avatar: z.string().max(255).optional(),
  password: z.string().min(6).max(200).optional(),
  status: z.string().max(1).optional(),
  remark: z.string().max(500).optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
