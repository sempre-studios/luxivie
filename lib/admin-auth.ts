import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const COOKIE_NAME = 'luxivie_admin'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured')
  }
  return secret
}

function sign(payload: string): string {
  const secret = getSecret()
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function verify(token: string): boolean {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return false
  const payload = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export function verifyPassword(plain: string): boolean {
  const expected = process.env.ADMIN_PASSWORD_HASH
  if (!expected) {
    console.error('[admin-auth] ADMIN_PASSWORD_HASH not configured')
    return false
  }
  return plain === expected
}

export async function setAdminCookie(response: NextResponse): Promise<NextResponse> {
  const payload = JSON.stringify({ ts: Date.now() })
  const token = sign(Buffer.from(payload).toString('base64url'))
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
  return response
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAME)
  return response
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verify(token)
}

export async function requireAuth(): Promise<boolean> {
  const ok = await isAuthenticated()
  if (!ok) {
    throw new Error('Unauthorized')
  }
  return true
}

export function isApiAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false
  return verify(token)
}
