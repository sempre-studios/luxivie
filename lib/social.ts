export const SOCIAL_NETWORKS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'x', label: 'X / Twitter' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'linkedin', label: 'LinkedIn' },
] as const

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]['key']
