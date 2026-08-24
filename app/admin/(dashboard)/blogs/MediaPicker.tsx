'use client'

import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'upload' | 'recent'>('upload')
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setActiveTab('upload')
    setError('')
    setUploadError('')
    setLoading(true)
    fetch('/api/admin/media/recent')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load images')
        const data = await res.json()
        setImages(data.images || [])
      })
      .catch(() => setError('Failed to load recent images'))
      .finally(() => setLoading(false))
  }, [open])

  const handleUpload = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    const maxSize = 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG')
      return
    }
    if (file.size > maxSize) {
      setUploadError('File too large. Max 5MB')
      return
    }

    setUploading(true)
    setUploadError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onSelect(data.url)
      onClose()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    handleUpload(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
          <h3 className="font-serif text-lg text-[#243027]">Insert Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 flex gap-2 border-b border-[#243027]/10 pb-2">
          {(['upload', 'recent'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'bg-[#243027] text-white'
                  : 'bg-[#F8F7F4] text-[#243027]/60 hover:bg-[#243027]/10 hover:text-[#243027]'
              }`}
            >
              {tab === 'upload' ? 'Upload New' : 'Recent'}
            </button>
          ))}
        </div>

        {activeTab === 'upload' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[#243027]/15 p-8 transition-colors hover:border-[#76885B] hover:bg-[#76885B]/5"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#243027]/40" />
              ) : (
                <Upload className="h-8 w-8 text-[#243027]/40" />
              )}
              <span className="text-sm text-[#243027]/70">
                {uploading ? 'Uploading...' : 'Click to upload an image'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
          </div>
        )}

        {activeTab === 'recent' && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}
