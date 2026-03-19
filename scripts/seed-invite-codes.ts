import { db } from "../src/lib/db";
import { inviteCodes } from "../src/lib/db/schema";

async function seed() {
  console.log("Seeding invite codes...");

  // Upsert to be idempotent -- safe to run multiple times
  await db
    .insert(inviteCodes)
    .values([
      { code: "FNGH01", assignedName: "Funnghy" },
      { code: "BF0001", assignedName: "Boyfriend" },
    ])
    .onConflictDoNothing({ target: inviteCodes.code });

  console.log("Seeded 2 invite codes:");
  console.log("  - FNGH01 for Funnghy");
  console.log("  - BF0001 for Boyfriend");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
