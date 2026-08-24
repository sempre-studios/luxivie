import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { getBlogByIdForOperator } from '@/lib/operator-blogs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.detail')
    const { id } = await params
    const post = await getBlogByIdForOperator(id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
