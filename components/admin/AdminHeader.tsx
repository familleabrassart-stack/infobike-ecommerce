'use client'

import { signOut } from 'next-auth/react'

interface Props {
  user: { name: string; email: string; role: string }
}

export default function AdminHeader({ user }: Props) {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user.name}
          <span className="ml-2 text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded">
            {user.role}
          </span>
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-gray-500 hover:text-white transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}
