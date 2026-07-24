import Link from 'next/link'
import { BlogForm } from '../BlogForm'

export const dynamic = 'force-dynamic'

export default function NewBlogPage() {
  return (
    <div>
      <div className="mb-10">
        <Link
          href="/admin/blogs"
          className="text-[10px] font-bold uppercase tracking-widest text-[#76885B] transition-colors hover:text-[#243027]"
        >
          ← Back to Blog Posts
        </Link>
        <h1 className="mt-4 font-serif text-4xl text-[#243027]">New Blog Post</h1>
      </div>

      <div className="rounded-lg border border-[#243027]/10 bg-white p-6 lg:p-8">
        <BlogForm mode="create" />
      </div>
    </div>
  )
}
