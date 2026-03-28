'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { stores } from '@/lib/mock-data'

type PaymentMethod = 'card' | 'bancontact' | 'store'
type DeliveryMode = 'delivery' | 'pickup'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'Belgique',
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, hydrated } = useCart()
  const router = useRouter()

  const [form, setForm] = useState<FormData>(initialForm)
  const [delivery, setDelivery] = useState<DeliveryMode>('delivery')
  const [selectedStore, setSelectedStore] = useState(stores[0].id)
  const [payment, setPayment] = useState<PaymentMethod>('bancontact')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  function validate(): boolean {
    const e: Partial<FormData> = {}
    if (!form.firstName.trim()) e.firstName = 'Requis'
    if (!form.lastName.trim()) e.lastName = 'Requis'
    if (!form.email.includes('@')) e.email = 'Email invalide'
    if (!form.phone.trim()) e.phone = 'Requis'
    if (delivery === 'delivery') {
      if (!form.address.trim()) e.address = 'Requis'
      if (!form.city.trim()) e.city = 'Requis'
      if (!form.postalCode.trim()) e.postalCode = 'Requis'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          customer: {
            ...form,
            address: delivery === 'pickup' ? `Retrait en magasin – ${selectedStore}` : form.address,
          },
          preferredStore: delivery === 'pickup' ? selectedStore : undefined,
          paymentMethod: payment,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')

      clearCart()

      // Paiement en ligne → redirection vers Mollie
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      // Paiement en magasin → confirmation directe
      router.push(`/confirmation?orderId=${data.order.orderId}&total=${data.order.total}`)
    } catch (err) {
      alert((err as Error).message)
      setLoading(false)
    }
  }

  if (!hydrated) return null

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <span className="text-5xl">🛒</span>
        <h1 className="text-xl font-bold">Votre panier est vide</h1>
        <Link href="/catalogue" className="text-primary hover:underline">
          Retour au catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Steps indicator */}
        <div className="mb-8 flex items-center justify-center gap-3 text-sm">
          <Link href="/panier" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">1</span>
            Panier
          </Link>
          <span className="text-gray-300">──</span>
          <span className="flex items-center gap-1.5 font-semibold text-primary">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
            Commande
          </span>
          <span className="text-gray-300">──</span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">3</span>
            Confirmation
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ─── Left column ─────────────────────────────────────────────── */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal info */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 text-base font-bold text-gray-900">
                  Informations personnelles
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Prénom *</label>
                    <input
                      className={`input ${errors.firstName ? 'border-red-400' : ''}`}
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="label">Nom *</label>
                    <input
                      className={`input ${errors.lastName ? 'border-red-400' : ''}`}
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      className={`input ${errors.email ? 'border-red-400' : ''}`}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label">Téléphone *</label>
                    <input
                      type="tel"
                      className={`input ${errors.phone ? 'border-red-400' : ''}`}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                  </div>
                </div>
              </section>

              {/* Delivery */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 text-base font-bold text-gray-900">Mode de réception</h2>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {[
                    { value: 'delivery', label: '📦 Livraison à domicile', desc: 'Belgique, gratuite' },
                    { value: 'pickup', label: '🏪 Retrait en magasin', desc: 'Gratuit, disponible sous 48h' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                        delivery === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        checked={delivery === opt.value}
                        onChange={() => setDelivery(opt.value as DeliveryMode)}
                      />
                      <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{opt.desc}</p>
                    </label>
                  ))}
                </div>

                {delivery === 'delivery' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="label">Adresse *</label>
                      <input
                        className={`input ${errors.address ? 'border-red-400' : ''}`}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Rue et numéro"
                      />
                      {errors.address && <p className="error">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Code postal *</label>
                        <input
                          className={`input ${errors.postalCode ? 'border-red-400' : ''}`}
                          value={form.postalCode}
                          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        />
                        {errors.postalCode && <p className="error">{errors.postalCode}</p>}
                      </div>
                      <div>
                        <label className="label">Ville *</label>
                        <input
                          className={`input ${errors.city ? 'border-red-400' : ''}`}
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                        />
                        {errors.city && <p className="error">{errors.city}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label">Pays</label>
                      <input className="input bg-gray-50" value={form.country} readOnly />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="label">Choisir le magasin</label>
                    {stores.map((store) => (
                      <label
                        key={store.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors ${
                          selectedStore === store.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="store"
                          className="accent-primary"
                          checked={selectedStore === store.id}
                          onChange={() => setSelectedStore(store.id)}
                        />
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{store.name}</p>
                          <p className="text-xs text-gray-500">
                            {store.address}, {store.city} — {store.hours}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </section>

              {/* Payment */}
              <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 text-base font-bold text-gray-900">Mode de paiement</h2>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'bancontact', label: 'Bancontact', emoji: '💳' },
                    { value: 'card', label: 'Carte bancaire', emoji: '🏦' },
                    { value: 'store', label: 'En magasin', emoji: '🏪' },
                  ] as { value: PaymentMethod; label: string; emoji: string }[]).map((opt) => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-colors ${
                        payment === opt.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        checked={payment === opt.value}
                        onChange={() => setPayment(opt.value)}
                      />
                      <div className="text-2xl">{opt.emoji}</div>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{opt.label}</p>
                    </label>
                  ))}
                </div>
                {payment === 'card' && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="label">Numéro de carte</label>
                      <input className="input" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Expiration</label>
                        <input className="input" placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div>
                        <label className="label">CVV</label>
                        <input className="input" placeholder="123" maxLength={3} type="password" />
                      </div>
                    </div>
                  </div>
                )}
                {payment === 'store' && (
                  <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                    Vous réglerez lors du retrait ou de la livraison par le technicien INFOBIKE.
                  </p>
                )}
              </section>
            </div>

            {/* ─── Order summary ───────────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 text-base font-bold text-gray-900">Votre commande</h2>
                <div className="divide-y divide-gray-100">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3 py-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">× {quantity}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-gray-900">
                        {(product.price * quantity).toLocaleString('fr-BE', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-4 border-t border-gray-100" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total TTC</span>
                  <span className="text-xl font-black text-primary">
                    {totalPrice.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full rounded-xl bg-accent py-3.5 font-bold text-white shadow-md hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Traitement…
                    </span>
                  ) : (
                    'Confirmer la commande →'
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  🔒 Paiement sécurisé SSL
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Inline Tailwind utility classes for form elements */}
      <style jsx global>{`
        .label {
          display: block;
          margin-bottom: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4b5563;
        }
        .input {
          display: block;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: #D32F2F;
          box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.15);
        }
        .error {
          margin-top: 2px;
          font-size: 0.7rem;
          color: #ef4444;
        }
      `}</style>
    </div>
  )
}
