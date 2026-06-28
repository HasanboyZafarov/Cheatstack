import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { SEO } from '@/components/SEO'
import type { BlogPost } from '@/types'

async function fetchPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`/api/blog/${slug}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function renderBody(body: string) {
  const paragraphs = body.split('\n\n')
  return paragraphs.map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="text-base font-semibold text-foreground mt-8 mb-3">
          {block.slice(3)}
        </h2>
      )
    }
    if (block.startsWith('### ')) {
      return (
        <h3 key={i} className="text-sm font-semibold text-foreground mt-6 mb-2">
          {block.slice(4)}
        </h3>
      )
    }
    const lines = block.split('\n')
    if (lines.every(l => l.startsWith('- '))) {
      return (
        <ul key={i} className="space-y-1.5 my-4">
          {lines.map((l, j) => (
            <li key={j} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
              <span>{l.slice(2)}</span>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed">
        {block}
      </p>
    )
  })
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchPost(slug!),
    enabled: !!slug,
  })

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Link to="/blog" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to blog
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Blog
      </Link>

      {isLoading ? (
        <LoadingSkeleton />
      ) : post && (
        <article>
          <SEO
            title={post.title}
            description={post.summary}
            canonical={`/blog/${post.slug}`}
            type="article"
            jsonLd={{
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.summary,
              author: { '@type': 'Organization', name: 'Cheatstack' },
              datePublished: post.publishedAt,
              keywords: post.tags.join(', '),
            }}
          />
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
              {formatDate(post.publishedAt)}
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[10px] text-muted-foreground">{post.readTime} min read</span>
            {post.type === 'news' && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span className="font-mono text-[10px] text-primary/70 uppercase tracking-wider">news</span>
              </>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-snug mb-4">
            {post.title}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6 border-l-2 border-primary/40 pl-4">
            {post.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-8">
            {post.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>

          <Separator className="mb-8" />

          <div className="space-y-4">
            {renderBody(post.body)}
          </div>

          <Separator className="mt-12 mb-6" />

          <div className="flex items-center justify-between">
            <Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3" />
              All posts
            </Link>
            <p className="font-mono text-xs text-muted-foreground/50">by {post.author}</p>
          </div>
        </article>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
      </div>
    </div>
  )
}
