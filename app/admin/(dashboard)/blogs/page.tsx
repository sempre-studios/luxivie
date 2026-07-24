import Link from 'next/link'
import { getAllBlogsForAdmin, type BlogPost } from '@/lib/blogs'
import { Badge } from '@/components/ui/badge'
import { BlogDeleteButton } from './BlogDeleteButton'

export const dynamic = 'force-dynamic'

function formatDate(dateString?: string) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function AdminBlogsPage() {
  const posts = await getAllBlogsForAdmin()

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl text-[#243027]">Blog Posts</h1>
          <p className="mt-2 text-sm text-[#243027]/50">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blogs/new"
            className="rounded-full bg-[#243027] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#76885B]"
          >
            + New Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-[#243027]/10 bg-white p-16 text-center">
          <p className="text-[#243027]/50">No blog posts yet. Create your first post.</p>
          <Link
            href="/admin/blogs/new"
            className="mt-6 inline-block rounded-full bg-[#243027] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-[#76885B]"
          >
            + New Post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#243027]/10 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#243027]/10 bg-[#F2F0EB]/50">
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">Title</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">Published</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">Updated</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#243027]/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: BlogPost) => (
                <tr key={post.id} className="border-b border-[#243027]/5 transition-colors hover:bg-[#F2F0EB]/30">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#243027]">{post.title}</div>
                    <div className="mt-1 font-mono text-xs text-[#243027]/30">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={post.status === 'published' ? 'default' : post.status === 'scheduled' ? 'outline' : 'secondary'}
                      className={
                        post.status === 'published'
                          ? 'bg-[#76885B]/10 text-[#76885B] hover:bg-[#76885B]/20'
                          : post.status === 'scheduled'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-[#243027]/5 text-[#243027]/50 hover:bg-[#243027]/10'
                      }
                    >
                      {post.status === 'published' ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#243027]/60">{formatDate(post.publishedAt)}</td>
                  <td className="px-6 py-4 text-sm text-[#243027]/60">{formatDate(post.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/blogs/${post.slug}/edit`}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#76885B] transition-colors hover:text-[#243027]"
                      >
                        Edit
                      </Link>
                      <BlogDeleteButton slug={post.slug} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
