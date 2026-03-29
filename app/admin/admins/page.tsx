import { prisma } from '@/lib/prisma'
import AdminUserManager from '@/components/admin/AdminUserManager'

export default async function AdminsPage() {
  const admins = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Administrateurs</h1>
      <AdminUserManager admins={admins} />
    </div>
  )
}
