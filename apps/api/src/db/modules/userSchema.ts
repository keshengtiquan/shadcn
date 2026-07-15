import { serial, varchar, timestamp, char, pgTable } from "drizzle-orm/pg-core";

export const userTable = pgTable("sys_user", {
  id: varchar("id", { length: 32 }).primaryKey().notNull(),
  deptId: serial("dept_id"),
  userName: varchar("user_name", { length: 30 }).notNull(),
  nickName: varchar("nick_name", { length: 30 }).notNull(),
  userType: varchar("user_type", { length: 2 }).notNull(),
  email: varchar("email", { length: 50 }).default("").notNull(),
  phonenumber: varchar("phonenumber", { length: 11 }).default("").notNull(),
  sex: char("sex", { length: 1 }).default("0").notNull(),
  avatar: varchar("avatar", { length: 255 }).default("").notNull(),
  password: varchar("password", { length: 200 }).notNull(),
  status: char("status", { length: 1 }).default("0").notNull(),
  delFlag: char("del_flag", { length: 1 }).default("0").notNull(),
  loginIp: varchar("login_ip", { length: 128 }).default("").notNull(),
  loginDate: timestamp("login_date", { withTimezone: true }),
  createBy: varchar("create_by", { length: 64 }).default("").notNull(),
  createTime: timestamp("create_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updateBy: varchar("update_by", { length: 64 }).default("").notNull(),
  updateTime: timestamp("update_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
  remark: varchar("remark", { length: 500 }),
});

export type User = typeof userTable.$inferSelect;
export type InsertUser = typeof userTable.$inferInsert;
