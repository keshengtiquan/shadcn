import {
  varchar,
  timestamp,
  boolean,
  pgTable,
  serial,
} from "drizzle-orm/pg-core";

export const menuTable = pgTable("sys_menu", {
  id: varchar("id", { length: 32 }).primaryKey().notNull(),
  parentId: varchar("parent_id", { length: 32 }).default("").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }).default("").notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  order: serial("order"),
  menuType: varchar("menu_type", { length: 1 }).default("F").notNull(),
  component: varchar().default(""),
  hideInMenu: boolean("hidden_in_menu").default(false).notNull(),
  badge: varchar("badge", { length: 50 }).default("").notNull(),
  affixTab: boolean("affix_tab").default(false).notNull(),
  keepAlive: boolean("keep_alive").default(false).notNull(),
  hideInTab: boolean("hide_in_tab").default(false).notNull(),
  affixTabOrder: serial("affix_tab_order"),
  query: varchar("query", { length: 500 }).default("").notNull(),
  iframeSrc: varchar("iframe_src", { length: 255 }).default("").notNull(),
  status: boolean("status").default(false).notNull(),
  createBy: varchar("create_by", { length: 64 }).default("").notNull(),
  createTime: timestamp("create_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updateBy: varchar("update_by", { length: 64 }).default("").notNull(),
  updateTime: timestamp("update_time", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Menu = typeof menuTable.$inferSelect;
export type InsertMenu = typeof menuTable.$inferInsert;
