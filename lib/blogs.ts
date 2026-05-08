export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image_url?: string
  author?: string
  publishedAt: string
  readTime?: string
  category?: string
  tags?: string[]
  updatedAt?: string
}

/**
 * Get the client CMS API URL and site code from environment variables
 */
function getClientCmsConfig(): { apiUrl: string; siteCode: string } | null {
  const apiUrl = process.env.CLIENT_CMS_API_URL?.trim()
  const siteCode = process.env.CLIENT_CMS_SITE_CODE?.trim()

  if (!apiUrl || !siteCode) {
    console.warn('[blogs] CLIENT_CMS_API_URL or CLIENT_CMS_SITE_CODE not configured')
    return null
  }

  return { apiUrl, siteCode }
}

/**
 * Get all published blogs from client CMS API
 */
export async function getPublishedBlogs(
  businessSlug?: string
): Promise<BlogPost[]> {
  try {
    const config = getClientCmsConfig()
    if (!config) {
      return []
    }

    const { apiUrl, siteCode } = config
    const response = await fetch(`${apiUrl}/api/v1/websites/${siteCode}/posts`, {
      headers: {
        'X-API-Key': siteCode,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[blogs] Client CMS API error:', response.status, response.statusText)
      return []
    }

    const data = await response.json()
    const posts = data.data || []

    return posts.map((post: any) => ({
      id: String(post.id),
      title: post.title,
      slug: post.slug,
      excerpt: post.meta_description || undefined,
      content: post.body || '',
      image_url: undefined,
      author: undefined,
      publishedAt: post.publish_at || post.created_at,
      readTime: undefined,
      category: undefined,
      tags: undefined,
      updatedAt: post.updated_at,
    }))
  } catch (error) {
    console.error('Error in getPublishedBlogs:', error)
    return []
  }
}

/**
 * Get a single published blog by slug from client CMS API
 */
export async function getBlogBySlug(
  slug: string,
  businessSlug?: string
): Promise<BlogPost | null> {
  try {
    const config = getClientCmsConfig()
    if (!config) {
      return null
    }

    const { apiUrl, siteCode } = config
    const response = await fetch(`${apiUrl}/api/v1/websites/${siteCode}/posts`, {
      headers: {
        'X-API-Key': siteCode,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[blogs] Client CMS API error:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    const posts = data.data || []
    const post = posts.find((p: any) => p.slug === slug)

    if (!post) {
      return null
    }

    return {
      id: String(post.id),
      title: post.title,
      slug: post.slug,
      excerpt: post.meta_description || undefined,
      content: post.body || '',
      image_url: undefined,
      author: undefined,
      publishedAt: post.publish_at || post.created_at,
      readTime: undefined,
      category: undefined,
      tags: undefined,
      updatedAt: post.updated_at,
    }
  } catch (error) {
    console.error('Error in getBlogBySlug:', error)
    return null
  }
}
