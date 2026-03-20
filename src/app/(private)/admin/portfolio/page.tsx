import { getPortfolioItems } from '@/actions/portfolio';
import { getCategories } from '@/actions/categories';
import { PortfolioAdminClient } from './portfolio-admin-client';

export default async function PortfolioAdminPage() {
  const { items } = await getPortfolioItems();
  const categories = await getCategories();

  return <PortfolioAdminClient items={items} categories={categories} />;
}
