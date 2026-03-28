'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react'
import type { Product } from '@/lib/mock-data'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  hydrated: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; items: CartItem[] }

interface CartContextValue {
  items: CartItem[]
  hydrated: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex((i) => i.product.id === action.product.id)
      if (idx >= 0) {
        const updated = [...state.items]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + action.quantity }
        return { ...state, items: updated }
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== action.productId),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i,
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'HYDRATE':
      return { items: action.items, hydrated: true }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'infobike_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], hydrated: false })

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        dispatch({ type: 'HYDRATE', items: parsed })
      } else {
        dispatch({ type: 'HYDRATE', items: [] })
      }
    } catch {
      dispatch({ type: 'HYDRATE', items: [] })
    }
  }, [])

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!state.hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items, state.hydrated])

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const isInCart = useCallback(
    (productId: string) => state.items.some((i) => i.product.id === productId),
    [state.items],
  )

  const getItemQuantity = useCallback(
    (productId: string) =>
      state.items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [state.items],
  )

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        hydrated: state.hydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
