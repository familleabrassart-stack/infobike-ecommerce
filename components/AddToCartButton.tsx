'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/mock-data'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const { addItem, isInCart, getItemQuantity } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const totalStock = product.stock.dour + product.stock['maisières']
  const inCart = isInCart(product.id)
  const currentQty = getItemQuantity(product.id)

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (totalStock === 0) {
    return (
      <button
        disabled
        className="w-full rounded-xl bg-gray-200 py-3 text-base font-semibold text-gray-500 cursor-not-allowed"
      >
        Rupture de stock
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Quantité :</label>
        <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(totalStock - currentQty, q + 1))}
            className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            +
          </button>
        </div>
        {inCart && (
          <span className="text-xs text-gray-500">({currentQty} déjà dans le panier)</span>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        className={`w-full rounded-xl py-3 text-base font-semibold text-white transition-all duration-200 ${
          added
            ? 'bg-green-600'
            : 'bg-accent hover:bg-accent-dark active:scale-[0.98]'
        }`}
      >
        {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
      </button>
    </div>
  )
}
