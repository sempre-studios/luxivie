import { AdminSettingsClient } from './AdminSettingsClient'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#243027]">Settings</h1>
      </div>
      <AdminSettingsClient />
    </div>
  )
}
