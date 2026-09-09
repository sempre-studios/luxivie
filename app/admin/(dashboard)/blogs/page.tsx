import { getAllBlogsForAdmin } from '@/lib/blogs'
import { AdminBlogsList } from './AdminBlogsList'

export const dynamic = 'force-dynamic'

export default async function AdminBlogsPage() {
  const posts = await getAllBlogsForAdmin()
  return <AdminBlogsList posts={posts} />
}
