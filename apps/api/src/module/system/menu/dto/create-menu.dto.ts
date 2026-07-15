import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateMenuSchema = z.object({
  parentId: z.string().max(32).default("0"),
  name: z.string({ error: "路由名称不能为空" }).min(1).max(100),
  title: z.string({ error: "菜单标题不能为空" }).min(1).max(100),
  icon: z.string().max(100).default(""),
  path: z.string({ error: "路由路径不能为空" }).min(1).max(255),
  order: z.number().int().default(0),
  hideInMenu: z.boolean().default(false),
  badge: z.string().max(50).default(""),
  affixTab: z.boolean().default(false),
  keepAlive: z.boolean().default(false),
  hideInTab: z.boolean().default(false),
  affixTabOrder: z.number().int().default(0),
  query: z.string().max(500).default(""),
  iframeSrc: z.string().max(255).default(""),
  status: z.boolean().default(false),
  menuType: z.string().max(1, { error: "菜单类型长度最大为1" }).default("F"),
  component: z.string().default(""),
});

export class CreateMenuDto extends createZodDto(CreateMenuSchema) {}
