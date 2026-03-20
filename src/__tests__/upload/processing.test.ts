import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const uploadSource = fs.readFileSync(
  path.resolve(__dirname, '../../actions/upload.ts'),
  'utf-8',
);

describe('Upload Server Action - source code verification', () => {
  it('validates file type using sharp magic bytes', () => {
    expect(uploadSource).toContain('sharp(buffer).metadata()');
  });

  it('defines all four variant names', () => {
    expect(uploadSource).toContain("'thumb'");
    expect(uploadSource).toContain("'medium'");
    expect(uploadSource).toContain("'large'");
    expect(uploadSource).toContain("'full'");
  });

  it('defines correct variant widths', () => {
    expect(uploadSource).toContain('400');
    expect(uploadSource).toContain('800');
    expect(uploadSource).toContain('1200');
    expect(uploadSource).toContain('1920');
  });

  it('converts to WebP with quality 80', () => {
    expect(uploadSource).toContain('.webp({ quality: 80 })');
  });

  it('prevents upscaling with withoutEnlargement', () => {
    expect(uploadSource).toContain('withoutEnlargement: true');
  });

  it('inserts into images and imageVariants tables', () => {
    expect(uploadSource).toContain('db.insert(images)');
    expect(uploadSource).toContain('db.insert(imageVariants)');
  });

  it('checks authentication with getUser', () => {
    expect(uploadSource).toContain('auth.getUser()');
  });
});
