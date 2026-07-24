import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/admin-auth'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authed = await isAuthenticated()

  if (!authed) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-[#243027]">
      <header className="border-b border-[#243027]/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/blogs" className="flex items-center gap-2">
              <Image src="/luxivie-logo.png" alt="LUXIVIE" width={96} height={32} className="h-8 w-auto" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#76885B]">Admin</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/admin/blogs"
                className="text-sm font-medium text-[#243027]/70 transition-colors hover:text-[#243027]"
              >
                Blog Posts
              </Link>
              <Link
                href="/admin/settings"
                className="text-sm font-medium text-[#243027]/70 transition-colors hover:text-[#243027]"
              >
                Settings
              </Link>
              <Link
                href="/blog"
                target="_blank"
                className="text-sm font-medium text-[#243027]/70 transition-colors hover:text-[#243027]"
              >
                View Blog →
              </Link>
            </nav>
          </div>
          <form action="/api/admin/auth" method="DELETE">
            <button
              type="submit"
              className="rounded-full border border-[#243027]/10 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[#243027]/60 transition-all hover:bg-[#243027] hover:text-white"
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-12">{children}</main>
    </div>
  )
}
