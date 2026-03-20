'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { categories, portfolioItems } from '@/lib/db/schema';
import { eq, asc, max } from 'drizzle-orm';
import { z } from 'zod';

export async function getCategories() {
  const results = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      displayOrder: categories.displayOrder,
      isDefault: categories.isDefault,
    })
    .from(categories)
    .orderBy(asc(categories.displayOrder));

  return results;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name too long'),
});

export async function createCategory(data: { name: string }) {
  const parsed = createCategorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const slug = generateSlug(parsed.data.name);

  // Calculate next display order
  const [maxOrder] = await db
    .select({ maxOrder: max(categories.displayOrder) })
    .from(categories);

  const displayOrder = (maxOrder?.maxOrder ?? -1) + 1;

  const [created] = await db
    .insert(categories)
    .values({
      name: parsed.data.name,
      slug,
      displayOrder,
    })
    .returning();

  return created;
}

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name too long')
    .optional(),
  displayOrder: z.number().int().min(0).optional(),
});

const uuidSchema = z.string().uuid();

export async function updateCategory(
  categoryId: string,
  data: { name?: string; displayOrder?: number },
) {
  const idParsed = uuidSchema.safeParse(categoryId);
  if (!idParsed.success) throw new Error('Invalid category ID');

  const parsed = updateCategorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) {
    updateData.name = parsed.data.name;
    updateData.slug = generateSlug(parsed.data.name);
  }
  if (parsed.data.displayOrder !== undefined) {
    updateData.displayOrder = parsed.data.displayOrder;
  }

  const [updated] = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, categoryId))
    .returning();

  return updated;
}

export async function deleteCategory(categoryId: string) {
  const parsed = uuidSchema.safeParse(categoryId);
  if (!parsed.success) throw new Error('Invalid category ID');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Check if category has portfolio items
  const itemCount = await db
    .select({ id: portfolioItems.id })
    .from(portfolioItems)
    .where(eq(portfolioItems.categoryId, categoryId))
    .limit(1);

  if (itemCount.length > 0) {
    throw new Error(
      'Cannot delete category with existing photos. Move or delete the photos first.',
    );
  }

  await db.delete(categories).where(eq(categories.id, categoryId));

  return { success: true };
}
