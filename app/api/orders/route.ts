import { NextResponse } from 'next/server'
import { createOrder, type CreateOrderParams } from '@/lib/cyclesoftware'
import { sendOrderConfirmationToClient, sendNewOrderAlertToStore } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderParams

    // Créer la commande (mock → CycleSoftware plus tard)
    const order = await createOrder(body)

    // Envoi des emails de confirmation
    await sendOrderConfirmationToClient(order, body.customer.email, body.customer.firstName)
    await sendNewOrderAlertToStore(order, body.customer.email)

    return NextResponse.json({ success: true, order })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    console.error('[POST /api/orders]', message)
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
