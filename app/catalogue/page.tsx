'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/cyclesoftware'
import type { Product } from '@/lib/mock-data'
import { categories, brands, stores } from '@/lib/mock-data'

const priceRanges = [
  { label: 'Tous les prix', min: 0, max: Infinity },
  { label: 'Moins de 800 €', min: 0, max: 799 },
  { label: '800 € – 1 500 €', min: 800, max: 1500 },
  { label: '1 500 € – 3 000 €', min: 1500, max: 3000 },
  { label: 'Plus de 3 000 €', min: 3001, max: Infinity },
]

function FilterIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L13 13.414V19a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 7 21v-7.586L3.293 6.707A1 1 0 0 1 3 6V4Z"
      />
    </svg>
  )
}

export default function CataloguePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '')
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') ?? '')
  const [selectedStore, setSelectedStore] = useState('')
  const [priceRange, setPriceRange] = useState(0) // index into priceRanges
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    const range = priceRanges[priceRange]
    const result = await getProducts({
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      store: selectedStore || undefined,
      minPrice: range.min > 0 ? range.min : undefined,
      maxPrice: range.max < Infinity ? range.max : undefined,
      search: search || undefined,
      page,
      limit: 12,
    })
    setProducts(result.products)
    setTotal(result.total)
    setLoading(false)
  }, [selectedCategory, selectedBrand, selectedStore, priceRange, search, page])

  useEffect(() => {
    load()
  }, [load])

  // Sync URL params on category/brand change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedBrand) params.set('brand', selectedBrand)
    if (search) params.set('search', search)
    router.replace(`/catalogue${params.toString() ? `?${params.toString()}` : ''}`, {
      scroll: false,
    })
  }, [selectedCategory, selectedBrand, search, router])

  function resetFilters() {
    setSelectedCategory('')
    setSelectedBrand('')
    setSelectedStore('')
    setPriceRange(0)
    setSearch('')
    setPage(1)
  }

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    selectedStore,
    priceRange !== 0,
  ].filter(Boolean).length

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.label ?? 'Catalogue'
                  : 'Tous les vélos'}
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {loading ? '…' : `${total} vélo${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
                />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un vélo…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => { setSelectedCategory(''); setPage(1) }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary hover:text-primary'
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(1) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary hover:text-primary'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* ─── Sidebar filters ─────────────────────────────────────────────── */}
          <aside
            className={`${
              filtersOpen ? 'fixed inset-0 z-40 overflow-auto bg-white p-6 lg:static lg:inset-auto lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0' : 'hidden lg:block'
            } w-full shrink-0 lg:w-56`}
          >
            {/* Mobile close */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <h2 className="font-bold">Filtres</h2>
              <button onClick={() => setFiltersOpen(false)}>✕</button>
            </div>

            <div className="space-y-6 rounded-xl bg-white p-4 ring-1 ring-gray-100 shadow-sm lg:sticky lg:top-24">
              {/* Marques */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Marque
                </h3>
                <div className="space-y-1.5">
                  {['', ...brands].map((brand) => (
                    <label key={brand} className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => { setSelectedBrand(brand); setPage(1) }}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-700">
                        {brand === '' ? 'Toutes les marques' : brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Prix
                </h3>
                <div className="space-y-1.5">
                  {priceRanges.map((range, i) => (
                    <label key={i} className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === i}
                        onChange={() => { setPriceRange(i); setPage(1) }}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Magasin */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Disponible à
                </h3>
                <div className="space-y-1.5">
                  {[{ id: '', name: 'Tous les magasins' }, ...stores].map((store) => (
                    <label key={store.id} className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="radio"
                        name="store"
                        checked={selectedStore === store.id}
                        onChange={() => { setSelectedStore(store.id); setPage(1) }}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-700">{store.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full rounded-lg border border-primary py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Réinitialiser ({activeFiltersCount})
                </button>
              )}
            </div>
          </aside>

          {/* ─── Product grid ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters toggle */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
              >
                <FilterIcon />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-gray-500">
                {total} résultat{total > 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                    <div className="aspect-[4/3] rounded-t-xl bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-16 rounded bg-gray-200" />
                      <div className="h-4 w-3/4 rounded bg-gray-200" />
                      <div className="h-3 w-full rounded bg-gray-200" />
                      <div className="h-3 w-full rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-white py-20 ring-1 ring-gray-100">
                <span className="text-5xl">🔍</span>
                <p className="mt-4 text-lg font-semibold text-gray-700">Aucun vélo trouvé</p>
                <p className="mt-1 text-sm text-gray-500">Essayez d&apos;autres filtres</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && total > 12 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary"
                >
                  ←
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} / {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 12)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
