'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface BlogDeleteButtonProps {
  slug: string
  title: string
}

export function BlogDeleteButton({ slug, title }: BlogDeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/blogs/${slug}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        console.error('Delete failed')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      console.error('Delete error')
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="text-[10px] font-bold uppercase tracking-widest text-red-600/70 transition-colors hover:text-red-600"
        >
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg border-[#243027]/10 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl text-[#243027]">Delete post?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#243027]/60">
            Are you sure you want to delete <strong>&ldquo;{title}&rdquo;</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full border-[#243027]/15 text-[10px] font-bold uppercase tracking-widest">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="rounded-full bg-red-600 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-700"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
