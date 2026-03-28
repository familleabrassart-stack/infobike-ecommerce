import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/mock-data'

interface Props {
  product: Product
}

const categoryLabel: Record<string, string> = {
  vtt: 'VTT',
  route: 'Route',
  electrique: 'Électrique',
  urbain: 'Urbain',
}

export default function ProductCard({ product }: Props) {
  const totalStock = product.stock.dour + product.stock['maisières']
  const isOnSale = !!product.originalPrice

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span className="rounded bg-primary/90 px-2 py-0.5 text-xs font-semibold text-white">
            {categoryLabel[product.category] ?? product.category}
          </span>
          {isOnSale && (
            <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
              Promo
            </span>
          )}
        </div>
        {totalStock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-gray-900">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.brand}
        </p>
        <h3 className="mt-0.5 font-semibold text-gray-900 group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>

        {/* Price & stock */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-lg font-bold text-primary">
              {product.price.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}
            </span>
            {isOnSale && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {product.originalPrice!.toLocaleString('fr-BE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-medium ${totalStock > 0 ? 'text-green-600' : 'text-red-500'}`}
          >
            {totalStock > 3 ? 'En stock' : totalStock > 0 ? `Dernières pièces` : 'Épuisé'}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-3">
          <span className="block w-full rounded-lg bg-accent py-2 text-center text-sm font-semibold text-white transition-colors group-hover:bg-accent-dark">
            Voir le produit
          </span>
        </div>
      </div>
    </Link>
  )
}
