'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Undo2,
  Redo2,
  X,
} from 'lucide-react'
import { LinkPopover } from './LinkPopover'
import { ProductWidgetPopover } from './ProductWidgetPopover'
import { MediaPicker } from './MediaPicker'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const isInternalChange = useRef(false)
  const savedImageRangeRef = useRef<Range | null>(null)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [hoveredWidget, setHoveredWidget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
    isInternalChange.current = false
  }, [value])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    function onMouseOver(e: MouseEvent) {
      const widget = (e.target as HTMLElement).closest('.product-widget') as HTMLElement | null
      if (widget) setHoveredWidget(widget)
    }
    function onMouseOut(e: MouseEvent) {
      const widget = (e.target as HTMLElement).closest('.product-widget') as HTMLElement | null
      const related = (e.relatedTarget as HTMLElement | null)?.closest?.('.product-widget, .product-widget-overlay') as HTMLElement | null
      const isOverlay = related?.classList.contains('product-widget-overlay')
      if (widget && related !== widget && !isOverlay) {
        setHoveredWidget((current) => (current === widget ? null : current))
      }
    }

    editor.addEventListener('mouseover', onMouseOver)
    editor.addEventListener('mouseout', onMouseOut)
    return () => {
      editor.removeEventListener('mouseover', onMouseOver)
      editor.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val)
    editorRef.current?.focus()
    handleInput()
  }

  const formatBlock = (tag: string) => {
    document.execCommand('formatBlock', false, tag)
    editorRef.current?.focus()
    handleInput()
  }

  const handleImageClick = () => {
    const sel = window.getSelection()
    savedImageRangeRef.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null
    setMediaPickerOpen(true)
  }

  const handleMediaSelect = (url: string) => {
    const sel = window.getSelection()
    if (savedImageRangeRef.current && sel) {
      sel.removeAllRanges()
      sel.addRange(savedImageRangeRef.current)
    }
    exec('insertImage', url)
  }


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault()
      exec('bold')
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault()
      exec('italic')
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
      e.preventDefault()
      exec('underline')
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const widget = target.closest('.product-widget')
    if (widget) {
      e.preventDefault()
      e.stopPropagation()
      if (target.closest('.product-widget-remove') && editorRef.current) {
        widget.remove()
        handleInput()
      }
    }
  }

  const toolbarBtn = (onClick: () => void, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded text-[#243027]/60 transition-colors hover:bg-[#243027]/10 hover:text-[#243027]"
    >
      {icon}
    </button>
  )

  const divider = <div className="mx-1 h-5 w-px bg-[#243027]/10" />

  return (
    <div ref={wrapperRef} className="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-[#243027]/15 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#243027]/10 bg-[#F8F7F4] px-2 py-1.5">
        {toolbarBtn(() => exec('undo'), <Undo2 className="h-4 w-4" />, 'Undo')}
        {toolbarBtn(() => exec('redo'), <Redo2 className="h-4 w-4" />, 'Redo')}
        {divider}
        {toolbarBtn(() => exec('bold'), <Bold className="h-4 w-4" />, 'Bold (⌘B)')}
        {toolbarBtn(() => exec('italic'), <Italic className="h-4 w-4" />, 'Italic (⌘I)')}
        {toolbarBtn(() => exec('underline'), <Underline className="h-4 w-4" />, 'Underline (⌘U)')}
        {divider}
        {toolbarBtn(() => formatBlock('<h2>'), <Heading2 className="h-4 w-4" />, 'Heading 2')}
        {toolbarBtn(() => formatBlock('<h3>'), <Heading3 className="h-4 w-4" />, 'Heading 3')}
        {toolbarBtn(() => formatBlock('<p>'), <span className="text-xs font-bold">P</span>, 'Paragraph')}
        {divider}
        {toolbarBtn(() => exec('insertUnorderedList'), <List className="h-4 w-4" />, 'Bullet List')}
        {toolbarBtn(() => exec('insertOrderedList'), <ListOrdered className="h-4 w-4" />, 'Numbered List')}
        {toolbarBtn(() => formatBlock('<blockquote>'), <Quote className="h-4 w-4" />, 'Quote')}
        {divider}
        <LinkPopover editorRef={editorRef} onChange={handleInput} />
        {toolbarBtn(handleImageClick, <ImageIcon className="h-4 w-4" />, 'Image')}
        <ProductWidgetPopover editorRef={editorRef} onChange={handleInput} />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        data-placeholder={placeholder}
        className="rich-text-editor min-h-[calc(100vh-380px)] flex-1 overflow-y-auto px-6 py-4 font-serif text-[15px] leading-relaxed text-[#243027] outline-none"
      />

      {hoveredWidget && wrapperRef.current && (
        (() => {
          const widgetRect = hoveredWidget.getBoundingClientRect()
          const wrapperRect = wrapperRef.current.getBoundingClientRect()
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                hoveredWidget.remove()
                setHoveredWidget(null)
                handleInput()
              }}
              onMouseLeave={() => setHoveredWidget(null)}
              style={{
                position: 'absolute',
                top: widgetRect.top - wrapperRect.top + 8,
                right: wrapperRect.right - widgetRect.right + 8,
              }}
              className="product-widget-overlay flex h-7 w-7 items-center justify-center rounded-full bg-[#243027] text-white shadow-lg transition-colors hover:bg-[#76885B]"
              aria-label="Remove product widget"
            >
              <X className="h-4 w-4" />
            </button>
          )
        })()
      )}

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
      <style jsx>{`
        .rich-text-editor:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .rich-text-editor :global(h2) {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1.25rem 0 0.75rem;
          font-family: Georgia, serif;
        }
        .rich-text-editor :global(h3) {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          font-family: Georgia, serif;
        }
        .rich-text-editor :global(p) {
          margin: 0.5rem 0;
        }
        .rich-text-editor :global(ul) {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor :global(ol) {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor :global(blockquote) {
          border-left: 3px solid #76885B;
          padding-left: 1rem;
          margin: 0.75rem 0;
          font-style: italic;
          color: #4b5563;
        }
        .rich-text-editor :global(a) {
          color: #76885B;
          text-decoration: underline;
        }
        .rich-text-editor :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.75rem 0;
        }
        .rich-text-editor :global(.product-widget:hover .product-widget-remove) {
          display: flex !important;
        }
        .rich-text-editor :global(strong) {
          font-weight: 700;
        }
        .rich-text-editor :global(em) {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
