'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProductDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) return

    setLoading(true)
    const res = await fetch(`/api/admin/produits/${id}`, { method: 'DELETE' })

    if (res.ok) {
      router.refresh()
    } else {
      alert('Erreur lors de la suppression')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 hover:text-red-400 transition disabled:opacity-50"
    >
      {loading ? '…' : 'Supprimer'}
    </button>
  )
}
