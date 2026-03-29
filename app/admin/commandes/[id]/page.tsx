import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import OrderStatusForm from '@/components/admin/OrderStatusForm'

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente de paiement', color: 'bg-yellow-900 text-yellow-300' },
  paid:      { label: 'Payée — à préparer',      color: 'bg-blue-900 text-blue-300' },
  ready:     { label: 'Prêt pour retrait/livraison', color: 'bg-green-900 text-green-300' },
  completed: { label: 'Complétée',               color: 'bg-gray-700 text-gray-300' },
  cancelled: { label: 'Annulée',                 color: 'bg-red-900 text-red-300' },
}

const paymentLabels: Record<string, string> = {
  bancontact: 'Bancontact',
  card: 'Carte bancaire',
  store: 'Paiement en magasin',
}

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  })

  if (!order) notFound()

  const s = statusConfig[order.status] ?? { label: order.status, color: 'bg-gray-700 text-gray-300' }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleString('fr-BE', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
      </div>

      {/* Client */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4">Client</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Nom" value={order.customerName} />
          <Info label="Email" value={order.customerEmail} />
          <Info label="Téléphone" value={order.customerPhone} />
          <Info label="Paiement" value={paymentLabels[order.paymentMethod] ?? order.paymentMethod} />
          {order.deliveryMode === 'delivery' && (
            <>
              <Info label="Adresse" value={order.customerAddress ?? '—'} />
              <Info label="Ville" value={`${order.customerPostalCode} ${order.customerCity}`} />
            </>
          )}
          {order.deliveryMode === 'pickup' && (
            <Info label="Magasin de retrait" value={order.preferredStore === 'dour' ? 'INFOBIKE Dour' : 'INFOBIKE Maisières'} />
          )}
        </div>
      </div>

      {/* Articles */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <h2 className="font-semibold text-white px-6 py-4 border-b border-gray-800">Articles</h2>
        <div className="divide-y divide-gray-800">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="rounded-lg w-14 h-14 object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-800 rounded-lg shrink-0 flex items-center justify-center text-2xl">
                  🚲
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-white">
                {(item.price * item.quantity).toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="font-bold text-white text-lg">
            {order.total.toLocaleString('fr-BE', { minimumFractionDigits: 2 })} €
          </span>
        </div>
      </div>

      {/* Gestion statut */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4">Gérer la commande</h2>
        <OrderStatusForm
          orderId={order.id}
          currentStatus={order.status}
          currentNotes={order.notes ?? ''}
          deliveryMode={order.deliveryMode}
        />
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  )
}
