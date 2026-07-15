import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateUserSchema = z.object({
  deptId: z.number().optional(),
  userName: z
    .string({
      message: "用户名不能为空",
    })
    .min(1, "用户名不能为空")
    .max(30, "用户名长度不能超过30"),
  nickName: z
    .string({ message: "昵称不能为空" })
    .min(1, "昵称不能为空")
    .max(30, "昵称长度不能超过30"),
  userType: z.string().max(2).default("0"),
  email: z.string().email("邮箱格式不正确").or(z.literal("")).default(""),

  phonenumber: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "手机号格式不正确")
    .or(z.literal(""))
    .default(""),

  sex: z.string().max(1).default("0"),
  avatar: z.string().max(255).default(""),
  password: z.string().min(6, "密码至少6位").max(200, "密码长度不能超过200"),
  status: z.string().max(1).default("0"),
  remark: z.string().max(500).optional(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
