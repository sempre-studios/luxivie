import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogBySlugForAdmin } from '@/lib/blogs'
import { BlogForm } from '../../BlogForm'

export const dynamic = 'force-dynamic'

interface EditBlogPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { slug } = await params
  const post = await getBlogBySlugForAdmin(slug)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <div className="mb-10">
        <Link
          href="/admin/blogs"
          className="text-[10px] font-bold uppercase tracking-widest text-[#76885B] transition-colors hover:text-[#243027]"
        >
          ← Back to Blog Posts
        </Link>
        <h1 className="mt-4 font-serif text-4xl text-[#243027]">Edit Blog Post</h1>
        <p className="mt-2 font-mono text-xs text-[#243027]/30">/{post.slug}</p>
      </div>

      <div className="rounded-lg border border-[#243027]/10 bg-white p-6 lg:p-8">
        <BlogForm mode="edit" post={post} />
      </div>
    </div>
  )
}
