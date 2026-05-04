import { createClient } from '@/lib/supabase/server'
import Logo from './Logo'
import NavbarActions from './NavbarActions'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header
      style={{ borderBottom: '1px solid #1e2e28', background: '#0a0f0d' }}
      className="sticky top-0 z-50 h-14 flex items-center px-6"
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Logo size="sm" />
        <NavbarActions user={user} />
      </div>
    </header>
  )
}
