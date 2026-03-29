'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statusOptions = [
  { value: 'pending',   label: 'En attente de paiement' },
  { value: 'paid',      label: 'Payée — à préparer' },
  { value: 'ready',     label: 'Prêt (envoie l\'email client automatiquement)' },
  { value: 'completed', label: 'Complétée' },
  { value: 'cancelled', label: 'Annulée' },
]

interface Props {
  orderId: string
  currentStatus: string
  currentNotes: string
  deliveryMode: string
}

export default function OrderStatusForm({ orderId, currentStatus, currentNotes, deliveryMode }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const res = await fetch(`/api/admin/commandes/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })

    if (res.ok) {
      setSuccess(true)
      router.refresh()
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Statut de la commande</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input"
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {status === 'ready' && deliveryMode === 'pickup' && (
          <p className="text-xs text-green-400 mt-1">
            Un email sera envoyé automatiquement au client pour l'informer que son vélo est prêt à retirer.
          </p>
        )}
      </div>

      <div>
        <label className="label">Notes internes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder="Notes visibles uniquement par l'équipe…"
        />
      </div>

      {success && (
        <p className="text-sm text-green-400 bg-green-950 border border-green-800 rounded-lg px-4 py-2">
          Commande mise à jour avec succès.
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {saving ? 'Sauvegarde…' : 'Mettre à jour'}
      </button>
    </form>
  )
}
