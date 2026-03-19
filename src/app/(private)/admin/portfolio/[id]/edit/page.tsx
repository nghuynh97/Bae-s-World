import { notFound } from "next/navigation";
import { getPortfolioItemById } from "@/actions/portfolio";
import { getCategories } from "@/actions/categories";
import { EditPortfolioForm } from "./edit-form";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params;
  const item = await getPortfolioItemById(id);

  if (!item) {
    notFound();
  }

  const categories = await getCategories();

  return (
    <div className="py-8 md:py-12 max-w-xl mx-auto">
      <h1 className="font-display text-xl font-bold text-text-primary mb-6">
        Edit Photo
      </h1>

      <div className="mb-6">
        {item.variants.length > 0 && (
          <div className="rounded-[16px] overflow-hidden aspect-video relative">
            <img
              src={
                item.variants.find((v) => v.variantName === "medium")?.url ||
                item.variants[0].url
              }
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <EditPortfolioForm
        itemId={item.id}
        defaultValues={{
          title: item.title,
          description: item.description ?? "",
          categoryId: item.categoryId,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
