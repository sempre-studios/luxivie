'use client'

import { useEffect, useRef, useState } from 'react'
import { User, X, Loader2, Check } from 'lucide-react'
import { SOCIAL_NETWORKS, type SocialNetwork } from '@/lib/social'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 MB'
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function isValidHttps(value: string): boolean {
  if (!value.trim()) return true
  return /^https:\/\//i.test(value) && !/^(javascript|data|vbscript):/i.test(value)
}

interface AdminProfileDropdownProps {
  quotaBytes?: number
}

export function AdminProfileDropdown({ quotaBytes }: AdminProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<SocialNetwork, string>>({
    instagram: '',
    pinterest: '',
    tiktok: '',
    x: '',
    facebook: '',
    youtube: '',
    linkedin: '',
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [storage, setStorage] = useState<{ totalBytes: number; imageCount: number } | null>(null)
  const [storageLoading, setStorageLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    setLoading(true)
    setStorageLoading(true)
    setError('')
    setSuccess(false)

    fetch('/api/admin/settings/social')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load settings')
        const data = await res.json()
        const links = data.socialLinks || {}
        setValues({
          instagram: links.instagram || '',
          pinterest: links.pinterest || '',
          tiktok: links.tiktok || '',
          x: links.x || '',
          facebook: links.facebook || '',
          youtube: links.youtube || '',
          linkedin: links.linkedin || '',
        })
      })
      .catch(() => setError('Failed to load social links'))
      .finally(() => setLoading(false))

    fetch('/api/admin/settings/storage')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load storage')
        const data = await res.json()
        setStorage({ totalBytes: data.totalBytes || 0, imageCount: data.imageCount || 0 })
      })
      .catch(() => setStorage({ totalBytes: 0, imageCount: 0 }))
      .finally(() => setStorageLoading(false))

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSave = async () => {
    setError('')
    setSuccess(false)

    const invalid = SOCIAL_NETWORKS.find(({ key }) => !isValidHttps(values[key]))
    if (invalid) {
      setError(`Invalid URL for ${invalid.label}. URLs must start with https://`)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks: values }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const usagePercent = quotaBytes && quotaBytes > 0 && storage
    ? Math.min(100, Math.round((storage.totalBytes / quotaBytes) * 100))
    : null

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#243027]/15 bg-white text-[#243027] transition-colors hover:bg-[#F2F0EB]"
        aria-label="Admin profile settings"
        aria-expanded={open}
      >
        <User className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[110] mt-3 w-80 rounded-lg border border-[#243027]/10 bg-white p-5 shadow-xl sm:w-96">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#243027]">Admin Settings</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#243027]/40" />
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                  Social Links
                </h4>
                {SOCIAL_NETWORKS.map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#243027]/50">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={values[key]}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                    />
                  </div>
                ))}
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#243027] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : success ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : null}
                  {saving ? 'Saving...' : success ? 'Saved' : 'Save Social Links'}
                </button>
              </div>

              <div className="space-y-3 border-t border-[#243027]/10 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                  Storage Usage
                </h4>
                {storageLoading || !storage ? (
                  <div className="flex items-center gap-2 text-sm text-[#243027]/50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading storage...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-[#243027]">
                      <span className="font-medium">{formatBytes(storage.totalBytes)}</span> used{' '}
                      {quotaBytes && quotaBytes > 0 && (
                        <span className="text-[#243027]/60">
                          of {formatBytes(quotaBytes)}
                        </span>
                      )}
                    </p>
                    {usagePercent !== null && (
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#243027]/10">
                        <div
                          className="h-full rounded-full bg-[#76885B]"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-[#243027]/50">
                      {storage.imageCount} {storage.imageCount === 1 ? 'image' : 'images'} stored
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
