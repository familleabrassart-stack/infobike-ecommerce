import { NextResponse } from 'next/server'
import { createOrder, type CreateOrderParams } from '@/lib/cyclesoftware'
import { sendOrderConfirmationToClient, sendNewOrderAlertToStore } from '@/lib/email'
import { createMolliePayment } from '@/lib/mollie'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderParams & { paymentMethod: string }

    // 1. Créer la commande (mock CycleSoftware → vraie API plus tard)
    const order = await createOrder(body)

    // 2. Paiement en magasin → confirmation directe + emails
    if (body.paymentMethod === 'store') {
      await sendOrderConfirmationToClient(order, body.customer.email, body.customer.firstName)
      await sendNewOrderAlertToStore(order, body.customer.email)
      return NextResponse.json({ success: true, order })
    }

    // 3. Paiement en ligne (Bancontact ou carte) → redirection Mollie
    const { paymentId, checkoutUrl } = await createMolliePayment({
      orderId: order.orderId,
      amount: order.total,
      description: `Commande INFOBIKE #${order.orderId}`,
      method: body.paymentMethod === 'card' ? 'card' : 'bancontact',
      redirectUrl: `${BASE_URL}/confirmation?orderId=${order.orderId}`,
      webhookUrl: `${BASE_URL}/api/mollie/webhook`,
    })

    return NextResponse.json({ success: true, checkoutUrl, orderId: order.orderId, paymentId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    console.error('[POST /api/orders]', message)
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
