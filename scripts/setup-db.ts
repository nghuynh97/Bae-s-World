import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(connectionString, { prepare: false });

async function setup() {
  console.log('Setting up database tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS invite_codes (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      code text NOT NULL UNIQUE,
      assigned_name text NOT NULL,
      used_at timestamp,
      used_by_auth_id text,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ invite_codes');

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      auth_id text NOT NULL UNIQUE,
      display_name text NOT NULL,
      email text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ profiles');

  await sql`
    CREATE TABLE IF NOT EXISTS images (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      original_name text NOT NULL,
      bucket text NOT NULL,
      folder text NOT NULL,
      width integer NOT NULL,
      height integer NOT NULL,
      format text NOT NULL,
      uploaded_by text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ images');

  await sql`
    CREATE TABLE IF NOT EXISTS image_variants (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      image_id uuid NOT NULL REFERENCES images(id) ON DELETE CASCADE,
      variant_name text NOT NULL,
      width integer NOT NULL,
      height integer NOT NULL,
      storage_path text NOT NULL,
      size_bytes integer NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ image_variants');

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL UNIQUE,
      slug text NOT NULL UNIQUE,
      display_order integer NOT NULL DEFAULT 0,
      is_default integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ categories');

  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_items (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      title text NOT NULL,
      description text,
      category_id uuid NOT NULL REFERENCES categories(id),
      image_id uuid NOT NULL REFERENCES images(id) ON DELETE CASCADE,
      display_order integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ portfolio_items');

  await sql`
    CREATE TABLE IF NOT EXISTS about_content (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      bio text NOT NULL DEFAULT '',
      email text,
      instagram_url text,
      tiktok_url text,
      profile_image_id uuid REFERENCES images(id),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ about_content');

  await sql`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS tagline text`;
  await sql`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS height text`;
  await sql`ALTER TABLE about_content ADD COLUMN IF NOT EXISTS weight text`;
  console.log('  + about_content new columns');

  await sql`
    CREATE TABLE IF NOT EXISTS beauty_categories (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL UNIQUE,
      slug text NOT NULL UNIQUE,
      display_order integer NOT NULL DEFAULT 0,
      is_default integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ beauty_categories');

  await sql`
    CREATE TABLE IF NOT EXISTS beauty_products (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      brand text NOT NULL,
      category_id uuid NOT NULL REFERENCES beauty_categories(id),
      rating integer NOT NULL DEFAULT 0,
      is_favorite integer NOT NULL DEFAULT 0,
      image_id uuid REFERENCES images(id),
      notes text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ beauty_products');

  await sql`DROP TABLE IF EXISTS routine_steps CASCADE`;
  await sql`DROP TABLE IF EXISTS routines CASCADE`;
  await sql`
    CREATE TABLE IF NOT EXISTS routines (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      display_order integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ routines');

  await sql`
    CREATE TABLE IF NOT EXISTS routine_steps (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      routine_id uuid NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      product_id uuid NOT NULL REFERENCES beauty_products(id) ON DELETE CASCADE,
      step_order integer NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ routine_steps');

  await sql`
    CREATE TABLE IF NOT EXISTS schedule_jobs (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      job_date text NOT NULL,
      client_name text NOT NULL,
      location text NOT NULL,
      start_time text NOT NULL,
      end_time text NOT NULL,
      pay_amount integer NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      notes text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log('  ✓ schedule_jobs');

  console.log('\nAll tables created successfully!');
  await sql.end();
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
