import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateMenuSchema = z.object({
  parentId: z.string().max(32).optional(),
  name: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(100).optional(),
  icon: z.string().max(100).optional(),
  path: z.string().min(1).max(255).optional(),
  order: z.number().int().optional(),
  hideInMenu: z.boolean().optional(),
  badge: z.string().max(50).optional(),
  affixTab: z.boolean().optional(),
  keepAlive: z.boolean().optional(),
  hideInTab: z.boolean().optional(),
  affixTabOrder: z.number().int().optional(),
  query: z.string().max(500).optional(),
  iframeSrc: z.string().max(255).optional(),
  status: z.boolean().optional(),
  menuType: z.string().max(1).optional(),
  component: z.string().optional(),
});

export class UpdateMenuDto extends createZodDto(UpdateMenuSchema) {}
