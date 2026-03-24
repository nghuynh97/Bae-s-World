import crypto from 'crypto';
import { db } from '../src/lib/db';
import {
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
} from '../src/lib/db/schema';
import { createAdminClient } from '../src/lib/supabase/admin';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch a random cat image from cataas.com, with fallback placeholder. */
async function fetchCatImage(): Promise<Buffer> {
  try {
    const res = await fetch('https://cataas.com/cat', { redirect: 'follow' });
    if (!res.ok) throw new Error(`cataas ${res.status}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } catch {
    // 1x1 transparent JPEG placeholder
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

  // Clean public-images/portfolio/
  const { data: portfolioFiles } = await admin.storage
    .from('public-images')
    .list('portfolio');
  if (portfolioFiles && portfolioFiles.length > 0) {
    const paths = portfolioFiles.map((f) => `portfolio/${f.name}`);
    await admin.storage.from('public-images').remove(paths);
    console.log(`Removed ${paths.length} files from public-images/portfolio`);
  }

  // Clean private-images/beauty/
  const { data: beautyFiles } = await admin.storage
    .from('private-images')
    .list('beauty');
  if (beautyFiles && beautyFiles.length > 0) {
    const paths = beautyFiles.map((f) => `beauty/${f.name}`);
    await admin.storage.from('private-images').remove(paths);
    console.log(`Removed ${paths.length} files from private-images/beauty`);
  }
}

// ---------------------------------------------------------------------------
// Reset all data (FK-safe order)
// ---------------------------------------------------------------------------

async function resetAllData() {
  console.log('Resetting all content tables...');
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
  console.log('All content tables cleared.');
}

// ---------------------------------------------------------------------------
// Seed Portfolio
// ---------------------------------------------------------------------------

async function seedPortfolio(uploadedBy: string) {
  console.log('Seeding portfolio...');
  const admin = createAdminClient();

  // Categories
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

  // Portfolio items with cat images
  const itemCount = 22;
  const createdItems: string[] = [];

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

    const [item] = await db
      .insert(portfolioItems)
      .values({
        title: `Cute Cat ${i + 1}`,
        description: '',
        categoryId: catIds[i % catIds.length],
        imageId: img.id,
        displayOrder: i,
      })
      .returning();

    createdItems.push(item.id);
    await delay(100);
  }

  // About content
  await db.insert(aboutContent).values({
    bio: '',
    email: null,
    instagramUrl: null,
    tiktokUrl: null,
    profileImageId: null,
  });

  console.log(`Seeded ${createdItems.length} portfolio items.`);
  return createdItems.length;
}

// ---------------------------------------------------------------------------
// Seed Beauty
// ---------------------------------------------------------------------------

async function seedBeauty(uploadedBy: string) {
  console.log('Seeding beauty...');
  const admin = createAdminClient();

  // Beauty categories
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

  // Beauty products
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
        rating: 3 + Math.floor(Math.random() * 3), // 3-5
        notes: '',
        isFavorite: Math.random() > 0.5 ? 1 : 0,
        imageId: img.id,
      })
      .returning();

    createdProductIds.push(product.id);
    await delay(100);
  }

  // Routines
  const insertedRoutines = await db
    .insert(routines)
    .values([
      { name: 'Morning', slug: 'morning', displayOrder: 0 },
      { name: 'Evening', slug: 'evening', displayOrder: 1 },
    ])
    .returning();

  // Routine steps -- 3-4 products per routine
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

  console.log(
    `Seeded ${createdProductIds.length} beauty products, 2 routines.`,
  );
  return createdProductIds.length;
}

// ---------------------------------------------------------------------------
// Seed Schedule
// ---------------------------------------------------------------------------

async function seedSchedule() {
  console.log('Seeding schedule...');

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
    { y: now.getFullYear(), m: now.getMonth() }, // previous month
    { y: now.getFullYear(), m: now.getMonth() + 1 }, // current month
    { y: now.getFullYear(), m: now.getMonth() + 2 }, // next month
  ];

  // Adjust for year boundaries
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
    const jobsThisMonth = 5 + Math.floor(Math.random() * 3); // 5-7 per month
    const daysInMonth = new Date(y, m, 0).getDate();

    for (let j = 0; j < jobsThisMonth; j++) {
      const day = 1 + Math.floor(Math.random() * daysInMonth);
      const startHour = 8 + Math.floor(Math.random() * 9); // 8-16
      const duration = 2 + Math.floor(Math.random() * 3); // 2-4 hours
      const endHour = Math.min(startHour + duration, 22);
      const payAmount =
        (5 + Math.floor(Math.random() * 26)) * 100000; // 500000-3000000

      // Older months more likely paid
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
  console.log(`Seeded ${jobRows.length} schedule jobs.`);
  return jobRows.length;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Seed All: Reset & Populate ===\n');

  // Get first profile for uploadedBy
  const profileRows = await db.select().from(profiles).limit(1);
  if (profileRows.length === 0) {
    console.error('No profiles found. Please create a user account first.');
    process.exit(1);
  }
  const uploadedBy = profileRows[0].authId;

  await cleanStorage();
  await resetAllData();
  const portfolioCount = await seedPortfolio(uploadedBy);
  const beautyCount = await seedBeauty(uploadedBy);
  const jobCount = await seedSchedule();

  console.log(
    `\nSeeded: ${portfolioCount} portfolio items, ${beautyCount} beauty products, ${jobCount} jobs`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
