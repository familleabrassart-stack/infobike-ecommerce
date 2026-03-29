'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category { id: string; label: string; slug: string }
interface Brand { id: string; name: string; slug: string }

interface ProductData {
  id?: string
  slug?: string
  name?: string
  description?: string
  price?: number
  originalPrice?: number | null
  categoryId?: string
  brandId?: string
  images?: string[]
  specs?: Record<string, string>
  stockDour?: number
  stockMaisieres?: number
  featured?: boolean
  active?: boolean
  promo?: boolean
  promoLabel?: string | null
}

interface Props {
  categories: Category[]
  brands: Brand[]
  product?: ProductData
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ProductForm({ categories, brands, product }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!product?.id

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    originalPrice: product?.originalPrice?.toString() ?? '',
    categoryId: product?.categoryId ?? '',
    brandId: product?.brandId ?? '',
    stockDour: product?.stockDour?.toString() ?? '0',
    stockMaisieres: product?.stockMaisieres?.toString() ?? '0',
    featured: product?.featured ?? false,
    active: product?.active ?? true,
    promo: product?.promo ?? false,
    promoLabel: product?.promoLabel ?? '',
  })

  const [specs, setSpecs] = useState<Record<string, string>>(
    (product?.specs as Record<string, string>) ?? {}
  )
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm(f => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
    }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSpecChange(key: string, value: string) {
    setSpecs(s => ({ ...s, [key]: value }))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: data })
      if (res.ok) {
        const { url } = await res.json()
        newUrls.push(url)
      }
    }

    setImages(prev => [...prev, ...newUrls])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(url: string) {
    setImages(imgs => imgs.filter(i => i !== url))
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newImages = [...images]
    const target = index + direction
    if (target < 0 || target >= newImages.length) return
    ;[newImages[index], newImages[target]] = [newImages[target], newImages[index]]
    setImages(newImages)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = { ...form, images, specs }
    const url = isEdit ? `/api/admin/produits/${product!.id}` : '/api/admin/produits'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/produits')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erreur lors de la sauvegarde')
      setSaving(false)
    }
  }

  const specFields = [
    { key: 'cadre', label: 'Cadre' },
    { key: 'fourche', label: 'Fourche' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'freins', label: 'Freins' },
    { key: 'roues', label: 'Roues' },
    { key: 'poids', label: 'Poids' },
    { key: 'moteur', label: 'Moteur (e-bike)' },
    { key: 'batterie', label: 'Batterie (e-bike)' },
    { key: 'autonomie', label: 'Autonomie (e-bike)' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {/* Informations générales */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Informations générales</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Nom du produit *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleNameChange}
              required
              className="input"
              placeholder="Thompson Trail X3"
            />
          </div>

          <div>
            <label className="label">Slug (URL) *</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="input font-mono text-sm"
              placeholder="thompson-trail-x3"
            />
          </div>

          <div>
            <label className="label">Marque *</label>
            <select name="brandId" value={form.brandId} onChange={handleChange} required className="input">
              <option value="">-- Choisir --</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Catégorie *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="input">
              <option value="">-- Choisir --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="input resize-none"
              placeholder="Description détaillée du produit…"
            />
          </div>
        </div>
      </section>

      {/* Prix et promo */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Prix et promotions</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Prix de vente (€) *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="input"
              placeholder="1299.00"
            />
          </div>
          <div>
            <label className="label">Prix barré / original (€)</label>
            <input
              name="originalPrice"
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice}
              onChange={handleChange}
              className="input"
              placeholder="1499.00"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="promo"
              checked={form.promo}
              onChange={handleChange}
              className="w-4 h-4 accent-yellow-400"
            />
            <span className="text-sm text-white">Afficher le badge promo</span>
          </label>

          {form.promo && (
            <div>
              <label className="label">Label promo</label>
              <input
                name="promoLabel"
                value={form.promoLabel}
                onChange={handleChange}
                className="input"
                placeholder="Soldes -20%"
              />
            </div>
          )}
        </div>
      </section>

      {/* Stock */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Stock par magasin</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Stock Dour</label>
            <input
              name="stockDour"
              type="number"
              min="0"
              value={form.stockDour}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Stock Maisières</label>
            <input
              name="stockMaisieres"
              type="number"
              min="0"
              value={form.stockMaisieres}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Photos</h2>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
        >
          <p className="text-gray-400 text-sm">
            {uploading ? 'Upload en cours…' : 'Cliquer pour ajouter des photos (jpg, png, webp — max 5 Mo)'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-square">
                <Image
                  src={url}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      className="text-white text-lg"
                      title="Déplacer à gauche"
                    >
                      ←
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="text-red-400 text-lg"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                  {i < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      className="text-white text-lg"
                      title="Déplacer à droite"
                    >
                      →
                    </button>
                  )}
                </div>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Caractéristiques techniques */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Caractéristiques techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specFields.map(field => (
            <div key={field.key}>
              <label className="label">{field.label}</label>
              <input
                value={specs[field.key] ?? ''}
                onChange={e => handleSpecChange(field.key, e.target.value)}
                className="input"
                placeholder={`Ex: Aluminium 6061`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Options */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
        <h2 className="font-semibold text-white">Options</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm text-white">Produit actif (visible sur le site)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-500"
          />
          <span className="text-sm text-white">Produit vedette (affiché sur l'accueil)</span>
        </label>
      </section>

      {error && (
        <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-accent text-gray-950 font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? 'Sauvegarde…' : isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-800 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
