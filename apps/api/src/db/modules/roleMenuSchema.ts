import { varchar, pgTable, primaryKey } from "drizzle-orm/pg-core";

export const roleMenuTable = pgTable(
  "sys_role_menu",
  {
    roleId: varchar("role_id", { length: 32 }).notNull(),
    menuId: varchar("menu_id", { length: 32 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.menuId] }),
  }),
);

export type RoleMenu = typeof roleMenuTable.$inferSelect;
export type InsertRoleMenu = typeof roleMenuTable.$inferInsert;
