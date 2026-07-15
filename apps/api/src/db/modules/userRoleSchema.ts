import { varchar, pgTable, primaryKey } from "drizzle-orm/pg-core";

export const userRoleTable = pgTable(
  "sys_user_role",
  {
    userId: varchar("user_id", { length: 32 }).notNull(),
    roleId: varchar("role_id", { length: 32 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  }),
);

export type UserRole = typeof userRoleTable.$inferSelect;
export type InsertUserRole = typeof userRoleTable.$inferInsert;
