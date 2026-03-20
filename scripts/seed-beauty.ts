import { db } from "../src/lib/db";
import { beautyCategories, routines } from "../src/lib/db/schema";

async function seed() {
  console.log("Seeding beauty categories...");
  const defaultCategories = [
    { name: "Skincare", slug: "skincare", displayOrder: 0, isDefault: 1 },
    { name: "Makeup", slug: "makeup", displayOrder: 1, isDefault: 1 },
    { name: "Haircare", slug: "haircare", displayOrder: 2, isDefault: 1 },
    { name: "Body Care", slug: "body-care", displayOrder: 3, isDefault: 1 },
  ];
  for (const cat of defaultCategories) {
    await db.insert(beautyCategories).values(cat).onConflictDoNothing();
  }
  console.log("Beauty categories seeded.");

  console.log("Seeding default routines...");
  const defaultRoutines = [
    { name: "Morning", slug: "morning", displayOrder: 0 },
    { name: "Evening", slug: "evening", displayOrder: 1 },
  ];
  for (const routine of defaultRoutines) {
    await db.insert(routines).values(routine).onConflictDoNothing();
  }
  console.log("Default routines seeded.");

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
