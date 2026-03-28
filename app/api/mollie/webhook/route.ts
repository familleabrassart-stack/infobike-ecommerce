import { NextResponse } from 'next/server'
import { mollie } from '@/lib/mollie'
import { sendOrderConfirmationToClient, sendNewOrderAlertToStore } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.formData()
    const paymentId = body.get('id') as string

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 })
    }

    const payment = await mollie.payments.get(paymentId)

    // On n'envoie les emails que si le paiement est confirmé
    if (payment.status === 'paid') {
      const orderId = (payment.metadata as { orderId: string }).orderId
      const customerEmail = (payment.metadata as { email?: string }).email ?? ''
      const customerName = (payment.metadata as { firstName?: string }).firstName ?? 'Client'

      // Reconstituer un objet order minimal pour les emails
      const fakeOrder = {
        orderId,
        customerId: '',
        total: parseFloat(payment.amount.value),
        items: [],
        shippingAddress: {
          firstName: customerName,
          lastName: '',
          address: '',
          city: '',
          postalCode: '',
          country: 'Belgique',
        },
        paymentMethod: payment.method ?? 'bancontact',
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
      }

      await sendOrderConfirmationToClient(fakeOrder, customerEmail, customerName)
      await sendNewOrderAlertToStore(fakeOrder, customerEmail)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Mollie webhook]', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
