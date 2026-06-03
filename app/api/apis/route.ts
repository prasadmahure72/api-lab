import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apis = await prisma.mockAPI.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(apis)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, response, status = 200, delay = 0 } = body
  const endpoint = (body.endpoint ?? '').trim()
  const method = (body.method ?? '').toUpperCase()

  if (!name?.trim())
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!endpoint.startsWith('/'))
    return NextResponse.json({ error: 'Endpoint must start with /' }, { status: 400 })
  if (!VALID_METHODS.includes(method))
    return NextResponse.json({ error: `Method must be one of: ${VALID_METHODS.join(', ')}` }, { status: 400 })
  if (response === undefined || response === null)
    return NextResponse.json({ error: 'Response body is required' }, { status: 400 })

  const duplicate = await prisma.mockAPI.findFirst({
    where: { userId: user.id, endpoint, method },
  })
  if (duplicate)
    return NextResponse.json(
      { error: `A ${method} mock for ${endpoint} already exists` },
      { status: 409 }
    )

  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    },
  })

  const api = await prisma.mockAPI.create({
    data: { userId: user.id, name: name.trim(), endpoint, method, response, status, delay },
  })

  return NextResponse.json(api, { status: 201 })
}
