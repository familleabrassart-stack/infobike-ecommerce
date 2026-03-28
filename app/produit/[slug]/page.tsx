import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/cyclesoftware'
import { products, stores } from '@/lib/mock-data'
import AddToCartButton from '@/components/AddToCartButton'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Produit introuvable' }
  return {
    title: product.name,
    description: product.description,
  }
}

const categoryLabel: Record<string, string> = {
  vtt: 'VTT',
  route: 'Route',
  electrique: 'Électrique',
  urbain: 'Urbain',
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const totalStock = product.stock.dour + product.stock['maisières']

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-primary">Catalogue</Link>
            <span>/</span>
            <Link
              href={`/catalogue?category=${product.category}`}
              className="hover:text-primary"
            >
              {categoryLabel[product.category]}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ─── Images ──────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.originalPrice && (
                <div className="absolute left-4 top-4 rounded-lg bg-amber-500 px-3 py-1 text-sm font-bold text-white shadow">
                  Promo −
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100,
                  )}
                  %
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-lg bg-white ring-1 ring-gray-100"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Info ────────────────────────────────────────────────────────── */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                {categoryLabel[product.category]}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">
                {product.brand}
              </span>
              {product.color && (
                <span className="text-xs text-gray-500">• {product.color}</span>
              )}
            </div>

            <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-black text-primary">
                {product.price.toLocaleString('fr-BE', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('fr-BE', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              )}
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {stores.map((store) => {
                const qty = product.stock[store.id as keyof typeof product.stock]
                return (
                  <div
                    key={store.id}
                    className={`rounded-xl p-3 ring-1 ${
                      qty > 0
                        ? 'bg-green-50 ring-green-200'
                        : 'bg-gray-50 ring-gray-200'
                    }`}
                  >
                    <p className="text-xs font-semibold text-gray-700">{store.name}</p>
                    <p
                      className={`mt-0.5 text-sm font-medium ${
                        qty > 0 ? 'text-green-700' : 'text-red-500'
                      }`}
                    >
                      {qty > 0
                        ? qty > 3
                          ? `${qty} en stock`
                          : `Dernières pièces (${qty})`
                        : 'Épuisé'}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Add to cart */}
            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            {/* Reassurance */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>✓ Livraison en Belgique</span>
              <span>✓ Retrait gratuit en magasin</span>
              <span>✓ Garantie constructeur</span>
            </div>
          </div>
        </div>

        {/* ─── Details tabs ────────────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Description */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Description</h2>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {product.longDescription}
            </p>
            {product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Caractéristiques</h2>
            <dl className="divide-y divide-gray-100">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2.5 text-sm">
                  <dt className="font-medium capitalize text-gray-700">
                    {key === 'roues'
                      ? 'Roues'
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </dt>
                  <dd className="text-right text-gray-600 max-w-[55%]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Back to catalogue */}
        <div className="mt-10 text-center">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
          >
            ← Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
