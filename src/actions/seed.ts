'use server';

import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { db } from '@/lib/db';
import {
  inviteCodes,
  profiles,
  images,
  imageVariants,
  categories,
  portfolioItems,
  aboutContent,
  beautyCategories,
  beautyProducts,
  routines,
  routineSteps,
  scheduleJobs,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

export async function isBoyfriend(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const [code] = await db
    .select()
    .from(inviteCodes)
    .where(eq(inviteCodes.assignedName, 'Boyfriend'))
    .limit(1);

  return code?.usedByAuthId === user.id;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchCatImage(): Promise<Buffer> {
  try {
    const res = await fetch('https://cataas.com/cat', { redirect: 'follow' });
    if (!res.ok) throw new Error(`cataas ${res.status}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } catch {
    return Buffer.from(
      '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsM' +
        'DYQFEA0eDxoNEhkSExQYFhAYGRoZHBwdHx8f/2wBDAQMEBAUEBQkFBQkfDUsNHx8fHx8fHx8fHx8f' +
        'Hx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/wAARCAABAAEDASIAAhEBAxEB/8QA' +
        'FAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAA' +
        'AAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA//9k=',
      'base64',
    );
  }
}

// ---------------------------------------------------------------------------
// Storage cleanup
// ---------------------------------------------------------------------------

async function cleanStorage() {
  const admin = createAdminClient();

  const { data: portfolioFiles } = await admin.storage
    .from('public-images')
    .list('portfolio');
  if (portfolioFiles && portfolioFiles.length > 0) {
    const paths = portfolioFiles.map((f) => `portfolio/${f.name}`);
    await admin.storage.from('public-images').remove(paths);
  }

  const { data: beautyFiles } = await admin.storage
    .from('private-images')
    .list('beauty');
  if (beautyFiles && beautyFiles.length > 0) {
    const paths = beautyFiles.map((f) => `beauty/${f.name}`);
    await admin.storage.from('private-images').remove(paths);
  }
}

// ---------------------------------------------------------------------------
// Reset all data (FK-safe order)
// ---------------------------------------------------------------------------

async function resetAllData() {
  await db.delete(routineSteps);
  await db.delete(portfolioItems);
  await db.delete(beautyProducts);
  await db.delete(imageVariants);
  await db.delete(images);
  await db.delete(routines);
  await db.delete(categories);
  await db.delete(beautyCategories);
  await db.delete(scheduleJobs);
  await db.delete(aboutContent);
}

// ---------------------------------------------------------------------------
// Seed Portfolio
// ---------------------------------------------------------------------------

async function seedPortfolio(uploadedBy: string) {
  const admin = createAdminClient();

  const catData = [
    { name: 'Modeling', slug: 'modeling', displayOrder: 0, isDefault: 1 },
    { name: 'Travel', slug: 'travel', displayOrder: 1, isDefault: 0 },
    { name: 'Beauty', slug: 'beauty', displayOrder: 2, isDefault: 0 },
  ];
  const insertedCats = await db
    .insert(categories)
    .values(catData)
    .returning();
  const catIds = insertedCats.map((c) => c.id);

  const itemCount = 22;
  for (let i = 0; i < itemCount; i++) {
    const buffer = await fetchCatImage();
    const uuid = crypto.randomUUID();
    const storagePath = `portfolio/${uuid}.webp`;

    await admin.storage
      .from('public-images')
      .upload(storagePath, buffer, { contentType: 'image/jpeg' });

    const [img] = await db
      .insert(images)
      .values({
        originalName: `cat-${i}.jpg`,
        bucket: 'public-images',
        folder: 'portfolio',
        width: 800,
        height: 600,
        format: 'jpeg',
        uploadedBy,
      })
      .returning();

    await db.insert(imageVariants).values({
      imageId: img.id,
      variantName: 'medium',
      width: 800,
      height: 600,
      storagePath,
      sizeBytes: buffer.length,
    });

    await db.insert(portfolioItems).values({
      title: `Cute Cat ${i + 1}`,
      description: '',
      categoryId: catIds[i % catIds.length],
      imageId: img.id,
      displayOrder: i,
    });

    await delay(100);
  }

  await db.insert(aboutContent).values({
    bio: '',
    email: null,
    instagramUrl: null,
    tiktokUrl: null,
    profileImageId: null,
  });
}

// ---------------------------------------------------------------------------
// Seed Beauty
// ---------------------------------------------------------------------------

async function seedBeauty(uploadedBy: string) {
  const admin = createAdminClient();

  const beautyCatData = [
    { name: 'Skincare', slug: 'skincare', displayOrder: 0, isDefault: 1 },
    { name: 'Makeup', slug: 'makeup', displayOrder: 1, isDefault: 1 },
    { name: 'Haircare', slug: 'haircare', displayOrder: 2, isDefault: 1 },
    { name: 'Body Care', slug: 'body-care', displayOrder: 3, isDefault: 1 },
  ];
  const insertedBeautyCats = await db
    .insert(beautyCategories)
    .values(beautyCatData)
    .returning();
  const beautyCatIds = insertedBeautyCats.map((c) => c.id);

  const productData = [
    { name: 'Kem Chong Nang UV', brand: 'Anessa', catIdx: 0 },
    { name: 'Son Mac Ruby Woo', brand: 'MAC', catIdx: 1 },
    { name: 'Serum Vitamin C', brand: 'Klairs', catIdx: 0 },
    { name: 'Dau Goi Tresemme', brand: 'Tresemme', catIdx: 2 },
    { name: 'Sua Rua Mat CeraVe', brand: 'CeraVe', catIdx: 0 },
    { name: 'Phan Phu Innisfree', brand: 'Innisfree', catIdx: 1 },
    { name: 'Kem Duong Am Laneige', brand: 'Laneige', catIdx: 0 },
    { name: 'Tay Trang Bioderma', brand: 'Bioderma', catIdx: 0 },
    { name: 'Dau Xa Dove', brand: 'Dove', catIdx: 2 },
    { name: 'Kem Duong The Vaseline', brand: 'Vaseline', catIdx: 3 },
  ];

  const createdProductIds: string[] = [];

  for (const p of productData) {
    const buffer = await fetchCatImage();
    const uuid = crypto.randomUUID();
    const storagePath = `beauty/${uuid}.webp`;

    await admin.storage
      .from('private-images')
      .upload(storagePath, buffer, { contentType: 'image/jpeg' });

    const [img] = await db
      .insert(images)
      .values({
        originalName: `beauty-${p.name.toLowerCase().replace(/\s/g, '-')}.jpg`,
        bucket: 'private-images',
        folder: 'beauty',
        width: 800,
        height: 600,
        format: 'jpeg',
        uploadedBy,
      })
      .returning();

    await db.insert(imageVariants).values({
      imageId: img.id,
      variantName: 'medium',
      width: 800,
      height: 600,
      storagePath,
      sizeBytes: buffer.length,
    });

    const [product] = await db
      .insert(beautyProducts)
      .values({
        name: p.name,
        brand: p.brand,
        categoryId: beautyCatIds[p.catIdx],
        rating: 3 + Math.floor(Math.random() * 3),
        notes: '',
        isFavorite: Math.random() > 0.5 ? 1 : 0,
        imageId: img.id,
      })
      .returning();

    createdProductIds.push(product.id);
    await delay(100);
  }

  const insertedRoutines = await db
    .insert(routines)
    .values([
      { name: 'Morning', slug: 'morning', displayOrder: 0 },
      { name: 'Evening', slug: 'evening', displayOrder: 1 },
    ])
    .returning();

  const morningSteps = createdProductIds.slice(0, 4);
  const eveningSteps = createdProductIds.slice(2, 6);

  for (let i = 0; i < morningSteps.length; i++) {
    await db.insert(routineSteps).values({
      routineId: insertedRoutines[0].id,
      productId: morningSteps[i],
      stepOrder: i,
    });
  }
  for (let i = 0; i < eveningSteps.length; i++) {
    await db.insert(routineSteps).values({
      routineId: insertedRoutines[1].id,
      productId: eveningSteps[i],
      stepOrder: i,
    });
  }
}

// ---------------------------------------------------------------------------
// Seed Schedule
// ---------------------------------------------------------------------------

async function seedSchedule() {
  const clientNames = [
    'Chi Lan',
    'Chi Huong',
    'Anh Minh',
    'Chi Thao',
    'Chi Mai',
    'Anh Tuan',
    'Chi Linh',
    'Chi Nga',
  ];
  const locations = [
    'Quan 1',
    'Quan 3',
    'Quan 7',
    'Thu Duc',
    'Binh Thanh',
    'Phu Nhuan',
    'Tan Binh',
    'Go Vap',
  ];

  const now = new Date();
  const months = [
    { y: now.getFullYear(), m: now.getMonth() },
    { y: now.getFullYear(), m: now.getMonth() + 1 },
    { y: now.getFullYear(), m: now.getMonth() + 2 },
  ];

  const normalizedMonths = months.map(({ y, m }) => {
    if (m <= 0) return { y: y - 1, m: m + 12 };
    if (m > 12) return { y: y + 1, m: m - 12 };
    return { y, m };
  });

  const jobRows: Array<{
    jobDate: string;
    clientName: string;
    location: string;
    startTime: string;
    endTime: string;
    payAmount: number;
    status: string;
    notes: string | null;
  }> = [];

  for (const { y, m } of normalizedMonths) {
    const jobsThisMonth = 5 + Math.floor(Math.random() * 3);
    const daysInMonth = new Date(y, m, 0).getDate();

    for (let j = 0; j < jobsThisMonth; j++) {
      const day = 1 + Math.floor(Math.random() * daysInMonth);
      const startHour = 8 + Math.floor(Math.random() * 9);
      const duration = 2 + Math.floor(Math.random() * 3);
      const endHour = Math.min(startHour + duration, 22);
      const payAmount = (5 + Math.floor(Math.random() * 26)) * 100000;

      const isPastMonth = m < now.getMonth() + 1;
      const status =
        isPastMonth || Math.random() > 0.5 ? 'paid' : 'pending';

      jobRows.push({
        jobDate: `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        startTime: `${String(startHour).padStart(2, '0')}:00`,
        endTime: `${String(endHour).padStart(2, '0')}:00`,
        payAmount,
        status,
        notes: null,
      });
    }
  }

  await db.insert(scheduleJobs).values(jobRows);
}

// ---------------------------------------------------------------------------
// Public server action
// ---------------------------------------------------------------------------

export async function resetAndSeed(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const authorized = await isBoyfriend();
    if (!authorized) {
      throw new Error('Unauthorized');
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await cleanStorage();
    await resetAllData();
    await seedPortfolio(user!.id);
    await seedBeauty(user!.id);
    await seedSchedule();

    revalidatePath('/', 'layout');

    return { success: true, message: 'Data reset and seeded successfully' };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong';
    return { success: false, message };
  }
}
