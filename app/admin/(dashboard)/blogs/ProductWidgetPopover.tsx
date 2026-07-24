'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Package, X } from 'lucide-react'

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

export function ProductWidgetPopover({ editorRef, onChange }: ProductWidgetPopoverProps) {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ctaLabel, setCtaLabel] = useState('Shop Now')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [error, setError] = useState('')
  const savedRangeRef = useRef<Range | null>(null)

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
    setOpen(true)
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

  function apply(e: React.FormEvent) {
    e.preventDefault()
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

    const imageHtml = image
      ? `<a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;">
  <img src="${escapeHtml(image)}" alt="${escapeHtml(title || 'Product')}" style="width:100%;height:auto;border-radius:0.75rem;object-fit:cover;aspect-ratio:1/1;" />
</a>`
      : ''

    const widget = `<div class="product-widget" style="margin:1.5rem 0;padding:1.25rem;border:1px solid #e5e7eb;border-radius:1rem;background:#fff;max-width:24rem;">
  ${imageHtml}
  <div style="padding-top:1rem;">
    <h3 style="margin:0 0 0.5rem;font-size:1.25rem;font-weight:600;color:#243027;font-family:Georgia,serif;line-height:1.2;">${escapeHtml(title || 'Product')}</h3>
    ${desc ? `<p style="margin:0 0 1rem;font-size:0.95rem;line-height:1.5;color:#243027b3;">${escapeHtml(desc)}</p>` : ''}
    <a href="${escapeHtml(destHref)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#243027;color:#fff;padding:0.75rem 1.5rem;border-radius:9999px;text-decoration:none;font-size:0.65rem;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;transition:opacity 0.2s;">${escapeHtml(label)}</a>
  </div>
</div>`

    const sel = window.getSelection()
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }

    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null
    if (range) {
      const fragment = document.createRange().createContextualFragment(widget)
      range.deleteContents()
      range.insertNode(fragment)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20" onClick={closeModal}>
          <div className="w-full max-w-md rounded-lg border border-[#243027]/15 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
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

            <form onSubmit={apply} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                />
              </div>
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

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#243027] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B]"
                >
                  Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
