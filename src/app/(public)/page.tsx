import { getPortfolioItems } from '@/actions/portfolio';
import { getCategories } from '@/actions/categories';
import { getAboutContent } from '@/actions/about';
import { InfiniteScrollGallery } from '@/components/portfolio/infinite-scroll-gallery';
import { HeroBanner } from '@/components/portfolio/hero-banner';
import { safeFetch } from '@/lib/safe-fetch';

export default async function PortfolioPage() {
  const categories = await safeFetch(() => getCategories(), []);
  const aboutContent = await safeFetch(() => getAboutContent(), null);

  
  const defaultSlug = 'all';

  // Fetch initial data server-side
  const { items, nextCursor } = await safeFetch(
    () =>
      getPortfolioItems(
        undefined,
        defaultSlug === 'all' ? undefined : defaultSlug,
      ),
    { items: [], nextCursor: null },
  );

  // Derive profile image URL
  const profileImageUrl =
    aboutContent?.profileImage?.variants?.find(
      (v) => v.variantName === 'medium',
    )?.url ||
    aboutContent?.profileImage?.variants?.find(
      (v) => v.variantName === 'large',
    )?.url ||
    aboutContent?.profileImage?.variants?.[0]?.url ||
    null;

  return (
    <div>
      {aboutContent && (
        <div className="pt-8">
          <HeroBanner
            profileImageUrl={profileImageUrl}
            name="Funnghy"
            tagline={aboutContent.tagline}
            bio={aboutContent.bio}
            height={aboutContent.height}
            weight={aboutContent.weight}
            email={aboutContent.email}
            instagramUrl={aboutContent.instagramUrl}
            tiktokUrl={aboutContent.tiktokUrl}
            facebookUrl={aboutContent.facebookUrl}
          />
        </div>
      )}
      <InfiniteScrollGallery
        initialItems={items}
        initialCursor={nextCursor}
        initialCategorySlug={defaultSlug}
        categories={categories}
      />
    </div>
  );
}
