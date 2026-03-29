import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderReadyNotification } from '@/lib/email'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: { select: { name: true, images: true, slug: true } } } } },
  })

  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { status, notes } = await request.json()

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
    },
    include: { items: true },
  })

  // Envoi email si le vélo est prêt
  if (status === 'ready') {
    const storeName = order.preferredStore === 'dour' ? 'INFOBIKE Dour' : 'INFOBIKE Maisières'
    const firstName = order.customerName.split(' ')[0]
    await sendOrderReadyNotification(order.orderNumber, order.customerEmail, firstName, storeName)
  }

  return NextResponse.json(order)
}
