import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const inviteCodes = pgTable('invite_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  assignedName: text('assigned_name').notNull(),
  usedAt: timestamp('used_at'),
  usedByAuthId: text('used_by_auth_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: text('auth_id').notNull().unique(),
  displayName: text('display_name').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalName: text('original_name').notNull(),
  bucket: text('bucket').notNull(), // "public-images" or "private-images"
  folder: text('folder').notNull(), // e.g., "portfolio", "journal", "beauty"
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  format: text('format').notNull(), // original format: jpeg, png, webp
  uploadedBy: text('uploaded_by').notNull(), // Supabase Auth user ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const imageVariants = pgTable('image_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  variantName: text('variant_name').notNull(), // "thumb", "medium", "large", "full"
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  storagePath: text('storage_path').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  isDefault: integer('is_default').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id),
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aboutContent = pgTable('about_content', {
  id: uuid('id').defaultRandom().primaryKey(),
  bio: text('bio').notNull().default(''),
  email: text('email'),
  instagramUrl: text('instagram_url'),
  tiktokUrl: text('tiktok_url'),
  tagline: text('tagline'),
  height: text('height'),
  weight: text('weight'),
  profileImageId: uuid('profile_image_id').references(() => images.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const beautyCategories = pgTable('beauty_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  isDefault: integer('is_default').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const beautyProducts = pgTable('beauty_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => beautyCategories.id),
  rating: integer('rating').notNull().default(0),
  notes: text('notes'),
  isFavorite: integer('is_favorite').notNull().default(0),
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const routines = pgTable('routines', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const routineSteps = pgTable('routine_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  routineId: uuid('routine_id')
    .notNull()
    .references(() => routines.id, { onDelete: 'cascade' }),
  productId: uuid('product_id')
    .notNull()
    .references(() => beautyProducts.id, { onDelete: 'cascade' }),
  stepOrder: integer('step_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// -- CREATE TABLE schedule_jobs (
// --   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
// --   job_date text NOT NULL,
// --   client_name text NOT NULL,
// --   location text NOT NULL,
// --   start_time text NOT NULL,
// --   end_time text NOT NULL,
// --   pay_amount integer NOT NULL,
// --   status text NOT NULL DEFAULT 'pending',
// --   notes text,
// --   created_at timestamptz DEFAULT now() NOT NULL,
// --   updated_at timestamptz DEFAULT now() NOT NULL
// -- );

export const scheduleJobs = pgTable('schedule_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobDate: text('job_date').notNull(),
  clientName: text('client_name').notNull(),
  location: text('location').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  payAmount: integer('pay_amount').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations

export const categoriesRelations = relations(categories, ({ many }) => ({
  portfolioItems: many(portfolioItems),
}));

export const portfolioItemsRelations = relations(portfolioItems, ({ one }) => ({
  category: one(categories, {
    fields: [portfolioItems.categoryId],
    references: [categories.id],
  }),
  image: one(images, {
    fields: [portfolioItems.imageId],
    references: [images.id],
  }),
}));

export const imagesRelations = relations(images, ({ many }) => ({
  variants: many(imageVariants),
}));

export const imageVariantsRelations = relations(imageVariants, ({ one }) => ({
  image: one(images, {
    fields: [imageVariants.imageId],
    references: [images.id],
  }),
}));

export const beautyCategoriesRelations = relations(
  beautyCategories,
  ({ many }) => ({
    products: many(beautyProducts),
  }),
);

export const beautyProductsRelations = relations(beautyProducts, ({ one }) => ({
  category: one(beautyCategories, {
    fields: [beautyProducts.categoryId],
    references: [beautyCategories.id],
  }),
  image: one(images, {
    fields: [beautyProducts.imageId],
    references: [images.id],
  }),
}));

export const routinesRelations = relations(routines, ({ many }) => ({
  steps: many(routineSteps),
}));

export const routineStepsRelations = relations(routineSteps, ({ one }) => ({
  routine: one(routines, {
    fields: [routineSteps.routineId],
    references: [routines.id],
  }),
  product: one(beautyProducts, {
    fields: [routineSteps.productId],
    references: [beautyProducts.id],
  }),
}));
