import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const storageSource = fs.readFileSync(
  path.resolve(__dirname, '../../lib/supabase/storage.ts'),
  'utf-8',
);

describe('Signed URL helpers - source code verification', () => {
  it('uses createSignedUrl for single URL generation', () => {
    expect(storageSource).toContain('createSignedUrl');
  });

  it('uses createSignedUrls for batch URL generation', () => {
    expect(storageSource).toContain('createSignedUrls');
  });

  it('targets the private-images bucket', () => {
    expect(storageSource).toContain('private-images');
  });

  it('exports getSignedImageUrl function', () => {
    expect(storageSource).toContain('export async function getSignedImageUrl');
  });

  it('exports getSignedImageUrls function', () => {
    expect(storageSource).toContain('export async function getSignedImageUrls');
  });

  it('exports getPublicImageUrl function', () => {
    expect(storageSource).toContain('export function getPublicImageUrl');
  });
});
