import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { CommentItem } from './CommentItem'
import { useAuthStore } from '@/store/authStore'
import type { Comment } from '@/types'

async function fetchComments(slug: string): Promise<Comment[]> {
  const res = await fetch(`/api/entries/${slug}/comments`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

async function postComment(entrySlug: string, content: string, userId: string, userName: string) {
  const res = await fetch(`/api/entries/${entrySlug}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, parentId: null, userId, userName }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export function CommentSection({ entrySlug }: { entrySlug: string }) {
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const [text, setText] = useState('')

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', entrySlug],
    queryFn: () => fetchComments(entrySlug),
  })

  const mutation = useMutation({
    mutationFn: (content: string) => postComment(entrySlug, content, user!.id, user!.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entrySlug] })
      setText('')
    },
  })

  const roots = comments.filter(c => c.parentId === null)
  const replies = (parentId: string) => comments.filter(c => c.parentId === parentId)

  return (
    <section>
      <Separator className="my-8" />

      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Composer */}
      {isAuthenticated ? (
        <div className="mb-6 space-y-2">
          <Textarea
            placeholder="Share a tip, correction, or question…"
            value={text}
            onChange={e => setText(e.target.value)}
            className="min-h-[90px] resize-none text-sm"
          />
          <Button
            size="sm"
            disabled={!text.trim() || mutation.isPending}
            onClick={() => mutation.mutate(text.trim())}
            className="bg-[#448460] text-white hover:bg-[#3a7050] border-0"
          >
            {mutation.isPending ? 'Posting…' : 'Post comment'}
          </Button>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline underline-offset-2">Sign in</Link>
          {' '}or{' '}
          <Link to="/register" className="text-primary hover:underline underline-offset-2">create an account</Link>
          {' '}to comment.
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : roots.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No comments yet. Be the first.</p>
      ) : (
        <div className="space-y-5">
          {roots.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={replies(c.id)}
              entrySlug={entrySlug}
            />
          ))}
        </div>
      )}
    </section>
  )
}
