import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const count = await prisma.adminUser.count()
  if (count <= 1) {
    return NextResponse.json({ error: 'Impossible de supprimer le dernier administrateur' }, { status: 400 })
  }

  await prisma.adminUser.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { name, password } = await request.json()

  const admin = await prisma.adminUser.update({
    where: { id: params.id },
    data: {
      ...(name && { name }),
      ...(password && { password: await bcrypt.hash(password, 12) }),
    },
    select: { id: true, email: true, name: true, role: true },
  })

  return NextResponse.json(admin)
}
