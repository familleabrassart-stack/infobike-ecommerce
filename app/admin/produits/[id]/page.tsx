import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

interface Props {
  params: { id: string }
}

export default async function EditProduit({ params }: Props) {
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { label: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Modifier : {product.name}</h1>
      <ProductForm
        categories={categories}
        brands={brands}
        product={{
          ...product,
          description: product.description ?? undefined,
          originalPrice: product.originalPrice ?? undefined,
          promoLabel: product.promoLabel ?? undefined,
          specs: (product.specs as Record<string, string>) ?? {},
        }}
      />
    </div>
  )
}
