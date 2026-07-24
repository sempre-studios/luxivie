'use client'

import { useEffect, useState } from 'react'
import { Image as ImageIcon, X, Loader2 } from 'lucide-react'

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

interface MediaImage {
  url: string
  name: string
  created_at: string
}

export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError('')
    fetch('/api/admin/media/recent')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load images')
        const data = await res.json()
        setImages(data.images || [])
      })
      .catch(() => setError('Failed to load recent images'))
      .finally(() => setLoading(false))
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[#243027]/15 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#243027]">Recent Images</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#243027]/40" />
          </div>
        )}

        {error && <p className="py-8 text-center text-sm text-red-600">{error}</p>}

        {!loading && !error && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#243027]/40">
            <ImageIcon className="mb-3 h-8 w-8" />
            <p className="text-sm">No images uploaded yet.</p>
          </div>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="grid max-h-[400px] grid-cols-4 gap-3 overflow-y-auto">
            {images.map((img) => (
              <button
                key={img.name}
                type="button"
                onClick={() => {
                  onSelect(img.url)
                  onClose()
                }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[#243027]/10 transition-all hover:border-[#76885B] hover:ring-2 hover:ring-[#76885B]/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
