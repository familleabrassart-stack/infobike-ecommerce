import { NextResponse } from 'next/server'
import { createOrder, type CreateOrderParams } from '@/lib/cyclesoftware'
import { sendOrderConfirmationToClient, sendNewOrderAlertToStore } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderParams

    // 1. Créer la commande (CycleSoftware mock → vraie API plus tard)
    const order = await createOrder(body)

    // 2. Email de confirmation au client
    await sendOrderConfirmationToClient(order, body.customer.email, body.customer.firstName)

    // 3. Alerte email aux magasins
    await sendNewOrderAlertToStore(order, body.customer.email)

    return NextResponse.json({ success: true, order })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    console.error('[POST /api/orders]', message)
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
