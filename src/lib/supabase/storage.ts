import { createClient } from '@/lib/supabase/server';

export async function getSignedImageUrl(path: string, expiresIn = 3600) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('private-images')
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

export async function getSignedImageUrls(paths: string[], expiresIn = 3600) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('private-images')
    .createSignedUrls(paths, expiresIn);

  if (error) throw new Error(`Signed URLs failed: ${error.message}`);
  return data;
}

export function getPublicImageUrl(bucket: string, path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
