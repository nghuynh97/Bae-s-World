import { notFound } from 'next/navigation';
import { getPortfolioItemById } from '@/actions/portfolio';
import { getCategories } from '@/actions/categories';
import { EditPortfolioModal } from './edit-modal';

interface EditModalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditModalPage({ params }: EditModalPageProps) {
  const { id } = await params;
  const item = await getPortfolioItemById(id);

  if (!item) {
    notFound();
  }

  const categories = await getCategories();

  const imageUrl =
    item.variants.find((v) => v.variantName === 'medium')?.url ||
    item.variants[0]?.url;

  return (
    <EditPortfolioModal
      itemId={item.id}
      imageUrl={imageUrl}
      defaultValues={{
        title: item.title,
        description: item.description ?? '',
        categoryId: item.categoryId,
      }}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
