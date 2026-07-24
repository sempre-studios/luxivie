'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link2, Unlink, X } from 'lucide-react'

interface PostOption {
  slug: string
  title: string
}

const HOMEPAGE_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'values', label: 'Values' },
  { id: 'products', label: 'Products' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'ritual', label: 'Ritual' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'cta', label: 'Final CTA' },
  { id: 'footer', label: 'Footer' },
]

interface LinkPopoverProps {
  editorRef: React.RefObject<HTMLDivElement | null>
  onChange: (html: string) => void
}

export function LinkPopover({ editorRef, onChange }: LinkPopoverProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'article' | 'section' | 'external'>('article')
  const [text, setText] = useState('')
  const [articleSlug, setArticleSlug] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [articleOptions, setArticleOptions] = useState<PostOption[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [articleError, setArticleError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [existingAnchor, setExistingAnchor] = useState<HTMLAnchorElement | null>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const existingAnchorRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (!open || articleOptions.length > 0 || loadingArticles) return

    setLoadingArticles(true)
    setArticleError('')
    fetch('/api/admin/blogs')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load articles')
        const data = await res.json()
        const posts = (data.posts || []).map((p: { slug?: string; title?: string }) => ({
          slug: p.slug || '',
          title: p.title || '(Untitled)',
        }))
        setArticleOptions(posts)
      })
      .catch(() => setArticleError('Failed to load articles'))
      .finally(() => setLoadingArticles(false))
  }, [open, articleOptions.length, loadingArticles])

  function findAnchor(sel: Selection | null): HTMLAnchorElement | null {
    const editor = editorRef.current
    if (!editor || !sel?.anchorNode) return null
    let node: Node | null = sel.anchorNode
    while (node && node !== editor) {
      if (node instanceof HTMLAnchorElement) return node
      node = node.parentNode
    }
    return null
  }

  function captureSelection(e: React.MouseEvent) {
    e.preventDefault()
    const sel = window.getSelection()
    savedRangeRef.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null
    existingAnchorRef.current = findAnchor(sel)
  }

  function openLinkModal(e: React.MouseEvent) {
    e.preventDefault()
    const editor = editorRef.current
    if (!editor) return

    const anchor = existingAnchorRef.current
    setExistingAnchor(anchor)

    if (anchor) {
      const href = anchor.getAttribute('href') || ''
      setText(anchor.textContent || '')
      if (href.startsWith('/blog/')) {
        setMode('article')
        setArticleSlug(href.replace('/blog/', ''))
        setSectionId('')
        setExternalUrl('')
      } else if (href.startsWith('/#')) {
        setMode('section')
        setSectionId(href.slice(2))
        setArticleSlug('')
        setExternalUrl('')
      } else {
        setMode('external')
        setExternalUrl(href)
        setArticleSlug('')
        setSectionId('')
      }
    } else {
      setMode('article')
      setText(savedRangeRef.current ? savedRangeRef.current.toString() : '')
      setArticleSlug('')
      setSectionId('')
      setExternalUrl('')
    }

    setValidationError('')
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

  function buildHref(): string | null {
    setValidationError('')
    if (mode === 'article') {
      if (!articleSlug) {
        setValidationError('Select an article')
        return null
      }
      return `/blog/${articleSlug}`
    }

    if (mode === 'section') {
      if (!sectionId) {
        setValidationError('Select a section')
        return null
      }
      return `/#${sectionId}`
    }

    const raw = externalUrl.trim()
    if (!raw) {
      setValidationError('Enter a URL')
      return null
    }
    if (/^(javascript|data|vbscript):/i.test(raw)) {
      setValidationError('Invalid URL')
      return null
    }
    let url = raw
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('#')) {
      url = `https://${url}`
    }
    return url
  }

  function apply() {
    const editor = editorRef.current
    if (!editor) return

    const href = buildHref()
    if (!href) return

    const trimmedText = text.trim()
    if (!trimmedText) {
      setValidationError('Link text is required')
      return
    }

    const a = document.createElement('a')
    a.setAttribute('href', href)
    a.textContent = trimmedText

    if (existingAnchor) {
      existingAnchor.setAttribute('href', href)
      existingAnchor.textContent = trimmedText
    } else if (savedRangeRef.current) {
      const range = savedRangeRef.current
      range.deleteContents()
      range.insertNode(a)
    } else {
      editor.appendChild(a)
    }

    onChange(editor.innerHTML)
    closeModal()
  }

  function remove(e: React.MouseEvent) {
    e.preventDefault()
    const editor = editorRef.current
    const anchor = existingAnchor
    if (!editor || !anchor) return

    const parent = anchor.parentNode
    if (parent) {
      while (anchor.firstChild) {
        parent.insertBefore(anchor.firstChild, anchor)
      }
      parent.removeChild(anchor)
      if (parent.normalize) parent.normalize()
    }

    onChange(editor.innerHTML)
    closeModal()
  }

  const modeLabel: Record<typeof mode, string> = {
    article: 'Article',
    section: 'Homepage Section',
    external: 'External URL',
  }

  return (
    <>
      <button
        type="button"
        onMouseDown={captureSelection}
        onClick={openLinkModal}
        title="Link"
        className="flex h-8 w-8 items-center justify-center rounded text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
      >
        {existingAnchor ? <Unlink className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20" onClick={closeModal}>
          <div className="w-full max-w-md rounded-lg border border-[#243027]/15 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#243027]">
                {existingAnchor ? 'Edit Link' : 'Insert Link'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-[#243027]/50 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                {(['article', 'section', 'external'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m)
                      setValidationError('')
                    }}
                    className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      mode === m
                        ? 'bg-[#243027] text-white'
                        : 'bg-[#F8F7F4] text-[#243027]/60 hover:bg-[#243027]/10 hover:text-[#243027]'
                    }`}
                  >
                    {modeLabel[m]}
                  </button>
                ))}
              </div>

              {mode === 'article' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                    Article
                  </label>
                  <select
                    value={articleSlug}
                    onChange={(e) => setArticleSlug(e.target.value)}
                    disabled={loadingArticles}
                    className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                  >
                    <option value="">{loadingArticles ? 'Loading…' : 'Select an article'}</option>
                    {articleOptions.map((post) => (
                      <option key={post.slug} value={post.slug}>
                        {post.title}
                      </option>
                    ))}
                  </select>
                  {articleError && <p className="text-xs text-red-600">{articleError}</p>}
                </div>
              )}

              {mode === 'section' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                    Homepage Section
                  </label>
                  <select
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                    className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                  >
                    <option value="">Select a section</option>
                    {HOMEPAGE_SECTIONS.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {mode === 'external' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                    URL
                  </label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#243027]/60">
                  Link Text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Display text"
                  className="w-full rounded-lg border border-[#243027]/15 bg-white px-3 py-2.5 text-sm text-[#243027] outline-none focus:border-[#76885B]"
                />
              </div>

              {validationError && (
                <p className="text-xs text-red-600">{validationError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                {existingAnchor && (
                  <button
                    type="button"
                    onClick={remove}
                    className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-700 transition-colors hover:bg-red-50"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => apply()}
                  className="rounded-full bg-[#243027] px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#76885B]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
