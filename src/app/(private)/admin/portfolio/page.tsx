import Link from 'next/link';
import { getPortfolioItems } from '@/actions/portfolio';
import { PortfolioListClient } from './portfolio-list-client';

export default async function PortfolioAdminPage() {
  const { items } = await getPortfolioItems();

  return (
    <div className="py-8 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-text-primary">
          Portfolio Photos
        </h1>
        <Link
          href="/admin/portfolio/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover"
        >
          Upload Photo
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="mb-2 font-display text-xl font-bold text-text-primary">
            No portfolio photos
          </h2>
          <p className="mb-6 text-base text-text-secondary">
            Upload your first photo to start building the portfolio.
          </p>
          <Link
            href="/admin/portfolio/new"
            className="inline-block rounded-lg bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-hover"
          >
            Upload Photo
          </Link>
        </div>
      ) : (
        <PortfolioListClient items={items} />
      )}
    </div>
  );
}
