'use client'

import { useEffect, useRef, useState } from 'react'
import { Database, X, Loader2 } from 'lucide-react'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 MB'
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function StorageDropdown() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [storage, setStorage] = useState<{ totalBytes: number; imageCount: number } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return

    setLoading(true)
    fetch('/api/admin/settings/storage')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load storage')
        const data = await res.json()
        setStorage({ totalBytes: data.totalBytes || 0, imageCount: data.imageCount || 0 })
      })
      .catch(() => setStorage({ totalBytes: 0, imageCount: 0 }))
      .finally(() => setLoading(false))

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

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#243027]/15 bg-white text-[#243027] transition-colors hover:bg-[#F2F0EB]"
        aria-label="Storage usage"
        aria-expanded={open}
      >
        <Database className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[110] mt-3 w-80 rounded-lg border border-[#243027]/10 bg-white p-5 shadow-xl sm:w-96">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#243027]">Storage Usage</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#243027]/40" />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-[#243027]">
                <span className="font-medium">{formatBytes(storage?.totalBytes || 0)}</span> used
              </p>
              <p className="text-xs text-[#243027]/50">
                {storage?.imageCount ?? 0} {storage?.imageCount === 1 ? 'image' : 'images'} stored
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
