'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function NavbarActions({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/signin')
    router.refresh()
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        style={{ color: '#00d492' }}
        className="text-sm font-medium hover:opacity-80 transition-opacity"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
      <button
        onClick={handleSignOut}
        style={{ border: '1px solid #1e2e28' }}
        className="text-sm text-white px-3 py-1.5 rounded-md bg-[#111816] hover:bg-[#1e2e28] transition-colors cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  )
}
