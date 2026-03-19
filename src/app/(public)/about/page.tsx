import { getAboutContent } from "@/actions/about";
import { getPortfolioItems } from "@/actions/portfolio";
import { AboutSection } from "@/components/portfolio/about-section";
import { PhotoStrip } from "@/components/portfolio/photo-strip";
import { Separator } from "@/components/ui/separator";

export default async function AboutPage() {
  const aboutContent = await getAboutContent();
  const { items: portfolioItems } = await getPortfolioItems(
    undefined,
    undefined
  );

  // Extract thumbnail URLs for the photo strip (first 4 items)
  const photoStripItems = portfolioItems.slice(0, 4).map((item) => {
    const thumbVariant =
      item.variants.find((v) => v.variantName === "thumb") ||
      item.variants.find((v) => v.variantName === "medium") ||
      item.variants[0];
    return {
      imageUrl: thumbVariant?.url ?? "",
      title: item.title,
    };
  });

  // Get profile image URL from about content
  const profileImageUrl =
    aboutContent?.profileImage?.variants?.find(
      (v) => v.variantName === "medium"
    )?.url ||
    aboutContent?.profileImage?.variants?.find(
      (v) => v.variantName === "large"
    )?.url ||
    aboutContent?.profileImage?.variants?.[0]?.url ||
    null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-text-primary mb-6 pt-8">
        About Funnghy
      </h1>

      <AboutSection
        bio={aboutContent?.bio ?? ""}
        email={aboutContent?.email ?? null}
        instagramUrl={aboutContent?.instagramUrl ?? null}
        tiktokUrl={aboutContent?.tiktokUrl ?? null}
        profileImageUrl={profileImageUrl}
      />

      {photoStripItems.length > 0 && (
        <>
          <Separator className="my-8" />
          <PhotoStrip items={photoStripItems} />
        </>
      )}
    </div>
  );
}
