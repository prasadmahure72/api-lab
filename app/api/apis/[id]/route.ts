import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const api = await prisma.mockAPI.findFirst({ where: { id, userId: user.id } })
  if (!api) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(api)
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.mockAPI.findFirst({ where: { id, userId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const { name, response, status, delay } = body
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

  if (endpoint !== existing.endpoint || method !== existing.method) {
    const conflict = await prisma.mockAPI.findFirst({
      where: { userId: user.id, endpoint, method, NOT: { id } },
    })
    if (conflict)
      return NextResponse.json(
        { error: `A ${method} mock for ${endpoint} already exists` },
        { status: 409 }
      )
  }

  const api = await prisma.mockAPI.update({
    where: { id },
    data: { name: name.trim(), endpoint, method, response, status, delay },
  })
  return NextResponse.json(api)
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.mockAPI.findFirst({ where: { id, userId: user.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.mockAPI.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
