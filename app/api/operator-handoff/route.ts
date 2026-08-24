import { NextRequest, NextResponse } from 'next/server'
import { verifyHandoff } from '@/lib/operator-handoff'
import { sign } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const token = searchParams.get('token')
  const action = searchParams.get('action') || 'edit'

  const payload = verifyHandoff(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired handoff' }, { status: 403 })
  }

  const adminPayload = JSON.stringify({ ts: Date.now(), via: 'operator-handoff' })
  const adminToken = sign(Buffer.from(adminPayload).toString('base64url'))

  const redirectTo = action === 'edit'
    ? `/admin/blogs/${payload.slug}/edit`
    : `/blog/${payload.slug}`

  const response = NextResponse.redirect(new URL(redirectTo, request.url))
  response.cookies.set('luxivie_admin', adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
