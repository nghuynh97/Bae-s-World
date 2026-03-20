import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function readSrc(filePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, '../../', filePath), 'utf-8');
}

describe('Auth login', () => {
  it('auth actions contain signInWithPassword call', () => {
    const content = readSrc('actions/auth.ts');
    expect(content).toContain('signInWithPassword');
  });

  it('auth actions contain zod validation with email and password', () => {
    const content = readSrc('actions/auth.ts');
    expect(content).toContain('.email(');
    expect(content).toContain('.min(8');
  });

  it('login-form uses react-hook-form useForm', () => {
    const content = readSrc('components/auth/login-form.tsx');
    expect(content).toContain('useForm');
  });

  it('login-form contains Sign In and Signing in... text', () => {
    const content = readSrc('components/auth/login-form.tsx');
    expect(content).toContain('Sign In');
    expect(content).toContain('Signing in...');
  });
});
