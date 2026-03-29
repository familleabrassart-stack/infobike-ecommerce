import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export default async function NouveauProduit() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { label: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Nouveau produit</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
