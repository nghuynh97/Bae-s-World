'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import {
  beautyProducts,
  beautyCategories,
  images,
  imageVariants,
} from '@/lib/db/schema';
import { eq, desc, inArray, ilike, and } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getSignedImageUrls } from '@/lib/supabase/storage';

const uuidSchema = z.string().uuid();

export async function getBeautyProducts(
  categorySlug?: string,
  favoritesOnly?: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const conditions = [];

  if (categorySlug && categorySlug !== 'all' && categorySlug !== 'favorites') {
    conditions.push(eq(beautyCategories.slug, categorySlug));
  }

  if (favoritesOnly || categorySlug === 'favorites') {
    conditions.push(eq(beautyProducts.isFavorite, 1));
  }

  const whereClause =
    conditions.length > 0
      ? conditions.length === 1
        ? conditions[0]
        : and(...conditions)
      : undefined;

  const results = await db
    .select({
      id: beautyProducts.id,
      name: beautyProducts.name,
      brand: beautyProducts.brand,
      categoryId: beautyProducts.categoryId,
      categoryName: beautyCategories.name,
      categorySlug: beautyCategories.slug,
      rating: beautyProducts.rating,
      notes: beautyProducts.notes,
      isFavorite: beautyProducts.isFavorite,
      imageId: beautyProducts.imageId,
      imageWidth: images.width,
      imageHeight: images.height,
      createdAt: beautyProducts.createdAt,
      updatedAt: beautyProducts.updatedAt,
    })
    .from(beautyProducts)
    .innerJoin(
      beautyCategories,
      eq(beautyProducts.categoryId, beautyCategories.id),
    )
    .innerJoin(images, eq(beautyProducts.imageId, images.id))
    .where(whereClause)
    .orderBy(desc(beautyProducts.createdAt));

  // Batch-fetch image variants
  const imageIds = results.map((p) => p.imageId);
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

    // Sign all variant URLs (private bucket)
    const allPaths = relevantVariants.map((v) => v.storagePath);
    let signedUrls: { signedUrl: string }[] = [];
    if (allPaths.length > 0) {
      signedUrls = await getSignedImageUrls(allPaths);
    }

    for (let i = 0; i < relevantVariants.length; i++) {
      const v = relevantVariants[i];
      if (!variantsByImageId[v.imageId]) {
        variantsByImageId[v.imageId] = [];
      }
      variantsByImageId[v.imageId].push({
        variantName: v.variantName,
        storagePath: v.storagePath,
        width: v.width,
        height: v.height,
        url: signedUrls[i]?.signedUrl ?? '',
      });
    }
  }

  return results.map((product) => ({
    ...product,
    variants: variantsByImageId[product.imageId] || [],
  }));
}

export async function getBeautyProductById(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const parsed = uuidSchema.safeParse(productId);
  if (!parsed.success) throw new Error('Invalid product ID');

  const results = await db
    .select({
      id: beautyProducts.id,
      name: beautyProducts.name,
      brand: beautyProducts.brand,
      categoryId: beautyProducts.categoryId,
      categoryName: beautyCategories.name,
      categorySlug: beautyCategories.slug,
      rating: beautyProducts.rating,
      notes: beautyProducts.notes,
      isFavorite: beautyProducts.isFavorite,
      imageId: beautyProducts.imageId,
      imageWidth: images.width,
      imageHeight: images.height,
      createdAt: beautyProducts.createdAt,
      updatedAt: beautyProducts.updatedAt,
    })
    .from(beautyProducts)
    .innerJoin(
      beautyCategories,
      eq(beautyProducts.categoryId, beautyCategories.id),
    )
    .innerJoin(images, eq(beautyProducts.imageId, images.id))
    .where(eq(beautyProducts.id, productId))
    .limit(1);

  if (results.length === 0) return null;

  const product = results[0];

  // Fetch variants and sign URLs
  const variants = await db
    .select()
    .from(imageVariants)
    .where(eq(imageVariants.imageId, product.imageId));

  let signedUrls: { signedUrl: string }[] = [];
  if (variants.length > 0) {
    const paths = variants.map((v) => v.storagePath);
    signedUrls = await getSignedImageUrls(paths);
  }

  return {
    ...product,
    variants: variants.map((v, i) => ({
      variantName: v.variantName,
      storagePath: v.storagePath,
      width: v.width,
      height: v.height,
      url: signedUrls[i]?.signedUrl ?? '',
    })),
  };
}

const createBeautyProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  brand: z.string().max(100, 'Brand too long').optional().nullable(),
  categoryId: z.string().uuid('Invalid category'),
  rating: z.number().int().min(0).max(5),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
  imageId: z.string().uuid('Invalid image'),
});

export async function createBeautyProduct(data: {
  name: string;
  brand?: string | null;
  categoryId: string;
  rating: number;
  notes?: string | null;
  imageId: string;
}) {
  const parsed = createBeautyProductSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const [created] = await db
    .insert(beautyProducts)
    .values({
      name: parsed.data.name,
      brand: parsed.data.brand ?? null,
      categoryId: parsed.data.categoryId,
      rating: parsed.data.rating,
      notes: parsed.data.notes ?? null,
      imageId: parsed.data.imageId,
    })
    .returning();

  revalidatePath('/beauty');
  return created;
}

const updateBeautyProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .optional(),
  brand: z.string().max(100, 'Brand too long').optional().nullable(),
  categoryId: z.string().uuid('Invalid category').optional(),
  rating: z.number().int().min(0).max(5).optional(),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
});

export async function updateBeautyProduct(
  productId: string,
  data: {
    name?: string;
    brand?: string | null;
    categoryId?: string;
    rating?: number;
    notes?: string | null;
  },
) {
  const idParsed = uuidSchema.safeParse(productId);
  if (!idParsed.success) throw new Error('Invalid product ID');

  const parsed = updateBeautyProductSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const [updated] = await db
    .update(beautyProducts)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(beautyProducts.id, productId))
    .returning();

  revalidatePath('/beauty');
  return updated;
}

export async function deleteBeautyProduct(productId: string) {
  const parsed = uuidSchema.safeParse(productId);
  if (!parsed.success) throw new Error('Invalid product ID');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Find the product to get its imageId
  const [product] = await db
    .select()
    .from(beautyProducts)
    .where(eq(beautyProducts.id, productId))
    .limit(1);

  if (!product) throw new Error('Product not found');

  // Get variant storage paths for cleanup
  const variants = await db
    .select({ storagePath: imageVariants.storagePath })
    .from(imageVariants)
    .where(eq(imageVariants.imageId, product.imageId));

  // Delete from Supabase Storage (private bucket)
  if (variants.length > 0) {
    const paths = variants.map((v) => v.storagePath);
    await supabase.storage.from('private-images').remove(paths);
  }

  // Delete the product record first (references image via foreign key)
  await db.delete(beautyProducts).where(eq(beautyProducts.id, productId));

  // Then delete the image record (cascades to imageVariants via onDelete: cascade)
  await db.delete(images).where(eq(images.id, product.imageId));

  revalidatePath('/beauty');
  return { success: true };
}

export async function toggleFavorite(productId: string) {
  const parsed = uuidSchema.safeParse(productId);
  if (!parsed.success) throw new Error('Invalid product ID');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Fetch current product
  const [product] = await db
    .select()
    .from(beautyProducts)
    .where(eq(beautyProducts.id, productId))
    .limit(1);

  if (!product) throw new Error('Product not found');

  const [updated] = await db
    .update(beautyProducts)
    .set({
      isFavorite: product.isFavorite === 1 ? 0 : 1,
      updatedAt: new Date(),
    })
    .where(eq(beautyProducts.id, productId))
    .returning();

  revalidatePath('/beauty');
  return updated;
}

export async function searchBeautyProducts(query: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const results = await db
    .select({
      id: beautyProducts.id,
      name: beautyProducts.name,
      brand: beautyProducts.brand,
      imageId: beautyProducts.imageId,
    })
    .from(beautyProducts)
    .where(ilike(beautyProducts.name, `%${query}%`))
    .limit(10);

  return results;
}
