import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { SEO } from '@/components/SEO'
import type { BlogPost } from '@/types'

type Filter = 'all' | 'article' | 'news'

async function fetchPosts(type: Filter): Promise<BlogPost[]> {
  const url = type === 'all' ? '/api/blog' : `/api/blog?type=${type}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase()
}

export default function BlogIndex() {
  const [filter, setFilter] = useState<Filter>('all')

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog', filter],
    queryFn: () => fetchPosts(filter),
  })

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <SEO
        title="Blog — React & TypeScript articles"
        description="Articles and news on React, TypeScript, Vite, and the tools around them. Written for developers who prefer depth over hype."
        canonical="/blog"
      />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">The developer's read.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Articles and news on React, TypeScript, and the tools around them.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-border pb-0">
        {(['all', 'article', 'news'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'px-3 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px',
              filter === f
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {f === 'all' ? 'All' : f === 'article' ? 'Articles' : 'News'}
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full" />)}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      ) : (
        <ul className="space-y-px">
          {posts.map(post => (
            <li key={post.id}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block rounded border border-transparent hover:border-border hover:bg-card px-4 py-5 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
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
                <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="font-mono text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
