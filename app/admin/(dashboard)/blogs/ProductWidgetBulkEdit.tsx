'use client'

import { useCallback, useEffect, useState } from 'react'
import { PackageCheck, X } from 'lucide-react'

interface ProductWidgetBulkEditProps {
  editorRef: React.RefObject<HTMLDivElement | null>
  onChange: (html: string) => void
}

interface WidgetItem {
  index: number
  selected: boolean
  title: string
  imageUrl: string
  ctaLabel: string
  destinationUrl: string
  style: string
}

function findFallbackCta(widget: HTMLElement): HTMLAnchorElement | null {
  const style = widget.getAttribute('data-style')
  if (style === 'minimal') {
    return (
      (widget.querySelector('a[style*="text-decoration:underline"]') as HTMLAnchorElement | null) ||
      getLastAnchor(widget)
    )
  }
  return (
    (widget.querySelector('a[style*="border-radius:9999px"]') as HTMLAnchorElement | null) ||
    getLastAnchor(widget)
  )
}

function getLastAnchor(widget: HTMLElement): HTMLAnchorElement | null {
  const anchors = widget.querySelectorAll('a')
  return (anchors[anchors.length - 1] as HTMLAnchorElement | undefined) || null
}

export function ProductWidgetBulkEdit({ editorRef, onChange }: ProductWidgetBulkEditProps) {
  const [open, setOpen] = useState(false)
  const [widgets, setWidgets] = useState<WidgetItem[]>([])
  const [ctaLabel, setCtaLabel] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [error, setError] = useState('')

  const refreshWidgets = useCallback(() => {
    const editor = editorRef.current
    if (!editor) {
      setWidgets([])
      return
    }

    const nodes = editor.querySelectorAll('.product-widget')
    const list: WidgetItem[] = []
    nodes.forEach((node, index) => {
      const el = node as HTMLElement
      const img = el.querySelector('img')
      const h3 = el.querySelector('h3')
      const ctaLink =
        (el.querySelector('a.product-widget-cta') as HTMLAnchorElement | null) ||
        (el.querySelector('a[href]') as HTMLAnchorElement | null)
      list.push({
        index,
        selected: true,
        title: h3?.textContent?.trim() || 'Product',
        imageUrl: img?.getAttribute('src') || '',
        ctaLabel: el.getAttribute('data-cta') || ctaLink?.textContent?.replace(/\s*→\s*$/, '').trim() || 'Shop Now',
        destinationUrl: el.getAttribute('data-dest') || ctaLink?.getAttribute('href') || '',
        style: el.getAttribute('data-style') || 'card',
      })
    })
    setWidgets(list)
  }, [editorRef])

  const closeModal = useCallback(() => {
    setOpen(false)
    setError('')
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

  function openModal() {
    setCtaLabel('')
    setDestinationUrl('')
    setError('')
    refreshWidgets()
    setOpen(true)
  }

  function toggleSelectAll() {
    const allSelected = widgets.every((w) => w.selected)
    setWidgets(widgets.map((w) => ({ ...w, selected: !allSelected })))
  }

  function toggleWidget(index: number) {
    setWidgets(widgets.map((w) => (w.index === index ? { ...w, selected: !w.selected } : w)))
  }

  function apply() {
    const editor = editorRef.current
    if (!editor) return

    const selected = widgets.filter((w) => w.selected)
    if (selected.length === 0) {
      setError('Select at least one widget')
      return
    }

    const newCtaLabel = ctaLabel.trim()
    const newDest = destinationUrl.trim()

    if (!newCtaLabel && !newDest) {
      setError('Enter a new CTA label or destination URL')
      return
    }

    let destHref = newDest
    if (newDest && /^(javascript|data|vbscript):/i.test(newDest)) {
      setError('Invalid destination URL')
      return
    }
    if (newDest && !/^https?:\/\//i.test(destHref) && !destHref.startsWith('/') && !destHref.startsWith('#')) {
      destHref = `https://${destHref}`
    }

    const nodes = editor.querySelectorAll('.product-widget')
    selected.forEach((item) => {
      const widget = nodes[item.index] as HTMLElement | undefined
      if (!widget) return

      if (newCtaLabel) {
        widget.setAttribute('data-cta', newCtaLabel)
        const ctaLink = widget.querySelector('a.product-widget-cta') as HTMLAnchorElement | null
        if (ctaLink) {
          ctaLink.textContent = widget.getAttribute('data-style') === 'minimal' ? `${newCtaLabel} →` : newCtaLabel
        } else {
          const fallback = findFallbackCta(widget)
          if (fallback) {
            fallback.textContent = widget.getAttribute('data-style') === 'minimal' ? `${newCtaLabel} →` : newCtaLabel
          }
        }
      }

      if (destHref) {
        widget.setAttribute('data-dest', destHref)
        widget.querySelectorAll('a').forEach((a) => {
          a.setAttribute('href', destHref)
        })
      }
    })

    onChange(editor.innerHTML)
    closeModal()
  }

  const allSelected = widgets.length > 0 && widgets.every((w) => w.selected)

  return (
    <>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={openModal}
        title="Bulk edit product widgets"
        className="flex h-8 w-8 items-center justify-center rounded text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
      >
        <PackageCheck className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#243027]/15 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#243027]/10 px-6 py-4">
              <h3 className="font-serif text-lg text-[#243027]">Bulk Update Product Widgets</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {widgets.length === 0 ? (
                <p className="text-sm text-[#243027]/60">No product widgets in this post yet.</p>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                        New CTA Label
                      </label>
                      <input
                        type="text"
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                        placeholder="Shop Now"
                        className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                        New Destination URL
                      </label>
                      <input
                        type="text"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#243027]/40">Leave a field blank to keep its current value.</p>

                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#243027]">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-[#243027]/20 accent-[#76885B]"
                      />
                      Select all
                    </label>

                    <div className="divide-y divide-[#243027]/10 overflow-hidden rounded-lg border border-[#243027]/10">
                      {widgets.map((w) => (
                        <label
                          key={w.index}
                          className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-[#F8F7F4]"
                        >
                          <input
                            type="checkbox"
                            checked={w.selected}
                            onChange={() => toggleWidget(w.index)}
                            className="h-4 w-4 rounded border-[#243027]/20 accent-[#76885B]"
                          />
                          {w.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={w.imageUrl} alt="" className="h-12 w-12 flex-shrink-0 rounded object-cover" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#243027]">{w.title}</p>
                            <p className="truncate text-xs text-[#243027]/60">
                              {w.ctaLabel}
                              {w.destinationUrl && <span className="ml-2 text-[#243027]/40">· {w.destinationUrl}</span>}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-600">{error}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between border-t border-[#243027]/10 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={widgets.length === 0}
                className="rounded-full bg-[#243027] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B] disabled:opacity-40"
              >
                Apply to selected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
