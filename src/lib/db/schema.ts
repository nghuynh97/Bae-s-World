import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inviteCodes = pgTable("invite_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  assignedName: text("assigned_name").notNull(),
  usedAt: timestamp("used_at"),
  usedByAuthId: text("used_by_auth_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  authId: text("auth_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
