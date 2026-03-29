import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import ProductDeleteButton from '@/components/admin/ProductDeleteButton'

interface Props {
  searchParams: { page?: string; search?: string; category?: string }
}

export default async function AdminProduits({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? '1')
  const search = searchParams.search ?? ''
  const category = searchParams.category ?? ''

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(category && { category: { slug: category } }),
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { label: 'asc' } }),
  ])

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="bg-accent text-gray-950 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
        >
          + Nouveau produit
        </Link>
      </div>

      {/* Filtres */}
      <form className="flex gap-3 flex-wrap">
        <input
          name="search"
          defaultValue={search}
          placeholder="Rechercher…"
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <select
          name="category"
          defaultValue={category}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Toutes catégories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          Filtrer
        </button>
      </form>

      {/* Tableau */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">Aucun produit trouvé</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Produit</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Stock</th>
                <th className="text-right px-4 py-3">Prix</th>
                <th className="text-center px-4 py-3">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded w-10 h-10 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded shrink-0 flex items-center justify-center text-gray-500 text-lg">
                          🚲
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-400">{product.category.label}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-400">
                      Dour: {product.stockDour} · Maisières: {product.stockMaisieres}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div>
                      <span className="text-sm font-semibold text-white">
                        {product.price.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                      </span>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-500 line-through">
                          {product.originalPrice.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {product.active ? (
                        <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">Actif</span>
                      ) : (
                        <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Inactif</span>
                      )}
                      {product.promo && (
                        <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full">Promo</span>
                      )}
                      {product.featured && (
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Vedette</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Modifier
                      </Link>
                      <ProductDeleteButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{total} produits</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}&search=${search}&category=${category}`}
                className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-white transition"
              >
                ← Précédent
              </Link>
            )}
            <span className="px-3 py-1">Page {page}/{totalPages}</span>
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}&search=${search}&category=${category}`}
                className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-white transition"
              >
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
