"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { aboutContent, images, imageVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getPublicImageUrl } from "@/lib/supabase/storage";

export async function getAboutContent() {
  const results = await db
    .select()
    .from(aboutContent)
    .limit(1);

  if (results.length === 0) return null;

  const content = results[0];

  // If there's a profile image, fetch its variants
  let profileImage = null;
  if (content.profileImageId) {
    const [img] = await db
      .select()
      .from(images)
      .where(eq(images.id, content.profileImageId))
      .limit(1);

    if (img) {
      const variants = await db
        .select()
        .from(imageVariants)
        .where(eq(imageVariants.imageId, img.id));

      profileImage = {
        id: img.id,
        width: img.width,
        height: img.height,
        variants: variants.map((v) => ({
          variantName: v.variantName,
          storagePath: v.storagePath,
          width: v.width,
          height: v.height,
          url: getPublicImageUrl("public-images", v.storagePath),
        })),
      };
    }
  }

  return {
    id: content.id,
    bio: content.bio,
    email: content.email,
    instagramUrl: content.instagramUrl,
    tiktokUrl: content.tiktokUrl,
    profileImageId: content.profileImageId,
    profileImage,
    updatedAt: content.updatedAt,
  };
}

const updateAboutContentSchema = z.object({
  bio: z.string().max(2000, "Bio too long").optional(),
  email: z.string().email("Invalid email").optional().nullable(),
  instagramUrl: z.string().url("Invalid URL").optional().nullable(),
  tiktokUrl: z.string().url("Invalid URL").optional().nullable(),
  profileImageId: z.string().uuid("Invalid image").optional().nullable(),
});

export async function updateAboutContent(data: {
  bio?: string;
  email?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  profileImageId?: string | null;
}) {
  const parsed = updateAboutContentSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Upsert pattern: check if row exists
  const existing = await db.select({ id: aboutContent.id }).from(aboutContent).limit(1);

  const updateData = {
    ...parsed.data,
    updatedAt: new Date(),
  };

  if (existing.length === 0) {
    // Insert new row
    const [created] = await db
      .insert(aboutContent)
      .values({
        bio: parsed.data.bio ?? "",
        email: parsed.data.email ?? null,
        instagramUrl: parsed.data.instagramUrl ?? null,
        tiktokUrl: parsed.data.tiktokUrl ?? null,
        profileImageId: parsed.data.profileImageId ?? null,
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return created;
  }

  // Update existing row
  const [updated] = await db
    .update(aboutContent)
    .set(updateData)
    .where(eq(aboutContent.id, existing[0].id))
    .returning();

  revalidatePath("/about");
  revalidatePath("/admin/about");
  return updated;
}
