'use server';

import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { images, imageVariants } from '@/lib/db/schema';

const SIZE_VARIANTS = [
  { name: 'thumb', width: 400 },
  { name: 'medium', width: 800 },
  { name: 'large', width: 1200 },
  { name: 'full', width: 1920 },
] as const;

const ALLOWED_FORMATS = ['jpeg', 'png', 'webp'];

export async function uploadImage(
  formData: FormData,
  options: { bucket: 'public-images' | 'private-images'; folder: string },
) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Extract file
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate file type by magic bytes using sharp
  const metadata = await sharp(buffer).metadata();
  if (!metadata.format || !ALLOWED_FORMATS.includes(metadata.format)) {
    throw new Error(
      `Invalid file type: ${metadata.format || 'unknown'}. Allowed: ${ALLOWED_FORMATS.join(', ')}`,
    );
  }

  const imageId = randomUUID();
  const originalWidth = metadata.width!;
  const originalHeight = metadata.height!;

  // Process each size variant
  const variantResults: {
    name: string;
    width: number;
    height: number;
    path: string;
    size: number;
  }[] = [];

  for (const variant of SIZE_VARIANTS) {
    // Skip if variant width >= original width AND variant is not "full"
    if (variant.width >= originalWidth && variant.name !== 'full') {
      continue;
    }

    const processed = await sharp(buffer)
      .resize(variant.width, undefined, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const processedMeta = await sharp(processed).metadata();
    const storagePath = `${options.folder}/${imageId}/${variant.name}.webp`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(storagePath, processed, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    variantResults.push({
      name: variant.name,
      width: processedMeta.width!,
      height: processedMeta.height!,
      path: storagePath,
      size: processed.length,
    });
  }

  // Insert image record
  await db.insert(images).values({
    id: imageId,
    originalName: file.name,
    bucket: options.bucket,
    folder: options.folder,
    width: originalWidth,
    height: originalHeight,
    format: metadata.format!,
    uploadedBy: user.id,
  });

  // Insert variant records
  for (const variant of variantResults) {
    await db.insert(imageVariants).values({
      imageId,
      variantName: variant.name,
      width: variant.width,
      height: variant.height,
      storagePath: variant.path,
      sizeBytes: variant.size,
    });
  }

  // Build a preview URL for the thumb variant
  const thumbVariant =
    variantResults.find((v) => v.name === 'thumb') ?? variantResults[0];
  let previewUrl: string | undefined;
  if (thumbVariant) {
    if (options.bucket === 'public-images') {
      previewUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${options.bucket}/${thumbVariant.path}`;
    } else {
      const { data } = await supabase.storage
        .from(options.bucket)
        .createSignedUrl(thumbVariant.path, 3600);
      previewUrl = data?.signedUrl;
    }
  }

  return { imageId, variants: variantResults, previewUrl };
}
