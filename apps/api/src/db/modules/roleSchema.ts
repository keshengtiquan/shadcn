import { varchar, timestamp, pgTable, char } from "drizzle-orm/pg-core";

export const roleTable = pgTable("sys_role", {
  id: varchar("id", { length: 32 }).primaryKey().notNull(),
  name: varchar("name", { length: 30 }).notNull(),
  code: varchar("code", { length: 100 }).notNull(),
  sort: varchar("sort", { length: 4 }).default("0").notNull(),
  status: char("status", { length: 1 }).default("0").notNull(),
  dataScope: char("data_scope", { length: 1 }).default("1").notNull(),
  remark: varchar("remark", { length: 500 }),
  createBy: varchar("create_by", { length: 64 }).default("").notNull(),
  createTime: timestamp("create_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updateBy: varchar("update_by", { length: 64 }).default("").notNull(),
  updateTime: timestamp("update_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Role = typeof roleTable.$inferSelect;
export type InsertRole = typeof roleTable.$inferInsert;
