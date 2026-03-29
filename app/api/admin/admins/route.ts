import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const admins = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(admins)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { email, name, password, role } = await request.json()

  if (!email || !name || !password) {
    return NextResponse.json({ error: 'Email, nom et mot de passe requis' }, { status: 400 })
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  const admin = await prisma.adminUser.create({
    data: { email, name, password: hashed, role: role ?? 'admin' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  return NextResponse.json(admin, { status: 201 })
}
