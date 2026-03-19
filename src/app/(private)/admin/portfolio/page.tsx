import Link from "next/link";
import { getPortfolioItems } from "@/actions/portfolio";
import { PortfolioListClient } from "./portfolio-list-client";

export default async function PortfolioAdminPage() {
  const { items } = await getPortfolioItems();

  return (
    <div className="py-8 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl font-bold text-text-primary">
          Portfolio Photos
        </h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-accent text-white hover:bg-accent-hover px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Upload Photo
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">
            No portfolio photos
          </h2>
          <p className="text-base text-text-secondary mb-6">
            Upload your first photo to start building the portfolio.
          </p>
          <Link
            href="/admin/portfolio/new"
            className="inline-block bg-accent text-white hover:bg-accent-hover px-4 py-2 rounded-lg text-sm transition-colors"
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
