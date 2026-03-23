'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import {
  portfolioItems,
  categories,
  images,
  imageVariants,
} from '@/lib/db/schema';
import { eq, desc, lt, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getPublicImageUrl } from '@/lib/supabase/storage';

const PAGE_SIZE = 12;

export async function getPortfolioItems(
  cursor?: string,
  categorySlug?: string,
) {
  const conditions = [];

  if (categorySlug && categorySlug !== 'all') {
    conditions.push(eq(categories.slug, categorySlug));
  }

  if (cursor) {
    conditions.push(lt(portfolioItems.createdAt, new Date(cursor)));
  }

  const whereClause =
    conditions.length > 0
      ? conditions.length === 1
        ? conditions[0]
        : and(...conditions)
      : undefined;

  const results = await db
    .select({
      id: portfolioItems.id,
      title: portfolioItems.title,
      description: portfolioItems.description,
      displayOrder: portfolioItems.displayOrder,
      createdAt: portfolioItems.createdAt,
      updatedAt: portfolioItems.updatedAt,
      categoryId: portfolioItems.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      imageId: portfolioItems.imageId,
      imageWidth: images.width,
      imageHeight: images.height,
    })
    .from(portfolioItems)
    .innerJoin(categories, eq(portfolioItems.categoryId, categories.id))
    .innerJoin(images, eq(portfolioItems.imageId, images.id))
    .where(whereClause)
    .orderBy(desc(portfolioItems.createdAt))
    .limit(PAGE_SIZE + 1);

  const hasMore = results.length > PAGE_SIZE;
  const items = hasMore ? results.slice(0, PAGE_SIZE) : results;

  // Fetch variants for all items in this page
  const imageIds = items.map((item) => item.imageId);
  let variantsByImageId: Record<
    string,
    {
      variantName: string;
      storagePath: string;
      width: number;
      height: number;
      url: string;
    }[]
  > = {};

  if (imageIds.length > 0) {
    const relevantVariants = await db
      .select()
      .from(imageVariants)
      .where(inArray(imageVariants.imageId, imageIds));

    for (const v of relevantVariants) {
      if (!variantsByImageId[v.imageId]) {
        variantsByImageId[v.imageId] = [];
      }
      variantsByImageId[v.imageId].push({
        variantName: v.variantName,
        storagePath: v.storagePath,
        width: v.width,
        height: v.height,
        url: getPublicImageUrl('public-images', v.storagePath),
      });
    }
  }

  const itemsWithVariants = items.map((item) => ({
    ...item,
    variants: variantsByImageId[item.imageId] || [],
  }));

  const nextCursor = hasMore
    ? items[items.length - 1].createdAt.toISOString()
    : null;

  return { items: itemsWithVariants, nextCursor };
}

const uuidSchema = z.string().uuid();

export async function getPortfolioItemById(itemId: string) {
  const parsed = uuidSchema.safeParse(itemId);
  if (!parsed.success) {
    throw new Error('Invalid portfolio item ID');
  }

  const results = await db
    .select({
      id: portfolioItems.id,
      title: portfolioItems.title,
      description: portfolioItems.description,
      displayOrder: portfolioItems.displayOrder,
      createdAt: portfolioItems.createdAt,
      updatedAt: portfolioItems.updatedAt,
      categoryId: portfolioItems.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      imageId: portfolioItems.imageId,
      imageWidth: images.width,
      imageHeight: images.height,
    })
    .from(portfolioItems)
    .innerJoin(categories, eq(portfolioItems.categoryId, categories.id))
    .innerJoin(images, eq(portfolioItems.imageId, images.id))
    .where(eq(portfolioItems.id, itemId))
    .limit(1);

  if (results.length === 0) return null;

  const item = results[0];

  // Fetch variants
  const variants = await db
    .select()
    .from(imageVariants)
    .where(eq(imageVariants.imageId, item.imageId));

  return {
    ...item,
    variants: variants.map((v) => ({
      variantName: v.variantName,
      storagePath: v.storagePath,
      width: v.width,
      height: v.height,
      url: getPublicImageUrl('public-images', v.storagePath),
    })),
  };
}

const createPortfolioItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional()
    .nullable(),
  categoryId: z.string().uuid('Invalid category'),
  imageId: z.string().uuid('Invalid image'),
});

export async function createPortfolioItem(data: {
  title: string;
  description?: string | null;
  categoryId: string;
  imageId: string;
}) {
  const parsed = createPortfolioItemSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const [created] = await db
    .insert(portfolioItems)
    .values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      categoryId: parsed.data.categoryId,
      imageId: parsed.data.imageId,
    })
    .returning();

  revalidatePath('/admin');
  revalidatePath('/');
  return created;
}

const updatePortfolioItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title too long')
    .optional(),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional()
    .nullable(),
  categoryId: z.string().uuid('Invalid category').optional(),
});

export async function updatePortfolioItem(
  itemId: string,
  data: { title?: string; description?: string | null; categoryId?: string },
) {
  const idParsed = uuidSchema.safeParse(itemId);
  if (!idParsed.success) throw new Error('Invalid portfolio item ID');

  const parsed = updatePortfolioItemSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const [updated] = await db
    .update(portfolioItems)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(portfolioItems.id, itemId))
    .returning();

  revalidatePath('/admin');
  revalidatePath('/');
  return updated;
}

export async function deletePortfolioItem(itemId: string) {
  const parsed = uuidSchema.safeParse(itemId);
  if (!parsed.success) throw new Error('Invalid portfolio item ID');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Find the portfolio item to get its imageId
  const [item] = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.id, itemId))
    .limit(1);

  if (!item) throw new Error('Portfolio item not found');

  // Get variant storage paths for cleanup
  const variants = await db
    .select({ storagePath: imageVariants.storagePath })
    .from(imageVariants)
    .where(eq(imageVariants.imageId, item.imageId));

  // Delete from Supabase Storage
  if (variants.length > 0) {
    const paths = variants.map((v) => v.storagePath);
    await supabase.storage.from('public-images').remove(paths);
  }

  // Delete the image record (cascades to imageVariants via onDelete: cascade)
  await db.delete(images).where(eq(images.id, item.imageId));

  // Delete the portfolio item record
  await db.delete(portfolioItems).where(eq(portfolioItems.id, itemId));

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}
