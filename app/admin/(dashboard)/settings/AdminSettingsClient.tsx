'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SocialLinks {
  instagram?: string
  pinterest?: string
  tiktok?: string
  x?: string
  facebook?: string
}

const NETWORKS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
  { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
]

export function AdminSettingsClient() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const [storage, setStorage] = useState<{ totalBytes: number; imageCount: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings/social')
      .then(async (res) => {
        if (!res.ok) return
        const data = await res.json()
        setSocialLinks(data.socialLinks || {})
      })
      .catch(() => {})

    fetch('/api/admin/settings/storage')
      .then(async (res) => {
        if (!res.ok) return
        const data = await res.json()
        setStorage({ totalBytes: data.totalBytes || 0, imageCount: data.imageCount || 0 })
      })
      .catch(() => {})
  }, [])

  function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)

    fetch('/api/admin/settings/social', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socialLinks }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to save')
          return
        }
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      })
      .catch(() => setError('Network error'))
      .finally(() => setSaving(false))
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 MB'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) return `${Math.round(bytes / 1024)} KB`
    return `${mb.toFixed(1)} MB`
  }

  return (
    <div className="space-y-8">
      {/* Storage Summary */}
      <div className="rounded-lg border border-[#243027]/15 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-[#243027]">Storage Usage</h2>
        {storage ? (
          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-[#243027]">{formatBytes(storage.totalBytes)}</p>
              <p className="text-xs text-[#243027]/40">across {storage.imageCount} image{storage.imageCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#243027]/40">Loading storage info…</p>
        )}
      </div>

      {/* Social Links */}
      <div className="rounded-lg border border-[#243027]/15 bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-[#243027]">Social Media Links</h2>
        <p className="mb-6 text-sm text-[#243027]/50">
          These are the default social links shown on article pages and the blog footer. Individual articles can hide specific networks.
        </p>

        <div className="space-y-4">
          {NETWORKS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                {label}
              </Label>
              <Input
                value={socialLinks[key] || ''}
                onChange={(e) => setSocialLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="rounded-lg border-[#243027]/15 bg-white px-4 py-2.5 text-sm"
              />
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {saved && <p className="mt-4 text-sm text-[#76885B]">Saved successfully.</p>}

        <div className="mt-6">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[#243027] px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#76885B]"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
