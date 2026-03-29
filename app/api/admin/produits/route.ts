import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const search = searchParams.get('search') ?? ''
  const categorySlug = searchParams.get('category') ?? ''

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categorySlug && { category: { slug: categorySlug } }),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, limit })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()

  const product = await prisma.product.create({
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

  return NextResponse.json(product, { status: 201 })
}
