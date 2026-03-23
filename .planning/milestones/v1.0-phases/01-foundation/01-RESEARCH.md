# Phase 1: Foundation - Research

**Researched:** 2026-03-19
**Domain:** Project scaffolding, design system, authentication, image upload pipeline, route protection
**Confidence:** HIGH

## Summary

Phase 1 establishes the entire technical foundation for Funnghy's World: a Next.js 16 App Router project with Supabase (Auth, Database, Storage), Drizzle ORM, Tailwind CSS v4 design tokens, shadcn/ui components, and a server-side image optimization pipeline using sharp. The two-user authentication model uses Supabase Auth with a custom invite-code setup flow, where pre-generated codes allow Funnghy and her boyfriend to create their own accounts. Private images are served through Supabase Storage signed URLs with expiration, while public portfolio images use standard public bucket URLs.

The critical architectural decision is the public/private route split via Next.js route groups `(public)` and `(private)`, enforced by middleware calling `supabase.auth.getUser()`. The design system is defined entirely via Tailwind CSS v4 `@theme` directive with CSS custom properties -- the UI-SPEC provides exact hex values, font choices, spacing scales, and shadow definitions that map directly to theme tokens.

**Primary recommendation:** Build in this order: (1) scaffold Next.js + Supabase + Drizzle, (2) design tokens + shadcn/ui init + base layout components, (3) auth with invite-code flow, (4) image upload pipeline with sharp processing, (5) dashboard page. Every subsequent phase builds on these foundations.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Primary accent: soft blush rose gold (#E8B4B8) -- lighter, more pink than gold, delicate and airy
- Background: cool white with hint of lavender (#F8F6FF) -- fresh and modern
- Cards/surfaces: white or very subtle tint against the cool background
- Shadows: soft, blush-tinted -- not stark gray
- Overall vibe: soft feminine, elegant, premium -- like a fashion editorial meets personal journal
- Headings: Playfair Display serif font -- editorial, fashion-magazine feel
- "Funnghy's World" logo text rendered in the heading serif with rose gold color
- Gently rounded elements -- medium border radius (not pill-shaped, not sharp corners)
- Simple centered login form on cool white background -- minimal and elegant
- First-visit setup flow: user enters invite code, then creates own password
- Two invite codes pre-generated (one for Funnghy, one for boyfriend)
- After first setup, normal email/password login
- Dashboard with quick-access cards linking to Portfolio, Beauty Tracker, and Journal
- Combined drag-and-drop zone + click-to-browse (zone is clickable) for image upload
- Batch upload supported -- select or drop multiple photos at once
- Per-photo progress bars during upload
- No file size limit -- accept any size, optimize server-side
- Accepted formats: JPEG, PNG, WebP (research may add HEIC)
- Automatic optimization on upload: generate WebP/AVIF variants + multiple responsive sizes
- Private images (journal, beauty tracker) require authentication to access
- Desktop: top horizontal nav bar -- logo left, nav links right
- Mobile: bottom tab bar (like Instagram) -- fixed, easy thumb reach
- Private sections hidden from public nav entirely (not shown with lock icon)

### Claude's Discretion

- Exact body font choice (should complement the serif heading font) -- **Recommendation: Inter** (confirmed in UI-SPEC)
- Loading skeleton design and placement
- Error state styling (form validation, upload failures)
- Exact spacing scale and typography size scale
- Session duration / remember-me behavior
- Invite code format and validation UX
- Dashboard card layout specifics (2x2 grid, stacked, etc.)

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                                    | Research Support                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| AUTH-01 | Funnghy can log in with email and password                                                                     | Supabase Auth email/password signIn, @supabase/ssr cookie sessions                                      |
| AUTH-02 | Boyfriend can log in with email and password (separate account)                                                | Same auth system, two accounts created via invite-code setup flow                                       |
| AUTH-03 | User sessions persist across browser refresh                                                                   | @supabase/ssr stores sessions in httpOnly cookies, middleware refreshes tokens                          |
| AUTH-04 | Public portfolio pages are accessible without login                                                            | Route groups (public)/(private), middleware matcher excludes public paths                               |
| AUTH-05 | Private sections (beauty tracker, photo journal) require login                                                 | Middleware calls supabase.auth.getUser(), redirects to /login if null                                   |
| DESG-01 | App uses soft feminine design system -- pastel tones, rose gold accents, cream backgrounds, elegant typography | Tailwind v4 @theme tokens from UI-SPEC, Playfair Display + Inter fonts                                  |
| DESG-02 | All pages are fully responsive on mobile and desktop                                                           | Two breakpoints (mobile <768px bottom tab, desktop >=768px top nav), shadcn components                  |
| DESG-03 | Images automatically optimized for fast loading (WebP/AVIF, lazy loading, responsive sizes)                    | sharp processing on upload generates variants; next/image for delivery with lazy loading                |
| IMG-01  | Users can upload images (JPEG, PNG, WebP) with automatic optimization                                          | Server Action receives files, sharp processes to WebP/AVIF + multiple sizes, stores in Supabase Storage |
| IMG-02  | Uploaded images generate multiple size variants for responsive display                                         | sharp generates thumbnail (400w), medium (800w), large (1200w), full (1920w) variants                   |
| IMG-03  | Private images only accessible to authenticated users                                                          | Private Supabase Storage bucket + signed URLs with expiration for private images                        |
| IMG-04  | Image upload supports drag-and-drop and file picker                                                            | react-dropzone 15.x headless component with custom UI matching design system                            |

</phase_requirements>

## Standard Stack

### Core

| Library               | Version | Purpose                              | Why Standard                                                                                                   |
| --------------------- | ------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Next.js               | 16.2.0  | Full-stack React framework           | App Router, Server Components, Server Actions, built-in image optimization via next/image, middleware for auth |
| React                 | 19.x    | UI library                           | Ships with Next.js 16, concurrent rendering, server components                                                 |
| TypeScript            | 5.7+    | Type safety                          | Catches schema mismatches at compile time, ships with create-next-app                                          |
| Supabase (hosted)     | Latest  | Database (PostgreSQL), Auth, Storage | Single service for auth + database + file storage with RLS, eliminates 3-4 separate tools                      |
| @supabase/supabase-js | 2.99.2  | Client-side Supabase SDK             | Database queries, storage uploads, auth operations                                                             |
| @supabase/ssr         | 0.9.0   | Server-side Supabase client          | Cookie-based auth sessions for Next.js App Router middleware and server components                             |
| Drizzle ORM           | 0.45.1  | Type-safe database queries           | 90% smaller bundle than Prisma, SQL-like query builder, works with Supabase PostgreSQL                         |
| drizzle-kit           | Latest  | Migrations & schema management       | `drizzle-kit push` for dev, `drizzle-kit generate` + `drizzle-kit migrate` for production                      |
| Tailwind CSS          | 4.x     | Styling                              | CSS-first configuration with @theme directive, design tokens as CSS custom properties                          |
| shadcn/ui             | CLI v4  | Component primitives                 | Copy-paste components customized to design tokens, built on Radix UI                                           |

### Supporting

| Library             | Version             | Purpose                             | When to Use                                                              |
| ------------------- | ------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| sharp               | 0.34.5              | Server-side image processing        | Generate thumbnails and format variants (WebP/AVIF) on upload            |
| react-dropzone      | 15.0.0              | File upload UX                      | Headless drag-and-drop zone, handles file validation, multiple files     |
| zod                 | 4.3.6               | Schema validation                   | Validate form inputs (login, invite code, upload metadata)               |
| react-hook-form     | 7.71.2              | Form management                     | Login form, invite code form, upload metadata forms                      |
| @hookform/resolvers | Latest              | Zod integration for react-hook-form | Type-safe form validation                                                |
| postgres            | Latest              | PostgreSQL driver for Drizzle       | Connection to Supabase PostgreSQL (Session Mode, port 5432)              |
| Lucide React        | Latest (via shadcn) | Icons                               | Ships with shadcn/ui, used for nav icons, upload icon, status indicators |

### Alternatives Considered

| Instead of          | Could Use                      | Tradeoff                                                                                                                                          |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase Auth       | NextAuth.js / Auth.js          | Unnecessary extra layer -- Supabase Auth handles email/password with RLS. Adding NextAuth creates confusion about which system is authoritative   |
| Supabase Storage    | Cloudinary                     | Cloudinary offers advanced transforms but adds a third-party dependency. Supabase Storage is included free. Migrate to Cloudinary later if needed |
| sharp (server-side) | Supabase Image Transformations | Supabase transforms are Pro plan only ($25/mo). sharp is free, runs in Server Actions                                                             |
| Drizzle ORM         | Prisma                         | Prisma has 3-6x larger bundle and slower cold starts on serverless. For two users, Drizzle's lighter footprint wins                               |

**Installation:**

```bash
# Create Next.js project
npx create-next-app@latest funnghy-world --typescript --tailwind --app --turbopack

# Core dependencies
npm install @supabase/supabase-js @supabase/ssr drizzle-orm postgres

# Image handling
npm install sharp react-dropzone

# Forms & validation
npm install react-hook-form zod @hookform/resolvers

# Dev dependencies
npm install -D drizzle-kit @types/node
```

```bash
# Initialize shadcn/ui (after project setup)
npx shadcn@latest init
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group: no auth required
│   │   ├── page.tsx              # Portfolio placeholder / landing
│   │   ├── about/
│   │   │   └── page.tsx          # About page placeholder
│   │   └── layout.tsx            # Public layout (simplified nav)
│   ├── (private)/                # Route group: auth required
│   │   ├── layout.tsx            # Private layout (full nav + bottom tabs)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard with quick-access cards
│   │   └── upload/
│   │       └── page.tsx          # Image upload testing page
│   ├── (auth)/                   # Route group: auth pages
│   │   ├── login/
│   │   │   └── page.tsx          # Login form
│   │   └── setup/
│   │       └── page.tsx          # Invite code setup flow
│   ├── layout.tsx                # Root layout (fonts, providers)
│   └── globals.css               # @theme tokens + base styles
├── components/
│   ├── ui/                       # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── top-nav.tsx           # Desktop navigation bar
│   │   ├── bottom-tab-bar.tsx    # Mobile bottom tab bar
│   │   ├── logo-text.tsx         # "Funnghy's World" branded text
│   │   └── user-menu.tsx         # Avatar dropdown with logout
│   ├── auth/
│   │   ├── login-form.tsx        # Email/password login form
│   │   ├── invite-code-input.tsx # 6-char invite code input
│   │   └── setup-form.tsx        # Account creation after invite code
│   ├── upload/
│   │   ├── image-uploader.tsx    # Drag-and-drop upload zone
│   │   └── upload-progress.tsx   # Per-file progress bars
│   └── dashboard/
│       └── dashboard-card.tsx    # Quick-access card with preview
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Component Supabase client
│   │   └── middleware.ts         # Middleware Supabase client
│   ├── db/
│   │   ├── index.ts              # Drizzle client singleton
│   │   └── schema.ts             # Drizzle schema definitions
│   └── utils.ts                  # Shared utilities (cn helper, etc.)
├── actions/
│   ├── auth.ts                   # Login, signup, invite code validation
│   └── upload.ts                 # Image upload + sharp processing
├── types/
│   └── index.ts                  # Shared TypeScript types
└── middleware.ts                  # Auth middleware (route protection)
```

### Pattern 1: Supabase SSR Auth with Middleware

**What:** Three separate Supabase client factories (browser, server, middleware) that handle cookie-based session management. Middleware refreshes expired tokens on every request.
**When to use:** Every authenticated route, every server component that needs user context.

**Example:**

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Use getUser(), not getSession()
  // getUser() sends a request to Supabase Auth server to revalidate
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect private routes
  if (
    (!user && request.nextUrl.pathname.startsWith('/dashboard')) ||
    request.nextUrl.pathname.startsWith('/beauty') ||
    request.nextUrl.pathname.startsWith('/journal') ||
    request.nextUrl.pathname.startsWith('/upload')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// middleware.ts (root)
import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Source:** [Supabase SSR Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Pattern 2: Invite Code Setup Flow

**What:** Custom invite-code-based account creation. Pre-generated codes are stored in the database. User enters code, validates it, then creates email/password account via Supabase Auth signUp.
**When to use:** First-time account setup for the two users.

**Example:**

```typescript
// actions/auth.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { inviteCodes, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function validateInviteCode(code: string) {
  const result = await db
    .select()
    .from(inviteCodes)
    .where(eq(inviteCodes.code, code.toUpperCase()))
    .limit(1);

  if (result.length === 0 || result[0].usedAt !== null) {
    return {
      valid: false,
      error:
        "That code doesn't look right. Check the code you received and try again.",
    };
  }
  return { valid: true, name: result[0].assignedName };
}

export async function setupAccount(
  code: string,
  email: string,
  password: string,
) {
  const supabase = await createClient();

  // Validate code again (server-side)
  const codeResult = await validateInviteCode(code);
  if (!codeResult.valid) return { error: codeResult.error };

  // Create Supabase Auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: codeResult.name } },
  });

  if (error) return { error: error.message };

  // Mark invite code as used
  await db
    .update(inviteCodes)
    .set({ usedAt: new Date(), usedByAuthId: data.user!.id })
    .where(eq(inviteCodes.code, code.toUpperCase()));

  // Create profile record
  await db.insert(profiles).values({
    authId: data.user!.id,
    displayName: codeResult.name!,
    email,
  });

  return { success: true };
}
```

### Pattern 3: Image Upload with Server-Side Sharp Processing

**What:** Client uploads raw files via react-dropzone. Server Action receives files, processes them with sharp to generate multiple size variants in WebP format, uploads all variants to Supabase Storage, and stores metadata in the database.
**When to use:** Every image upload in the app.

**Example:**

```typescript
// actions/upload.ts
'use server';

import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { images, imageVariants } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

const SIZE_VARIANTS = [
  { name: 'thumb', width: 400 },
  { name: 'medium', width: 800 },
  { name: 'large', width: 1200 },
  { name: 'full', width: 1920 },
] as const;

export async function uploadImage(
  formData: FormData,
  options: {
    bucket: 'public-images' | 'private-images';
    folder: string;
  },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  // Validate file type by checking magic bytes (not just extension)
  const buffer = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
    throw new Error('Unsupported image format');
  }

  const imageId = randomUUID();
  const variants: Array<{
    name: string;
    width: number;
    height: number;
    path: string;
    size: number;
  }> = [];

  // Generate size variants in WebP
  for (const variant of SIZE_VARIANTS) {
    // Skip variants larger than original
    if (
      metadata.width &&
      variant.width >= metadata.width &&
      variant.name !== 'full'
    )
      continue;

    const processed = await sharp(buffer)
      .resize(variant.width, undefined, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const path = `${options.folder}/${imageId}/${variant.name}.webp`;
    const { error } = await supabase.storage
      .from(options.bucket)
      .upload(path, processed, { contentType: 'image/webp' });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const resizedMeta = await sharp(processed).metadata();
    variants.push({
      name: variant.name,
      width: resizedMeta.width!,
      height: resizedMeta.height!,
      path,
      size: processed.length,
    });
  }

  // Store metadata in database
  const [image] = await db
    .insert(images)
    .values({
      id: imageId,
      originalName: file.name,
      bucket: options.bucket,
      folder: options.folder,
      width: metadata.width!,
      height: metadata.height!,
      format: metadata.format,
      uploadedBy: user.id,
    })
    .returning();

  for (const v of variants) {
    await db.insert(imageVariants).values({
      imageId: image.id,
      variantName: v.name,
      width: v.width,
      height: v.height,
      storagePath: v.path,
      sizeBytes: v.size,
    });
  }

  return { imageId: image.id, variants };
}
```

### Pattern 4: Design Tokens via Tailwind v4 @theme

**What:** All design values defined in globals.css using the `@theme` directive. Tailwind generates utility classes from these tokens. shadcn/ui components inherit the tokens automatically.
**When to use:** The single source of truth for all visual properties.

**Example (from UI-SPEC, production-ready):**

```css
/* globals.css */
@import 'tailwindcss';

@theme {
  --color-dominant: #f8f6ff;
  --color-surface: #ffffff;
  --color-accent: #e8b4b8;
  --color-accent-hover: #d4a0a5;
  --color-destructive: #dc2626;
  --color-success: #059669;

  --color-text-primary: #2d2235;
  --color-text-secondary: #6b5f76;
  --color-border: #e8e4ee;
  --color-border-accent: #e8b4b8;
  --color-bg-hover: #f0ecf5;
  --color-shadow: rgba(232, 180, 184, 0.12);

  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --shadow-sm: 0 1px 3px rgba(232, 180, 184, 0.08);
  --shadow-md: 0 4px 12px rgba(232, 180, 184, 0.12);
  --shadow-lg: 0 8px 24px rgba(232, 180, 184, 0.16);
}
```

**Source:** [UI-SPEC design token reference](../01-foundation/01-UI-SPEC.md) + [Tailwind v4 @theme docs](https://tailwindcss.com/blog/tailwindcss-v4)

### Pattern 5: Private Image Serving via Signed URLs

**What:** Private images stored in a non-public Supabase Storage bucket. When rendering pages, server creates time-limited signed URLs. URLs expire after a set duration, preventing link sharing.
**When to use:** Journal and beauty tracker images.

**Example:**

```typescript
// lib/supabase/storage.ts
import { createClient } from '@/lib/supabase/server';

export async function getSignedImageUrl(path: string, expiresIn = 3600) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('private-images')
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

// For batch operations (many images on one page)
export async function getSignedImageUrls(paths: string[], expiresIn = 3600) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from('private-images')
    .createSignedUrls(paths, expiresIn);

  if (error) throw new Error(`Signed URLs failed: ${error.message}`);
  return data;
}
```

**Source:** [Supabase Storage Signed URLs](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl)

### Anti-Patterns to Avoid

- **Client-side auth checking only:** Using `useSession()` to hide UI without server-side enforcement. Anyone can call Server Actions or visit private URLs directly. Always verify with `supabase.auth.getUser()` in middleware AND in Server Actions.
- **Using `getSession()` in server code:** Supabase docs explicitly warn: never trust `getSession()` in middleware or server components. It reads from cookies without revalidating. Use `getUser()` which hits the Supabase Auth server.
- **Storing images in public bucket when they should be private:** All journal and beauty tracker images go in a private bucket. Only portfolio images go in a public bucket.
- **Raw hex values in component code:** Every color, radius, shadow, and spacing value must come from the @theme tokens or Tailwind utilities. Zero hardcoded values outside globals.css.

## Don't Hand-Roll

| Problem                          | Don't Build                              | Use Instead                      | Why                                                                                 |
| -------------------------------- | ---------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| Authentication                   | Custom JWT + bcrypt + session cookies    | Supabase Auth + @supabase/ssr    | Session management, token refresh, cookie security are easy to get wrong            |
| Drag-and-drop file upload        | Custom dragenter/dragleave/drop handlers | react-dropzone 15.x              | Edge cases with browser drag events, file validation, multiple files                |
| Image resizing/format conversion | Canvas API or custom ffmpeg pipeline     | sharp 0.34.5                     | sharp uses libvips (C library), 4-5x faster than ImageMagick, handles EXIF rotation |
| Form validation                  | Custom useState + regex patterns         | zod + react-hook-form            | Type inference, error messages, async validation, nested objects                    |
| Database migrations              | Raw SQL scripts                          | drizzle-kit                      | Tracks schema changes, generates migration SQL, handles conflicts                   |
| Accessible UI primitives         | Custom dialog/dropdown/navigation        | shadcn/ui (Radix UI)             | ARIA attributes, focus trapping, keyboard navigation, screen reader support         |
| Cookie session management        | Custom cookie read/write in middleware   | @supabase/ssr createServerClient | Handles token refresh, cookie chunking for large JWTs, PKCE flow                    |

**Key insight:** This phase is infrastructure -- the value is in wiring together proven tools correctly, not in building custom implementations. Every "don't hand-roll" item has hidden edge cases that have already been solved by the recommended library.

## Common Pitfalls

### Pitfall 1: Using getSession() Instead of getUser() in Server Code

**What goes wrong:** Auth tokens appear valid but are actually expired or tampered with. Private routes serve data to unauthorized users.
**Why it happens:** `getSession()` reads from cookies without server verification. Many tutorials use it incorrectly.
**How to avoid:** Always use `supabase.auth.getUser()` in middleware and Server Actions. It hits the Supabase Auth server to revalidate.
**Warning signs:** Users remain "logged in" after session should have expired; auth checks pass without network requests.

### Pitfall 2: Supabase Storage Image Transforms Are Pro Plan Only

**What goes wrong:** Developer expects Supabase to handle image resizing on delivery (like Cloudinary), discovers it requires a $25/mo Pro plan upgrade.
**Why it happens:** The feature exists in Supabase docs without prominently noting the plan restriction.
**How to avoid:** Process images with sharp in Server Actions at upload time. Generate all needed size variants before storing. This works on the free tier.
**Warning signs:** Planning to use `?width=400&height=300` query parameters on Supabase Storage URLs without a Pro plan.

### Pitfall 3: Missing Server-Side File Type Validation

**What goes wrong:** Malicious files bypass client-side validation (MIME type can be spoofed). Non-image files stored in the bucket.
**Why it happens:** Client-side react-dropzone `accept` prop only validates by extension/MIME type.
**How to avoid:** In the Server Action, pass the buffer through `sharp(buffer).metadata()`. If sharp cannot read it or the format is not in the allowlist, reject the upload. This validates actual file content (magic bytes).
**Warning signs:** Only checking `file.type` or file extension in the upload handler.

### Pitfall 4: Not Storing Image Dimensions at Upload Time

**What goes wrong:** Gallery pages suffer Cumulative Layout Shift (CLS) because image aspect ratios are unknown until the image loads. Layout jumps and reflows.
**Why it happens:** Dimensions seem unnecessary when you already have the image URL.
**How to avoid:** Extract width/height from `sharp(buffer).metadata()` during upload. Store in the database. Use dimensions to set `aspect-ratio` CSS on containers before images load.
**Warning signs:** CLS score above 0.1; images "pop in" and push content around.

### Pitfall 5: Invite Code Flow Creating Users Without Disabling Public Signup

**What goes wrong:** Anyone can create an account via Supabase Auth signUp endpoint, bypassing the invite code entirely.
**Why it happens:** Supabase Auth allows public signups by default.
**How to avoid:** Disable public signup in Supabase Dashboard (Authentication > Settings > Enable sign up = OFF). Then use the admin API (`supabase.auth.admin.createUser()`) in the setup Server Action with the service_role key. This ensures only invite-code holders can create accounts.
**Warning signs:** The signUp endpoint works without an invite code; unknown users appearing in the auth.users table.

### Pitfall 6: Forgetting to Set Up CORS / remotePatterns for next/image

**What goes wrong:** next/image refuses to optimize images from Supabase Storage URLs. Images either break or bypass optimization entirely.
**Why it happens:** next/image requires explicit allowlisting of external image domains in next.config.
**How to avoid:** Add Supabase Storage domain to `images.remotePatterns` in next.config.ts:

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};
```

**Warning signs:** Broken image icons; `next/image` error messages in console about unconfigured hostnames.

## Code Examples

### Supabase Client Factories (Three Required Clients)

```typescript
// lib/supabase/client.ts -- Browser client
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// lib/supabase/server.ts -- Server Component / Server Action client
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* Server Component: cookies are read-only */
          }
        },
      },
    },
  );
}

// lib/supabase/admin.ts -- Service role client (for invite code flow)
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
```

**Source:** [Supabase SSR Client Setup](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

### Drizzle Schema (Foundation Tables)

```typescript
// lib/db/schema.ts
import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';

export const inviteCodes = pgTable('invite_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(), // e.g., "FNGH01"
  assignedName: text('assigned_name').notNull(), // e.g., "Funnghy"
  usedAt: timestamp('used_at'),
  usedByAuthId: text('used_by_auth_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: text('auth_id').notNull().unique(), // links to Supabase Auth user
  displayName: text('display_name').notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const images = pgTable('images', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalName: text('original_name').notNull(),
  bucket: text('bucket').notNull(), // "public-images" or "private-images"
  folder: text('folder').notNull(), // e.g., "portfolio", "journal", "beauty"
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  format: text('format').notNull(), // original format: jpeg, png, webp
  uploadedBy: text('uploaded_by').notNull(), // Supabase Auth user ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const imageVariants = pgTable('image_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageId: uuid('image_id')
    .notNull()
    .references(() => images.id, { onDelete: 'cascade' }),
  variantName: text('variant_name').notNull(), // "thumb", "medium", "large", "full"
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  storagePath: text('storage_path').notNull(), // path within the bucket
  sizeBytes: integer('size_bytes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Drizzle Configuration

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Supabase Session Mode connection string (port 5432)
  },
});
```

### React Dropzone Upload Component Pattern

```typescript
// components/upload/image-uploader.tsx (Client Component)
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "@/actions/upload";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

export function ImageUploader({ bucket, folder }: {
  bucket: "public-images" | "private-images";
  folder: string;
}) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    // Upload max 3 concurrent
    const queue = [...newFiles];
    const concurrent = 3;
    const executing: Promise<void>[] = [];

    for (const item of queue) {
      const promise = (async () => {
        setFiles((prev) =>
          prev.map((f) => f.file === item.file ? { ...f, status: "uploading", progress: 50 } : f)
        );
        try {
          const formData = new FormData();
          formData.append("file", item.file);
          await uploadImage(formData, { bucket, folder });
          setFiles((prev) =>
            prev.map((f) => f.file === item.file ? { ...f, status: "complete", progress: 100 } : f)
          );
        } catch (err) {
          setFiles((prev) =>
            prev.map((f) => f.file === item.file
              ? { ...f, status: "error", error: (err as Error).message }
              : f
            )
          );
        }
      })();
      executing.push(promise);
      if (executing.length >= concurrent) {
        await Promise.race(executing);
      }
    }
    await Promise.all(executing);
  }, [bucket, folder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-radius-lg p-2xl text-center cursor-pointer
        ${isDragActive ? "border-accent bg-accent/5" : "border-border"}`}
    >
      <input {...getInputProps()} />
      {/* Upload zone UI + progress bars */}
    </div>
  );
}
```

## State of the Art

| Old Approach                        | Current Approach                          | When Changed               | Impact                                                                      |
| ----------------------------------- | ----------------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| `@supabase/auth-helpers-nextjs`     | `@supabase/ssr` 0.9.0                     | 2024                       | Unified SSR package replaces framework-specific helpers                     |
| `tailwind.config.js` (JavaScript)   | `@theme` directive in CSS                 | Tailwind v4 (Jan 2025)     | All config in CSS, 5x faster builds, no JS config file                      |
| `next.config.js images.domains`     | `images.remotePatterns` in next.config.ts | Next.js 14+                | More flexible pattern matching, domains is deprecated                       |
| `framer-motion` package name        | `motion` package name                     | Motion v12 (2025)          | Renamed package, improved React 19 concurrent support                       |
| Cloudinary/S3 for all image storage | Supabase Storage with sharp processing    | Current                    | Free tier sufficient for small apps, fewer services to manage               |
| `getSession()` for auth checks      | `getUser()` for auth checks               | Supabase SSR best practice | getSession reads cookies without revalidation; getUser verifies server-side |

**Deprecated/outdated:**

- `@supabase/auth-helpers-nextjs`: Replaced by `@supabase/ssr`. Migration guide exists in Supabase docs.
- `tailwind.config.js`: Tailwind v4 uses CSS-first configuration. JavaScript config still works but is legacy.
- `images.domains` in next.config: Use `images.remotePatterns` instead.

## Open Questions

1. **HEIC Format Support**
   - What we know: User decisions mention "research may add HEIC". sharp supports HEIC/HEIF input but requires libheif.
   - What's unclear: Whether sharp's HEIC support works reliably in Vercel serverless functions (native library dependency).
   - Recommendation: Start with JPEG/PNG/WebP. Add HEIC in a later iteration after testing on the deployment platform. Flag as nice-to-have, not blocker.

2. **Supabase Auth: Disable Public Signup**
   - What we know: Must disable public signup so only invite-code holders can register. Supabase Dashboard has the setting.
   - What's unclear: Whether disabling signup still allows admin.createUser() to work (it should, since admin bypasses user-facing settings).
   - Recommendation: Test during implementation. If admin.createUser() is also blocked, use admin.inviteUserByEmail() as fallback.

3. **Upload File Size Handling for Very Large Images**
   - What we know: User wants "no file size limit -- accept any size, optimize server-side". Server Actions have a default body size limit (typically 4MB in Next.js).
   - What's unclear: Exact Next.js 16 Server Action body size limit and how to increase it.
   - Recommendation: Set `serverActions.bodySizeLimit` in next.config.ts to a high value (e.g., "50mb"). For extremely large files, consider a two-step approach: get signed upload URL from server, upload directly to Supabase Storage from client, then trigger processing.

## Validation Architecture

### Test Framework

| Property           | Value                                    |
| ------------------ | ---------------------------------------- |
| Framework          | Vitest 3.x + @testing-library/react      |
| Config file        | none -- Wave 0 (needs vitest.config.mts) |
| Quick run command  | `npx vitest run --reporter=verbose`      |
| Full suite command | `npx vitest run`                         |

### Phase Requirements to Test Map

| Req ID  | Behavior                                                | Test Type   | Automated Command                                                      | File Exists?                          |
| ------- | ------------------------------------------------------- | ----------- | ---------------------------------------------------------------------- | ------------------------------------- |
| AUTH-01 | Login with email/password                               | integration | `npx vitest run src/__tests__/auth/login.test.ts -t "login"`           | No -- Wave 0                          |
| AUTH-02 | Separate boyfriend account login                        | integration | `npx vitest run src/__tests__/auth/login.test.ts -t "boyfriend"`       | No -- Wave 0                          |
| AUTH-03 | Session persists across refresh                         | e2e/manual  | Manual: login, refresh browser, verify still authenticated             | Manual-only: requires browser session |
| AUTH-04 | Public routes accessible without login                  | unit        | `npx vitest run src/__tests__/middleware.test.ts -t "public"`          | No -- Wave 0                          |
| AUTH-05 | Private routes redirect to login                        | unit        | `npx vitest run src/__tests__/middleware.test.ts -t "private"`         | No -- Wave 0                          |
| DESG-01 | Soft feminine design system applied                     | manual      | Manual: visual inspection against UI-SPEC                              | Manual-only: visual verification      |
| DESG-02 | Responsive on mobile and desktop                        | manual      | Manual: resize viewport, verify layout changes                         | Manual-only: visual verification      |
| DESG-03 | Images optimized (WebP, lazy loading, responsive sizes) | unit        | `npx vitest run src/__tests__/upload/processing.test.ts -t "variants"` | No -- Wave 0                          |
| IMG-01  | Upload images with automatic optimization               | unit        | `npx vitest run src/__tests__/upload/processing.test.ts -t "upload"`   | No -- Wave 0                          |
| IMG-02  | Multiple size variants generated                        | unit        | `npx vitest run src/__tests__/upload/processing.test.ts -t "sizes"`    | No -- Wave 0                          |
| IMG-03  | Private images require auth                             | integration | `npx vitest run src/__tests__/storage/signed-urls.test.ts`             | No -- Wave 0                          |
| IMG-04  | Drag-and-drop and file picker                           | manual      | Manual: test drag-and-drop + click-to-browse in browser                | Manual-only: browser interaction      |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.mts` -- Vitest configuration with React plugin and path aliases
- [ ] `src/__tests__/setup.ts` -- Test setup file (jsdom environment, testing-library cleanup)
- [ ] `src/__tests__/auth/login.test.ts` -- Auth login flow tests
- [ ] `src/__tests__/middleware.test.ts` -- Route protection middleware tests
- [ ] `src/__tests__/upload/processing.test.ts` -- Image processing with sharp tests
- [ ] `src/__tests__/storage/signed-urls.test.ts` -- Private image signed URL tests
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths`

## Sources

### Primary (HIGH confidence)

- [Supabase SSR Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) -- middleware pattern, client factories, getUser() requirement
- [Supabase Storage Signed URLs API](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl) -- signed URL creation for private images
- [Supabase Auth Admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser) -- admin API for creating users server-side
- [Tailwind CSS v4 @theme](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first configuration, @theme directive
- [shadcn/ui Tailwind v4 support](https://ui.shadcn.com/docs/tailwind-v4) -- CLI v4, component compatibility
- [sharp documentation](https://sharp.pixelplumbing.com/) -- image processing API, format conversion, resize
- [Drizzle ORM with Supabase](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase) -- connection setup, schema definition
- [Next.js Testing with Vitest](https://nextjs.org/docs/app/guides/testing/vitest) -- official testing guide
- npm registry -- verified all package versions via `npm view` (2026-03-19)

### Secondary (MEDIUM confidence)

- [Supabase Creating SSR Client](https://supabase.com/docs/guides/auth/server-side/creating-a-client) -- three client factories pattern
- [react-dropzone docs](https://react-dropzone.js.org/) -- headless API, useDropzone hook
- [Drizzle ORM + Supabase guide (MakerKit)](https://makerkit.dev/blog/tutorials/drizzle-supabase) -- integration patterns
- [Building Scalable UI Systems with Tailwind v4 and shadcn/ui](https://dev.to/shoaibsid/building-scalable-ui-systems-with-tailwind-css-v4-and-shadcnui-11g0) -- @theme + shadcn integration

### Tertiary (LOW confidence)

- Supabase Image Transformations pricing (Pro plan restriction) -- confirmed feature exists but free tier availability unclear from docs alone. Recommendation to use sharp avoids this dependency entirely.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- All versions verified against npm registry on 2026-03-19. Stack decisions locked in CONTEXT.md and STACK.md.
- Architecture: HIGH -- Patterns sourced from official Supabase and Next.js documentation. Route group pattern is standard Next.js App Router.
- Auth flow: HIGH -- Supabase Auth email/password is well-documented. Invite code is custom but simple (validate code, admin.createUser, mark used).
- Image pipeline: HIGH -- sharp is the standard Node.js image processor, well-documented API. Supabase Storage upload is straightforward.
- Pitfalls: HIGH -- Sourced from official docs (getUser vs getSession), verified pricing constraints, confirmed magic byte validation pattern.
- Validation: MEDIUM -- Vitest + Next.js App Router testing has known limitations with async Server Components. Unit tests cover Server Actions; integration tests cover middleware. Visual/UX requirements need manual verification.

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable stack, no fast-moving dependencies)

**Important note on ARCHITECTURE.md discrepancy:** The project-level ARCHITECTURE.md references Prisma, SQLite, Cloudinary, and NextAuth.js. These are OUTDATED -- the actual stack decisions (per STACK.md and CONTEXT.md) use Drizzle ORM, Supabase PostgreSQL, Supabase Storage, and Supabase Auth. This research follows the correct stack decisions.
