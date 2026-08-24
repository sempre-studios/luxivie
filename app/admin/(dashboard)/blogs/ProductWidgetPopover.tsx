'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Package, X, Upload, Loader2, Image as ImageIcon, Check } from 'lucide-react'

interface ProductWidgetPopoverProps {
  editorRef: React.RefObject<HTMLDivElement | null>
  onChange: (html: string) => void
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface MediaImage {
  url: string
  name: string
  created_at: string
}

type WidgetStyle = 'card' | 'banner' | 'minimal'

export function ProductWidgetPopover({ editorRef, onChange }: ProductWidgetPopoverProps) {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ctaLabel, setCtaLabel] = useState('Shop Now')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [widgetStyle, setWidgetStyle] = useState<WidgetStyle>('card')
  const [error, setError] = useState('')
  const savedRangeRef = useRef<Range | null>(null)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [pickerTab, setPickerTab] = useState<'upload' | 'recent'>('upload')
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function openModal(e: React.MouseEvent) {
    e.preventDefault()
    const editor = editorRef.current
    if (!editor) return
    const sel = window.getSelection()
    savedRangeRef.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null
    setError('')
    setImageUrl('')
    setName('')
    setDescription('')
    setCtaLabel('Shop Now')
    setDestinationUrl('')
    setStep(1)
    setPickerTab('upload')
    setWidgetStyle('card')
    setFetchError('')
    setUploadError('')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setFetchError('')
    fetch('/api/admin/media/recent')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load images')
        const data = await res.json()
        setImages(data.images || [])
      })
      .catch(() => setFetchError('Failed to load recent images'))
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
      setImageUrl(data.url)
      setStep(2)
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

  const handleSelectRecent = (img: MediaImage) => {
    setImageUrl(img.url)
    setStep(2)
  }

  const closeModal = useCallback(() => {
    setOpen(false)
    editorRef.current?.focus()
  }, [editorRef])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, closeModal])

  function apply() {
    const editor = editorRef.current
    if (!editor) return

    const dest = destinationUrl.trim()
    if (!dest) {
      setError('Destination URL is required')
      return
    }
    if (/^(javascript|data|vbscript):/i.test(dest)) {
      setError('Invalid URL')
      return
    }

    const image = imageUrl.trim()
    const title = name.trim()
    const desc = description.trim()
    const label = ctaLabel.trim() || 'Shop Now'
    let destHref = dest
    if (!/^https?:\/\//i.test(destHref) && !destHref.startsWith('/') && !destHref.startsWith('#')) {
      destHref = `https://${destHref}`
    }

    const removeBtn = `<button type="button" class="product-widget-remove" aria-label="Remove product widget" style="position:absolute;top:0.5rem;right:0.5rem;display:none;align-items:center;justify-content:center;width:28px;height:28px;background:#243027;color:#fff;border:none;border-radius:9999px;cursor:pointer;padding:0;z-index:1;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`

    let widget = ''

    if (widgetStyle === 'card') {
      const imageHtml = image
        ? `<a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;"><img src="${escapeHtml(image)}" alt="${escapeHtml(title || 'Product')}" style="width:100%;height:auto;border-radius:0.75rem;object-fit:cover;aspect-ratio:1/1;" /></a>`
        : ''
      widget = `<div class="product-widget" style="position:relative;margin:1.5rem 0;padding:1.25rem;border:1px solid #e5e7eb;border-radius:1rem;background:#fff;max-width:24rem;">${removeBtn}${imageHtml}<div style="padding-top:1rem;"><h3 style="margin:0 0 0.5rem;font-size:1.25rem;font-weight:600;color:#243027;font-family:Georgia,serif;line-height:1.2;">${escapeHtml(title || 'Product')}</h3>${desc ? `<p style="margin:0 0 1rem;font-size:0.95rem;line-height:1.5;color:#243027b3;">${escapeHtml(desc)}</p>` : ''}<a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#243027;color:#fff;padding:0.75rem 1.5rem;border-radius:9999px;text-decoration:none;font-size:0.65rem;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;transition:opacity 0.2s;">${escapeHtml(label)}</a></div></div>`
    } else if (widgetStyle === 'banner') {
      const imageHtml = image
        ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title || 'Product')}" style="width:120px;height:120px;border-radius:0.5rem;object-fit:cover;flex-shrink:0;" />`
        : ''
      widget = `<div class="product-widget" style="position:relative;margin:1.5rem 0;padding:1rem;border:1px solid #e5e7eb;border-radius:0.75rem;background:#fff;max-width:32rem;display:flex;gap:1rem;align-items:center;">${removeBtn}${imageHtml}<div style="flex:1;min-width:0;"><h3 style="margin:0 0 0.25rem;font-size:1.1rem;font-weight:600;color:#243027;font-family:Georgia,serif;line-height:1.2;">${escapeHtml(title || 'Product')}</h3>${desc ? `<p style="margin:0 0 0.75rem;font-size:0.85rem;line-height:1.4;color:#243027b3;">${escapeHtml(desc)}</p>` : ''}<a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#243027;color:#fff;padding:0.5rem 1.25rem;border-radius:9999px;text-decoration:none;font-size:0.6rem;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;">${escapeHtml(label)}</a></div></div>`
    } else {
      const imageHtml = image
        ? `<a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;"><img src="${escapeHtml(image)}" alt="${escapeHtml(title || 'Product')}" style="width:100%;height:auto;border-radius:0.5rem;object-fit:cover;max-height:200px;" /></a>`
        : ''
      widget = `<div class="product-widget" style="position:relative;margin:1.5rem 0;max-width:24rem;">${removeBtn}${imageHtml}<div style="padding-top:0.75rem;"><h3 style="margin:0 0 0.25rem;font-size:1.1rem;font-weight:600;color:#243027;font-family:Georgia,serif;line-height:1.2;"><a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="color:#243027;text-decoration:none;">${escapeHtml(title || 'Product')}</a></h3>${desc ? `<p style="margin:0 0 0.5rem;font-size:0.9rem;line-height:1.5;color:#243027b3;">${escapeHtml(desc)}</p>` : ''}<a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="color:#76885B;text-decoration:underline;font-size:0.8rem;font-weight:500;">${escapeHtml(label)} &rarr;</a></div></div>`
    }

    if (savedRangeRef.current) {
      const range = savedRangeRef.current
      const fragment = document.createRange().createContextualFragment(widget)
      range.deleteContents()
      range.insertNode(fragment)
    } else {
      editor.innerHTML += widget
    }

    onChange(editor.innerHTML)
    closeModal()
  }

  return (
    <>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={openModal}
        title="Product Widget"
        className="flex h-8 w-8 items-center justify-center rounded text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
      >
        <Package className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="w-full max-w-md rounded-2xl border border-[#243027]/15 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#243027]/10 px-6 py-4">
              <h3 className="font-serif text-lg text-[#243027]">Insert Product Widget</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 px-6 py-3">
              {([1, 2, 3] as const).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      step >= s
                        ? 'bg-[#243027] text-white'
                        : 'bg-[#243027]/10 text-[#243027]/40'
                    }`}
                  >
                    {step > s ? <Check className="h-3 w-3" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`h-px w-8 transition-colors ${step > s ? 'bg-[#243027]' : 'bg-[#243027]/15'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="px-6 py-4">
              {/* Step 1: Image */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {(['upload', 'recent'] as const).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setPickerTab(sub)}
                        className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                          pickerTab === sub
                            ? 'bg-[#243027] text-white'
                            : 'bg-[#F8F7F4] text-[#243027]/60 hover:bg-[#243027]/10 hover:text-[#243027]'
                        }`}
                      >
                        {sub === 'upload' ? 'Upload' : 'Recent'}
                      </button>
                    ))}
                  </div>

                  {pickerTab === 'upload' && (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#243027]/15 p-10 transition-colors hover:border-[#76885B] hover:bg-[#76885B]/5 disabled:opacity-60"
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

                  {pickerTab === 'recent' && (
                    <>
                      {loading && (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-6 w-6 animate-spin text-[#243027]/40" />
                        </div>
                      )}

                      {fetchError && <p className="py-8 text-center text-sm text-red-600">{fetchError}</p>}

                      {!loading && !fetchError && images.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-[#243027]/40">
                          <ImageIcon className="mb-3 h-8 w-8" />
                          <p className="text-sm">No images uploaded yet.</p>
                        </div>
                      )}

                      {!loading && !fetchError && images.length > 0 && (
                        <div className="grid max-h-[280px] grid-cols-4 gap-3 overflow-y-auto">
                          {images.map((img) => (
                            <button
                              key={img.name}
                              type="button"
                              onClick={() => handleSelectRecent(img)}
                              className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                imageUrl === img.url
                                  ? 'border-[#76885B] ring-2 ring-[#76885B]/30'
                                  : 'border-[#243027]/10 hover:border-[#76885B]/50'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={img.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                              {imageUrl === img.url && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#76885B]/20">
                                  <Check className="h-5 w-5 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {imageUrl && (
                    <div className="flex items-center gap-2 rounded-lg bg-[#76885B]/10 px-3 py-2">
                      <Check className="h-4 w-4 text-[#76885B]" />
                      <span className="text-xs text-[#243027]/70">Image selected</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product name"
                      className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      placeholder="Short description"
                      className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">CTA Label</label>
                      <input
                        type="text"
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                        placeholder="Shop Now"
                        className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">Destination URL *</label>
                      <input
                        type="text"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-600">{error}</p>}
                </div>
              )}

              {/* Step 3: Style */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-center text-xs text-[#243027]/50">Choose a widget layout style</p>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { key: 'card', label: 'Card' },
                      { key: 'banner', label: 'Banner' },
                      { key: 'minimal', label: 'Minimal' },
                    ] as const).map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setWidgetStyle(s.key)}
                        className={`rounded-xl border-2 px-2 py-4 text-center transition-all ${
                          widgetStyle === s.key
                            ? 'border-[#76885B] bg-[#76885B]/5 ring-1 ring-[#76885B]/30'
                            : 'border-[#243027]/15 hover:border-[#243027]/30'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-center">
                          {s.key === 'card' && (
                            <div className="h-10 w-12 rounded-lg border border-[#243027]/20 bg-[#F8F7F4]">
                              <div className="mx-auto mt-1.5 h-4 w-8 rounded bg-[#243027]/15" />
                              <div className="mx-auto mt-1 h-1 w-6 rounded bg-[#243027]/10" />
                            </div>
                          )}
                          {s.key === 'banner' && (
                            <div className="flex h-10 w-12 items-center gap-1 rounded-lg border border-[#243027]/20 bg-[#F8F7F4] px-1.5">
                              <div className="h-6 w-4 rounded bg-[#243027]/15" />
                              <div className="flex-1 space-y-1">
                                <div className="h-1.5 w-full rounded bg-[#243027]/15" />
                                <div className="h-1 w-2/3 rounded bg-[#243027]/10" />
                              </div>
                            </div>
                          )}
                          {s.key === 'minimal' && (
                            <div className="h-10 w-12 rounded-lg bg-[#F8F7F4]">
                              <div className="mx-auto h-5 w-9 rounded-t bg-[#243027]/10" />
                              <div className="mx-auto mt-1.5 h-1 w-7 rounded bg-[#243027]/15" />
                              <div className="mx-auto mt-1 h-0.5 w-5 rounded bg-[#76885B]/40" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#243027]/70">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">Preview</p>
                    <div className="rounded-lg border border-[#243027]/10 bg-[#F8F7F4] p-4">
                      {widgetStyle === 'card' && (
                        <div className="mx-auto max-w-xs rounded-xl border border-[#e5e7eb] bg-white p-5">
                          {imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={name || 'Product'} className="aspect-square w-full rounded-lg object-cover" />
                          )}
                          <div className="pt-3">
                            <h3 className="mb-1 font-serif text-base font-semibold text-[#243027]">{name || 'Product'}</h3>
                            {description && <p className="mb-3 text-sm leading-relaxed text-[#243027]/70">{description}</p>}
                            <span className="inline-block rounded-full bg-[#243027] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white">{ctaLabel || 'Shop Now'}</span>
                          </div>
                        </div>
                      )}

                      {widgetStyle === 'banner' && (
                        <div className="mx-auto flex max-w-md items-center gap-4 rounded-xl border border-[#e5e7eb] bg-white p-4">
                          {imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={name || 'Product'} className="h-24 w-24 flex-shrink-0 rounded-lg object-cover" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="mb-1 font-serif text-base font-semibold text-[#243027]">{name || 'Product'}</h3>
                            {description && <p className="mb-2 text-sm leading-snug text-[#243027]/70">{description}</p>}
                            <span className="inline-block rounded-full bg-[#243027] px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">{ctaLabel || 'Shop Now'}</span>
                          </div>
                        </div>
                      )}

                      {widgetStyle === 'minimal' && (
                        <div className="mx-auto max-w-xs">
                          {imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={name || 'Product'} className="w-full rounded-lg object-cover" style={{ maxHeight: '200px' }} />
                          )}
                          <div className="pt-3">
                            <h3 className="mb-1 font-serif text-base font-semibold text-[#243027]">{name || 'Product'}</h3>
                            {description && <p className="mb-2 text-sm leading-relaxed text-[#243027]/70">{description}</p>}
                            <span className="text-sm font-medium text-[#76885B] underline">{ctaLabel || 'Shop Now'} &rarr;</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer navigation */}
            <div className="flex items-center justify-between border-t border-[#243027]/10 px-6 py-4">
              <button
                type="button"
                onClick={() => (step === 1 ? closeModal() : setStep((step - 1) as 1 | 2 | 3))}
                className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${step >= s ? 'w-6 bg-[#243027]' : 'w-1.5 bg-[#243027]/20'}`}
                  />
                ))}
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                  disabled={step === 1 && !imageUrl}
                  className="rounded-full bg-[#243027] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B] disabled:opacity-40"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => apply()}
                  className="rounded-full bg-[#243027] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B]"
                >
                  Insert Widget
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
