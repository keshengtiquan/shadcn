import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string({ error: "用户名不能为空" }).min(1, "用户名不能为空"),
  password: z.string({ error: "密码不能为空" }).min(1, "密码不能为空"),
});

export class LoginDto extends createZodDto(LoginSchema) {}
