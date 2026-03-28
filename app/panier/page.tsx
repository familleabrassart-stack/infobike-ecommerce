'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export default function PanierPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, hydrated } = useCart()

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="text-2xl font-black text-gray-900">Votre panier est vide</h1>
        <p className="text-gray-500">Découvrez nos vélos et ajoutez-en un à votre panier.</p>
        <Link
          href="/catalogue"
          className="mt-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary-dark transition-colors"
        >
          Voir le catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">
            Mon panier
            <span className="ml-2 text-base font-normal text-gray-400">
              ({items.length} article{items.length > 1 ? 's' : ''})
            </span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const totalStock = product.stock.dour + product.stock['maisières']
              return (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
                >
                  {/* Image */}
                  <Link href={`/produit/${product.slug}`} className="shrink-0">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-xs font-medium text-gray-400">{product.brand}</p>
                      <Link
                        href={`/produit/${product.slug}`}
                        className="font-semibold text-gray-900 hover:text-primary truncate block"
                      >
                        {product.name}
                      </Link>
                      {product.color && (
                        <p className="text-xs text-gray-500">{product.color}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (quantity < totalStock) updateQuantity(product.id, quantity + 1)
                          }}
                          disabled={quantity >= totalStock}
                          className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="font-bold text-primary">
                        {(product.price * quantity).toLocaleString('fr-BE', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="shrink-0 self-start rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              ← Continuer les achats
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Récapitulatif</h2>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Sous-total</dt>
                  <dd className="font-medium">
                    {totalPrice.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Livraison</dt>
                  <dd className="font-medium text-green-600">Gratuite</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">TVA (21 %)</dt>
                  <dd className="font-medium">
                    {(totalPrice * 0.21).toLocaleString('fr-BE', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </dd>
                </div>
              </dl>

              <div className="my-4 border-t border-gray-100" />

              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900">Total TTC</span>
                <span className="text-2xl font-black text-primary">
                  {totalPrice.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-xl bg-accent py-3.5 text-center font-bold text-white shadow-md hover:bg-accent-dark transition-colors"
              >
                Commander →
              </Link>

              <div className="mt-4 flex flex-col gap-1 text-center text-xs text-gray-400">
                <span>✓ Paiement 100 % sécurisé</span>
                <span>✓ Satisfait ou remboursé 14 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
