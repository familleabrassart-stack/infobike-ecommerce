import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, brand: true },
  })

  if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      slug: body.slug,
      name: body.name,
      description: body.description ?? null,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      categoryId: body.categoryId,
      brandId: body.brandId,
      images: body.images ?? [],
      specs: body.specs ?? {},
      stockDour: parseInt(body.stockDour ?? '0'),
      stockMaisieres: parseInt(body.stockMaisieres ?? '0'),
      featured: body.featured ?? false,
      active: body.active ?? true,
      promo: body.promo ?? false,
      promoLabel: body.promoLabel ?? null,
    },
    include: { category: true, brand: true },
  })

  return NextResponse.json(product)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
