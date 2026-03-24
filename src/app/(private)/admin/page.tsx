import { getPortfolioItems } from '@/actions/portfolio';
import { getCategories } from '@/actions/categories';
import { isBoyfriend } from '@/actions/seed';
import { AdminTabs } from '@/components/admin/admin-tabs';
import { PortfolioAdminClient } from './portfolio/portfolio-admin-client';
import { ProfileEditor } from '@/components/admin/profile-editor';
import { SeedButton } from './seed-button';

export default async function AdminPage() {
  const [{ items }, categories, showSeedButton] = await Promise.all([
    getPortfolioItems(),
    getCategories(),
    isBoyfriend(),
  ]);

  return (
    <div className="py-8 md:py-12">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">
        Manage
      </h1>
      <SeedButton show={showSeedButton} />
      <AdminTabs
        portfolioContent={
          <PortfolioAdminClient items={items} categories={categories} />
        }
        profileContent={<ProfileEditor />}
      />
    </div>
  );
}
