import { createMollieClient, PaymentMethod } from '@mollie/api-client'

// Client Mollie — utilise la clé test ou live selon l'environnement
export const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY!,
})

// Crée un paiement Mollie et retourne l'URL de checkout
export async function createMolliePayment({
  orderId,
  amount,
  description,
  method,
  redirectUrl,
  webhookUrl,
}: {
  orderId: string
  amount: number // en euros
  description: string
  method: 'bancontact' | 'card'
  redirectUrl: string
  webhookUrl: string
}) {
  const mollieMethod =
    method === 'card' ? PaymentMethod.creditcard : PaymentMethod.bancontact

  const payment = await mollie.payments.create({
    amount: {
      currency: 'EUR',
      value: amount.toFixed(2),
    },
    description,
    redirectUrl,
    webhookUrl,
    method: mollieMethod,
    metadata: { orderId },
  })

  return {
    paymentId: payment.id,
    checkoutUrl: payment.getCheckoutUrl()!,
  }
}
