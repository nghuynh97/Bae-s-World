import { notFound } from 'next/navigation';
import { getPortfolioItemById } from '@/actions/portfolio';
import { getCategories } from '@/actions/categories';
import { EditPortfolioForm } from './edit-form';

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
    <div className="mx-auto max-w-xl py-8 md:py-12">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">
        Edit Photo
      </h1>

      <div className="mb-6">
        {item.variants.length > 0 && (
          <div className="relative aspect-video overflow-hidden rounded-[16px]">
            <img
              src={
                item.variants.find((v) => v.variantName === 'medium')?.url ||
                item.variants[0].url
              }
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <EditPortfolioForm
        itemId={item.id}
        defaultValues={{
          title: item.title,
          description: item.description ?? '',
          categoryId: item.categoryId,
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
