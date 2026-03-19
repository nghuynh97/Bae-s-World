import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const images = pgTable("images", {
  id: uuid("id").defaultRandom().primaryKey(),
  originalName: text("original_name").notNull(),
  bucket: text("bucket").notNull(), // "public-images" or "private-images"
  folder: text("folder").notNull(), // e.g., "portfolio", "journal", "beauty"
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  format: text("format").notNull(), // original format: jpeg, png, webp
  uploadedBy: text("uploaded_by").notNull(), // Supabase Auth user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const imageVariants = pgTable("image_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageId: uuid("image_id")
    .notNull()
    .references(() => images.id, { onDelete: "cascade" }),
  variantName: text("variant_name").notNull(), // "thumb", "medium", "large", "full"
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  storagePath: text("storage_path").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
