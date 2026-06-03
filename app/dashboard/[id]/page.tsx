import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ApiDetailClient from './ApiDetailClient'

export default async function ApiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const api = await prisma.mockAPI.findFirst({
    where: { id, userId: user.id },
  })
  if (!api) redirect('/dashboard')

  const serialized = {
    ...api,
    createdAt: api.createdAt.toISOString(),
  }

  return <ApiDetailClient api={serialized} />
}
