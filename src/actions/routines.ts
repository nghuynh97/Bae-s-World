'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import {
  routines,
  routineSteps,
  beautyProducts,
  images,
  imageVariants,
} from '@/lib/db/schema';
import { eq, asc, inArray, and, max } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getSignedImageUrls } from '@/lib/supabase/storage';

const uuidSchema = z.string().uuid();

export type RoutineWithSteps = {
  id: string;
  name: string;
  slug: string;
  steps: {
    id: string;
    stepOrder: number;
    product: {
      id: string;
      name: string;
      brand: string | null;
      thumbnailUrl: string;
    };
  }[];
};

export async function getRoutinesWithSteps(): Promise<RoutineWithSteps[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Fetch all routines ordered by displayOrder
  const allRoutines = await db
    .select()
    .from(routines)
    .orderBy(asc(routines.displayOrder));

  if (allRoutines.length === 0) return [];

  // Fetch all routine steps with product and image info
  const routineIds = allRoutines.map((r) => r.id);
  const allSteps = await db
    .select({
      id: routineSteps.id,
      routineId: routineSteps.routineId,
      stepOrder: routineSteps.stepOrder,
      productId: beautyProducts.id,
      productName: beautyProducts.name,
      productBrand: beautyProducts.brand,
      imageId: beautyProducts.imageId,
    })
    .from(routineSteps)
    .innerJoin(beautyProducts, eq(routineSteps.productId, beautyProducts.id))
    .where(inArray(routineSteps.routineId, routineIds))
    .orderBy(asc(routineSteps.stepOrder));

  // Fetch thumb variants for all product images (fallback: medium → large → full)
  const imageIds = [...new Set(allSteps.map((s) => s.imageId))];
  let thumbUrlByImageId: Record<string, string> = {};

  if (imageIds.length > 0) {
    const allVariants = await db
      .select()
      .from(imageVariants)
      .where(inArray(imageVariants.imageId, imageIds));

    // Pick best variant per image: thumb > medium > large > full
    const preferenceOrder = ['thumb', 'medium', 'large', 'full'];
    const bestVariantByImageId: Record<string, (typeof allVariants)[0]> = {};
    for (const v of allVariants) {
      const current = bestVariantByImageId[v.imageId];
      if (
        !current ||
        preferenceOrder.indexOf(v.variantName) <
          preferenceOrder.indexOf(current.variantName)
      ) {
        bestVariantByImageId[v.imageId] = v;
      }
    }

    const bestVariants = Object.values(bestVariantByImageId);
    if (bestVariants.length > 0) {
      const paths = bestVariants.map((v) => v.storagePath);
      const signedUrls = await getSignedImageUrls(paths);

      for (let i = 0; i < bestVariants.length; i++) {
        thumbUrlByImageId[bestVariants[i].imageId] =
          signedUrls[i]?.signedUrl ?? '';
      }
    }
  }

  // Assemble result
  return allRoutines.map((routine) => ({
    id: routine.id,
    name: routine.name,
    slug: routine.slug,
    steps: allSteps
      .filter((s) => s.routineId === routine.id)
      .map((s) => ({
        id: s.id,
        stepOrder: s.stepOrder,
        product: {
          id: s.productId,
          name: s.productName,
          brand: s.productBrand,
          thumbnailUrl: thumbUrlByImageId[s.imageId] ?? '',
        },
      })),
  }));
}

export async function addRoutineStep(routineId: string, productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const routineIdParsed = uuidSchema.safeParse(routineId);
  if (!routineIdParsed.success) throw new Error('Invalid routine ID');

  const productIdParsed = uuidSchema.safeParse(productId);
  if (!productIdParsed.success) throw new Error('Invalid product ID');

  // Calculate next stepOrder
  const [maxResult] = await db
    .select({ maxOrder: max(routineSteps.stepOrder) })
    .from(routineSteps)
    .where(eq(routineSteps.routineId, routineId));

  const nextOrder = maxResult?.maxOrder != null ? maxResult.maxOrder + 1 : 0;

  const [created] = await db
    .insert(routineSteps)
    .values({
      routineId,
      productId,
      stepOrder: nextOrder,
    })
    .returning();

  revalidatePath('/beauty');
  return created;
}

export async function removeRoutineStep(stepId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const parsed = uuidSchema.safeParse(stepId);
  if (!parsed.success) throw new Error('Invalid step ID');

  await db.delete(routineSteps).where(eq(routineSteps.id, stepId));

  revalidatePath('/beauty');
  return { success: true };
}

const reorderSchema = z.object({
  routineId: z.string().uuid(),
  stepIds: z.array(z.string().uuid()),
});

export async function reorderRoutineSteps(
  routineId: string,
  stepIds: string[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const parsed = reorderSchema.safeParse({ routineId, stepIds });
  if (!parsed.success) throw new Error('Invalid input');

  for (let i = 0; i < stepIds.length; i++) {
    await db
      .update(routineSteps)
      .set({ stepOrder: i })
      .where(
        and(
          eq(routineSteps.id, stepIds[i]),
          eq(routineSteps.routineId, routineId),
        ),
      );
  }

  revalidatePath('/beauty');
  return { success: true };
}
