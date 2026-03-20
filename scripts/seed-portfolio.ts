import { db } from '../src/lib/db';
import { categories, aboutContent } from '../src/lib/db/schema';

const DEFAULT_CATEGORIES = [
  { name: 'Modeling', slug: 'modeling', displayOrder: 0, isDefault: 1 },
  { name: 'Travel', slug: 'travel', displayOrder: 1, isDefault: 0 },
  { name: 'Beauty', slug: 'beauty', displayOrder: 2, isDefault: 0 },
];

async function seed() {
  console.log('Seeding portfolio data...');

  // Seed categories (idempotent)
  const existingCategories = await db.select().from(categories);
  if (existingCategories.length === 0) {
    await db.insert(categories).values(DEFAULT_CATEGORIES);
    console.log('Created default categories: Modeling, Travel, Beauty');
  } else {
    console.log(
      `Skipping categories -- ${existingCategories.length} already exist`,
    );
  }

  // Seed about content (idempotent)
  const existingAbout = await db.select().from(aboutContent);
  if (existingAbout.length === 0) {
    await db.insert(aboutContent).values({
      bio: '',
      email: null,
      instagramUrl: null,
      tiktokUrl: null,
      profileImageId: null,
    });
    console.log('Created default about content row');
  } else {
    console.log('Skipping about content -- row already exists');
  }

  console.log('Portfolio seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
