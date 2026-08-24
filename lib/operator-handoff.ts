import crypto from 'crypto'

function getSecret(): string {
  const secret = process.env.SEMPRE_OPERATOR_SERVICE_SECRET
  if (!secret) {
    throw new Error('SEMPRE_OPERATOR_SERVICE_SECRET is not configured')
  }
  return secret
}

function sign(payload: string): string {
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function verify(token: string): Record<string, unknown> | null {
  const idx = token.lastIndexOf('.')
  if (idx === -1) return null

  const payload = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')

  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null
    }
  } catch {
    return null
  }

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>

  if (typeof data.exp === 'number' && data.exp < Date.now()) {
    return null
  }

  return data
}

export function signHandoff(slug: string, action: string): string {
  const payload = {
    slug,
    action,
    iat: Date.now(),
    exp: Date.now() + 15 * 60 * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  }
  const b = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

  return `${baseUrl}/api/operator-handoff?token=${encodeURIComponent(sign(b))}&action=${encodeURIComponent(action)}`
}

export function verifyHandoff(token: string | null): { slug: string; action: string } | null {
  if (!token) return null

  const data = verify(token)
  if (!data) return null

  if (typeof data.slug !== 'string' || typeof data.action !== 'string') {
    return null
  }

  return { slug: data.slug, action: data.action }
}
