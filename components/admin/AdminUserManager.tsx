'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
  id: string
  email: string
  name: string
  role: string
  createdAt: Date
}

export default function AdminUserManager({ admins: initial }: { admins: Admin[] }) {
  const router = useRouter()
  const [admins, setAdmins] = useState(initial)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' })
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setAdding(true)

    const res = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      setAdmins(prev => [...prev, data])
      setForm({ name: '', email: '', password: '', role: 'admin' })
      router.refresh()
    } else {
      setError(data.error ?? 'Erreur')
    }

    setAdding(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer l'administrateur « ${name} » ?`)) return

    const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setAdmins(prev => prev.filter(a => a.id !== id))
    } else {
      const data = await res.json()
      alert(data.error ?? 'Erreur')
    }
  }

  return (
    <div className="space-y-6">
      {/* Liste */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-800">
          {admins.map(admin => (
            <div key={admin.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-white">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{admin.role}</span>
                <button
                  onClick={() => handleDelete(admin.id, admin.name)}
                  className="text-sm text-red-500 hover:text-red-400 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ajouter un admin */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4">Ajouter un administrateur</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nom</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="input"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="input"
                placeholder="jean@infobike.be"
              />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
                className="input"
                placeholder="min. 8 caractères"
              />
            </div>
            <div>
              <label className="label">Rôle</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="input"
              >
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={adding}
            className="bg-accent text-gray-950 font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {adding ? 'Ajout…' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  )
}
