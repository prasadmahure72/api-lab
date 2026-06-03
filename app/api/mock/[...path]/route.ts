import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

async function handleMock(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const endpoint = '/' + path.join('/')
  const method = request.method

  const api = await prisma.mockAPI.findFirst({ where: { endpoint, method } })

  if (!api) {
    return NextResponse.json(
      { error: 'Mock not found', endpoint, method },
      { status: 404, headers: corsHeaders }
    )
  }

  if (api.delay && api.delay > 0) {
    await new Promise(resolve => setTimeout(resolve, api.delay ?? 0))
  }

  // TODO Phase 2: Add per-user API key scoping + rate limiting
  return NextResponse.json(api.response, { status: api.status, headers: corsHeaders })
}

export const GET    = handleMock
export const POST   = handleMock
export const PUT    = handleMock
export const DELETE = handleMock
export const PATCH  = handleMock
