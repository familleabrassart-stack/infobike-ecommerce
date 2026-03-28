import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commande confirmée',
}

interface Props {
  searchParams: { orderId?: string; total?: string }
}

export default function ConfirmationPage({ searchParams }: Props) {
  const { orderId, total } = searchParams
  const totalAmount = total ? parseFloat(total) : null

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-gray-900">Merci pour votre commande !</h1>
        <p className="mt-2 text-gray-500">
          Votre commande a été confirmée et est en cours de traitement.
        </p>

        {/* Order details */}
        <div className="my-6 rounded-2xl bg-gray-50 p-5 text-left">
          {orderId && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500">Numéro de commande</span>
              <span className="font-mono text-sm font-bold text-gray-900">{orderId}</span>
            </div>
          )}
          {totalAmount !== null && (
            <div className="flex items-center justify-between border-t border-gray-200 py-2">
              <span className="text-sm text-gray-500">Total TTC</span>
              <span className="text-lg font-black text-primary">
                {totalAmount.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-200 py-2">
            <span className="text-sm text-gray-500">Statut</span>
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Confirmée
            </span>
          </div>
        </div>

        {/* What's next */}
        <div className="mb-6 space-y-3 text-left">
          <h2 className="font-bold text-gray-900">Prochaines étapes</h2>
          <div className="space-y-2">
            {[
              { icon: '📧', text: 'Un email de confirmation vous a été envoyé.' },
              { icon: '🔧', text: "Votre vélo est préparé par nos techniciens INFOBIKE." },
              { icon: '📦', text: "Vous serez contacté pour la livraison ou pour organiser le retrait en magasin." },
            ].map((step) => (
              <div key={step.text} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-0.5 text-base">{step.icon}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-6 rounded-xl bg-primary/5 p-4 text-sm text-gray-600">
          Une question ? Contactez-nous :{' '}
          <a href="tel:+3265651234" className="font-semibold text-primary hover:underline">
            +32 65 65 12 34
          </a>{' '}
          (Dour) /{' '}
          <a href="tel:+3265785678" className="font-semibold text-primary hover:underline">
            +32 65 78 56 78
          </a>{' '}
          (Maisières)
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalogue"
            className="flex-1 rounded-xl bg-accent py-3 font-bold text-white hover:bg-accent-dark transition-colors"
          >
            Continuer mes achats
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
