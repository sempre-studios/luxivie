import { NextRequest, NextResponse } from 'next/server'
import { assertOperatorServiceRequest } from '@/lib/operator-auth'
import { getEditorHandoffForOperator } from '@/lib/operator-blogs'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertOperatorServiceRequest(request, 'luxivie.posts.open_editor')
    const { id } = await params
    const body = await request.json()
    const url = await getEditorHandoffForOperator(id)

    if (!url) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ editor_handoff: url, action: body.action || 'edit' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
