/**
 * CycleSoftware mock API
 * Simule les appels vers l'API CycleSoftware (POS/ERP vélos).
 * En production, remplacer les fonctions par de vrais appels HTTP
 * vers l'endpoint CycleSoftware de votre revendeur.
 */

import { type Product, type StockByStore, products } from './mock-data'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetProductsParams {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  /** 'dour' | 'maisières' — filtre sur le stock du magasin */
  store?: string
  search?: string
  page?: number
  limit?: number
}

export interface GetProductsResult {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export interface OrderItem {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CycleSoftwareOrder {
  orderId: string
  customerId: string
  items: OrderItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  total: number
  paymentMethod: string
  preferredStore?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
}

export interface CreateOrderParams {
  items: { productId: string; quantity: number }[]
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  preferredStore?: string
  paymentMethod: 'card' | 'bancontact' | 'store'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Récupère une liste de produits avec filtres et pagination.
 */
export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResult> {
  await delay(300)

  let filtered = [...products]

  if (params.category) {
    filtered = filtered.filter((p) => p.category === params.category)
  }

  if (params.brand) {
    filtered = filtered.filter((p) => p.brand === params.brand)
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!)
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!)
  }

  if (params.store) {
    const storeKey = params.store as keyof StockByStore
    filtered = filtered.filter((p) => p.stock[storeKey] > 0)
  }

  if (params.search) {
    const query = params.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)),
    )
  }

  const page = params.page ?? 1
  const limit = params.limit ?? 12
  const total = filtered.length
  const totalPages = Math.ceil(total / limit) || 1
  const start = (page - 1) * limit
  const paginated = filtered.slice(start, start + limit)

  return { products: paginated, total, page, totalPages }
}

/**
 * Récupère un produit par son slug.
 */
export async function getProduct(slug: string): Promise<Product | null> {
  await delay(200)
  return products.find((p) => p.slug === slug) ?? null
}

/**
 * Récupère les produits mis en vedette sur la page d'accueil.
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  await delay(200)
  return products.filter((p) => p.featured).slice(0, limit)
}

/**
 * Vérifie le stock d'un produit.
 * Retourne le stock par magasin, ou le stock d'un magasin précis.
 */
export async function checkStock(
  productId: string,
  store?: keyof StockByStore,
): Promise<StockByStore | number> {
  await delay(150)
  const product = products.find((p) => p.id === productId)
  if (!product) throw new Error(`Produit introuvable : ${productId}`)

  if (store) {
    return product.stock[store] ?? 0
  }
  return product.stock
}

/**
 * Crée une commande dans CycleSoftware.
 * Retourne la commande confirmée avec son numéro.
 */
export async function createOrder(params: CreateOrderParams): Promise<CycleSoftwareOrder> {
  await delay(800)

  // Validation stock
  for (const item of params.items) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error(`Produit introuvable : ${item.productId}`)

    const totalStock = product.stock.dour + product.stock['maisières']
    if (totalStock < item.quantity) {
      throw new Error(`Stock insuffisant pour "${product.name}" (demandé: ${item.quantity}, disponible: ${totalStock})`)
    }
  }

  const orderId = `INF-${Date.now()}-${String(Math.floor(Math.random() * 9000) + 1000)}`

  const orderItems: OrderItem[] = params.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
    }
  })

  const total = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  return {
    orderId,
    customerId: `CUST-${Date.now()}`,
    items: orderItems,
    shippingAddress: {
      firstName: params.customer.firstName,
      lastName: params.customer.lastName,
      address: params.customer.address,
      city: params.customer.city,
      postalCode: params.customer.postalCode,
      country: params.customer.country,
    },
    total,
    paymentMethod: params.paymentMethod,
    preferredStore: params.preferredStore,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
}

/**
 * Récupère le statut d'une commande existante.
 */
export async function getOrderStatus(orderId: string): Promise<CycleSoftwareOrder['status']> {
  await delay(200)
  // Mock : statut aléatoire pour la démo
  const statuses: CycleSoftwareOrder['status'][] = ['confirmed', 'processing', 'shipped']
  return statuses[Math.floor(Math.random() * statuses.length)]
}
