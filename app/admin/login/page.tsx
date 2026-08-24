'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      router.push('/admin/blogs')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F0EB] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <Image src="/luxivie-logo.png" alt="LUXIVIE" width={120} height={48} className="mx-auto mb-6 h-12 w-auto" />
          <h1 className="font-serif text-3xl text-[#243027]">Admin Login</h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#76885B]">
            Manage Blog Posts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
              className="rounded-full border-[#243027]/15 bg-white px-6 py-4"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#243027] py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#76885B]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
