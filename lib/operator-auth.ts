import { NextRequest } from 'next/server'
import crypto from 'crypto'

const EXPECTED_ISSUER = 'client-cms'
const EXPECTED_AUDIENCE = 'luxivie'
const ALLOWED_DRIFT_SECONDS = 60
const MAX_TOKEN_AGE_SECONDS = 300

const nonceStore = new Map<string, number>()

function getSecret(): string {
  const secret = process.env.SEMPRE_OPERATOR_SERVICE_SECRET
  if (!secret) {
    throw new Error('SEMPRE_OPERATOR_SERVICE_SECRET is not configured')
  }
  return secret
}

function getExpectedWebsiteId(): string | null {
  return process.env.LUXIVIE_OPERATOR_WEBSITE_ID || null
}

function cleanupNonces(): void {
  const now = Date.now()
  for (const [key, expiresAt] of nonceStore.entries()) {
    if (expiresAt < now) {
      nonceStore.delete(key)
    }
  }
}

function recordNonce(nonce: string, exp: number): void {
  cleanupNonces()
  if (nonceStore.has(nonce)) {
    throw new Error('Reused nonce')
  }
  nonceStore.set(nonce, exp * 1000)
}

function decodeBase64Url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8')
}

interface JwtPayload {
  iss: string
  aud: string
  sub: string
  iat: number
  exp: number
  jti: string
  correlation_id: string
  action: string
}

function parseJwt(token: string): { header: Record<string, unknown>; payload: JwtPayload; signature: Buffer } {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const header = JSON.parse(decodeBase64Url(parts[0])) as Record<string, unknown>
  const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload
  const signature = Buffer.from(parts[2], 'base64url')

  return { header, payload, signature }
}

function verifySignature(token: string, signature: Buffer): void {
  const [header, body] = token.split('.')
  const expected = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest()

  if (signature.length !== expected.length) {
    throw new Error('Invalid signature')
  }

  if (!crypto.timingSafeEqual(signature, expected)) {
    throw new Error('Invalid signature')
  }
}

function validatePayload(payload: JwtPayload, requiredAction: string): void {
  const now = Math.floor(Date.now() / 1000)

  if (payload.iss !== EXPECTED_ISSUER || payload.aud !== EXPECTED_AUDIENCE) {
    throw new Error('Invalid issuer or audience')
  }

  if (payload.exp < now || payload.iat > now + ALLOWED_DRIFT_SECONDS) {
    throw new Error('Token expired or invalid timestamp')
  }

  if (payload.exp - payload.iat > MAX_TOKEN_AGE_SECONDS) {
    throw new Error('Token lifetime exceeds maximum')
  }

  const expectedWebsiteId = getExpectedWebsiteId()
  if (expectedWebsiteId && payload.sub !== expectedWebsiteId) {
    throw new Error('Invalid website subject')
  }

  if (payload.action !== requiredAction) {
    throw new Error('Action not allowed')
  }

  recordNonce(payload.jti, payload.exp)
}

export function assertOperatorServiceRequest(request: NextRequest, requiredAction: string): JwtPayload {
  const auth = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new Error('Missing authorization')
  }

  const token = auth.slice(7).trim()
  const { header, payload, signature } = parseJwt(token)

  if (header.alg !== 'HS256' || header.typ !== 'JWT') {
    throw new Error('Unsupported token algorithm')
  }

  verifySignature(token, signature)
  validatePayload(payload, requiredAction)

  return payload
}
