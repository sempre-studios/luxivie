import { getBusinessSettings } from '@/lib/settings'
import { SOCIAL_NETWORKS } from '@/lib/social'

interface SocialLinksProps {
  visibility?: Record<string, boolean> | null
}

export async function SocialLinks({ visibility }: SocialLinksProps) {
  const { socialLinks } = await getBusinessSettings()
  const icons: Record<string, string> = {
    instagram: 'ph-instagram-logo',
    pinterest: 'ph-pinterest-logo',
    tiktok: 'ph-tiktok-logo',
    x: 'ph-x-logo',
    facebook: 'ph-facebook-logo',
    youtube: 'ph-youtube-logo',
    linkedin: 'ph-linkedin-logo',
  }

  const visibleLinks = SOCIAL_NETWORKS.filter(
    ({ key }) => socialLinks[key] && visibility?.[key] !== false
  )

  if (visibleLinks.length === 0) return null

  return (
    <div className="flex gap-4">
      {visibleLinks.map(({ key, label }) => (
        <a
          key={key}
          href={socialLinks[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-lux-text/10 transition-all hover:bg-lux-accent hover:text-white"
          aria-label={label}
        >
          <i className={`ph ${icons[key]} text-xl`} aria-hidden />
        </a>
      ))}
    </div>
  )
}
