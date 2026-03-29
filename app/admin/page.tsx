import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const [products, orders, pendingOrders, revenue] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ['pending', 'paid'] } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { in: ['paid', 'ready', 'completed'] } } }),
  ])
  return { products, orders, pendingOrders, revenue: revenue._sum.total ?? 0 }
}

async function getRecentOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
  })
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente',  color: 'bg-yellow-900 text-yellow-300' },
  paid:      { label: 'Payée',       color: 'bg-blue-900 text-blue-300' },
  ready:     { label: 'Prêt',        color: 'bg-green-900 text-green-300' },
  completed: { label: 'Complétée',   color: 'bg-gray-700 text-gray-300' },
  cancelled: { label: 'Annulée',     color: 'bg-red-900 text-red-300' },
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Produits actifs" value={stats.products} icon="🚲" href="/admin/produits" />
        <StatCard label="Commandes totales" value={stats.orders} icon="📦" href="/admin/commandes" />
        <StatCard label="À traiter" value={stats.pendingOrders} icon="⏳" href="/admin/commandes?status=pending" highlight />
        <StatCard
          label="Chiffre d'affaires"
          value={`${stats.revenue.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €`}
          icon="💰"
        />
      </div>

      {/* Dernières commandes */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm text-blue-400 hover:text-blue-300 transition">
            Voir tout →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Aucune commande pour l'instant</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {recentOrders.map(order => {
              const s = statusLabels[order.status] ?? { label: order.status, color: 'bg-gray-700 text-gray-300' }
              return (
                <Link
                  key={order.id}
                  href={`/admin/commandes/${order.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-800 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="text-sm text-white font-medium">
                      {order.total.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/admin/produits/nouveau"
          className="bg-accent text-gray-950 rounded-xl p-5 font-semibold hover:opacity-90 transition text-center"
        >
          + Ajouter un produit
        </Link>
        <Link
          href="/admin/commandes"
          className="bg-gray-800 text-white rounded-xl p-5 font-semibold hover:bg-gray-700 transition text-center border border-gray-700"
        >
          Gérer les commandes
        </Link>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  href,
  highlight,
}: {
  label: string
  value: string | number
  icon: string
  href?: string
  highlight?: boolean
}) {
  const card = (
    <div className={`bg-gray-900 border rounded-xl p-5 ${highlight ? 'border-yellow-600' : 'border-gray-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {highlight && <span className="text-xs text-yellow-400 font-medium">Action requise</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )

  return href ? <Link href={href} className="hover:opacity-80 transition">{card}</Link> : card
}
