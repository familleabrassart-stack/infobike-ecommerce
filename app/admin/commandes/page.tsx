import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface Props {
  searchParams: { page?: string; status?: string }
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente',  color: 'bg-yellow-900 text-yellow-300' },
  paid:      { label: 'Payée',       color: 'bg-blue-900 text-blue-300' },
  ready:     { label: 'Prêt',        color: 'bg-green-900 text-green-300' },
  completed: { label: 'Complétée',   color: 'bg-gray-700 text-gray-300' },
  cancelled: { label: 'Annulée',     color: 'bg-red-900 text-red-300' },
}

const deliveryLabels: Record<string, string> = {
  delivery: 'Livraison',
  pickup: 'Retrait magasin',
}

export default async function AdminCommandes({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? '1')
  const status = searchParams.status ?? ''
  const where = status ? { status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Commandes</h1>
        <span className="text-sm text-gray-500">{total} commande{total > 1 ? 's' : ''}</span>
      </div>

      {/* Filtres par statut */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/commandes"
          className={`text-sm px-3 py-1.5 rounded-lg transition ${!status ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Toutes
        </Link>
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <Link
            key={key}
            href={`/admin/commandes?status=${key}`}
            className={`text-sm px-3 py-1.5 rounded-lg transition ${status === key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-12">Aucune commande</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Commande</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Client</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Mode</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-center px-4 py-3">Statut</th>
                <th className="text-right px-4 py-3">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map(order => {
                const s = statusConfig[order.status] ?? { label: order.status, color: 'bg-gray-700 text-gray-300' }
                return (
                  <tr key={order.id} className="hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-medium text-white">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-white">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-400">
                        {deliveryLabels[order.deliveryMode] ?? order.deliveryMode}
                        {order.preferredStore && (
                          <span className="text-gray-600"> · {order.preferredStore}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-white">
                        {order.total.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-BE')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition"
                      >
                        Détail
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{total} commandes</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}&status=${status}`} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-white">
                ← Précédent
              </Link>
            )}
            <span className="px-3 py-1">Page {page}/{totalPages}</span>
            {page < totalPages && (
              <Link href={`?page=${page + 1}&status=${status}`} className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-white">
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
