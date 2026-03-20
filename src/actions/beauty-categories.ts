'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { beautyCategories, beautyProducts } from '@/lib/db/schema';
import { eq, asc, max } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const uuidSchema = z.string().uuid();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export async function getBeautyCategories() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const results = await db
    .select({
      id: beautyCategories.id,
      name: beautyCategories.name,
      slug: beautyCategories.slug,
      displayOrder: beautyCategories.displayOrder,
      isDefault: beautyCategories.isDefault,
    })
    .from(beautyCategories)
    .orderBy(asc(beautyCategories.displayOrder));

  return results;
}

const createBeautyCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name too long'),
});

export async function createBeautyCategory(data: { name: string }) {
  const parsed = createBeautyCategorySchema.safeParse(data);
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
    .select({ maxOrder: max(beautyCategories.displayOrder) })
    .from(beautyCategories);

  const displayOrder = (maxOrder?.maxOrder ?? -1) + 1;

  const [created] = await db
    .insert(beautyCategories)
    .values({
      name: parsed.data.name,
      slug,
      displayOrder,
    })
    .returning();

  revalidatePath('/beauty');
  return created;
}

const updateBeautyCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name too long')
    .optional(),
});

export async function updateBeautyCategory(
  categoryId: string,
  data: { name?: string },
) {
  const idParsed = uuidSchema.safeParse(categoryId);
  if (!idParsed.success) throw new Error('Invalid category ID');

  const parsed = updateBeautyCategorySchema.safeParse(data);
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

  const [updated] = await db
    .update(beautyCategories)
    .set(updateData)
    .where(eq(beautyCategories.id, categoryId))
    .returning();

  revalidatePath('/beauty');
  return updated;
}

export async function deleteBeautyCategory(categoryId: string) {
  const parsed = uuidSchema.safeParse(categoryId);
  if (!parsed.success) throw new Error('Invalid category ID');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Check if category is a default category
  const [category] = await db
    .select()
    .from(beautyCategories)
    .where(eq(beautyCategories.id, categoryId))
    .limit(1);

  if (!category) throw new Error('Category not found');

  if (category.isDefault === 1) {
    throw new Error('Cannot delete default categories');
  }

  // Check if products reference this category
  const productCount = await db
    .select({ id: beautyProducts.id })
    .from(beautyProducts)
    .where(eq(beautyProducts.categoryId, categoryId))
    .limit(1);

  if (productCount.length > 0) {
    throw new Error(
      'Cannot delete category with existing products. Move or delete the products first.',
    );
  }

  await db.delete(beautyCategories).where(eq(beautyCategories.id, categoryId));

  revalidatePath('/beauty');
  return { success: true };
}
