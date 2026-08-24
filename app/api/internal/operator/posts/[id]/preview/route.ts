import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { getPreviewForOperator } from '@/lib/operator-blogs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.preview')
    const { id } = await params
    const previewUrl = await getPreviewForOperator(id)

    if (!previewUrl) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ preview_url: previewUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
