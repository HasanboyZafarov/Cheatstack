import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ThumbsUp, ThumbsDown, Star, Flag, CornerDownRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import type { Comment, ReactionType } from '@/types'

async function reactToComment(id: string, reaction: ReactionType | null) {
  const res = await fetch(`/api/comments/${id}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reaction }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

async function flagComment(id: string) {
  const res = await fetch(`/api/comments/${id}/flag`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

async function postComment(entrySlug: string, content: string, parentId: string | null, userId: string, userName: string) {
  const res = await fetch(`/api/entries/${entrySlug}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, parentId, userId, userName }),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

const REACTIONS: { type: ReactionType; Icon: React.ElementType; label: string }[] = [
  { type: 'like', Icon: ThumbsUp, label: 'Like' },
  { type: 'dislike', Icon: ThumbsDown, label: 'Dislike' },
  { type: 'super', Icon: Star, label: 'Super' },
]

interface Props {
  comment: Comment
  replies: Comment[]
  entrySlug: string
  isReply?: boolean
}

export function CommentItem({ comment, replies, entrySlug, isReply = false }: Props) {
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuthStore()
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  const reactMutation = useMutation({
    mutationFn: ({ id, reaction }: { id: string; reaction: ReactionType | null }) =>
      reactToComment(id, reaction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', entrySlug] }),
  })

  const flagMutation = useMutation({
    mutationFn: (id: string) => flagComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', entrySlug] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user!.id }),
      })
      if (!res.ok) throw new Error('Failed')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', entrySlug] }),
  })

  const replyMutation = useMutation({
    mutationFn: (content: string) =>
      postComment(entrySlug, content, comment.id, user!.id, user!.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entrySlug] })
      setReplyText('')
      setShowReply(false)
    },
  })

  function handleReact(type: ReactionType) {
    if (!isAuthenticated) return
    const next = comment.userReaction === type ? null : type
    reactMutation.mutate({ id: comment.id, reaction: next })
  }

  const age = formatAge(comment.createdAt)

  return (
    <div className={cn('group', isReply && 'ml-8 border-l border-border/40 pl-4')}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
          {comment.user.name[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">{comment.user.name}</span>
            <span className="text-xs text-muted-foreground">{age}</span>
            {comment.flagged && (
              <span className="text-[10px] text-destructive border border-destructive/30 rounded px-1">flagged</span>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {REACTIONS.map(({ type, Icon, label }) => (
              <button
                key={type}
                onClick={() => handleReact(type)}
                disabled={!isAuthenticated}
                title={isAuthenticated ? label : 'Sign in to react'}
                className={cn(
                  'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors',
                  comment.userReaction === type
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                <Icon className="h-3 w-3" />
                {comment.reactions[type] > 0 && <span>{comment.reactions[type]}</span>}
              </button>
            ))}

            {!isReply && isAuthenticated && (
              <button
                onClick={() => setShowReply(v => !v)}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors ml-1"
              >
                <CornerDownRight className="h-3 w-3" />
                Reply
              </button>
            )}

            <div className="ml-auto flex items-center gap-0.5">
              {user?.id === comment.userId && (
                <button
                  onClick={() => deleteMutation.mutate(comment.id)}
                  disabled={deleteMutation.isPending}
                  title="Delete comment"
                  className="flex items-center rounded px-1.5 py-0.5 text-xs text-muted-foreground/40 hover:text-destructive hover:bg-muted/80 transition-colors disabled:opacity-30"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => flagMutation.mutate(comment.id)}
                title="Flag comment"
                className={cn(
                  'flex items-center rounded px-1.5 py-0.5 text-xs transition-colors',
                  comment.flagged
                    ? 'text-destructive'
                    : 'text-muted-foreground/40 hover:text-destructive hover:bg-muted/80'
                )}
              >
                <Flag className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Reply box */}
          {showReply && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder={`Reply to ${comment.user.name}…`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="min-h-[70px] text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={!replyText.trim() || replyMutation.isPending}
                  onClick={() => replyMutation.mutate(replyText.trim())}
                >
                  {replyMutation.isPending ? 'Posting…' : 'Post reply'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReply(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {replies.map(r => (
            <CommentItem key={r.id} comment={r} replies={[]} entrySlug={entrySlug} isReply />
          ))}
        </div>
      )}
    </div>
  )
}

function formatAge(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
