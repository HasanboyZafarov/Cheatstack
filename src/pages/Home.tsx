import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, ArrowRight, HardDrive, Layers, Zap, Box, RefreshCw, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DocCard } from '@/components/docs/DocCard'
import { Skeleton } from '@/components/ui/skeleton'
import { SEO } from '@/components/SEO'
import { useSearchStore } from '@/store/searchStore'
import type { Category, Entry, BlogPost } from '@/types'

const ICON_MAP: Record<string, React.ElementType> = {
  HardDrive, Layers, Zap, Box, RefreshCw, FileText,
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

async function fetchEntries(): Promise<Entry[]> {
  const res = await fetch('/api/entries')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch('/api/blog')
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

export default function Home() {
  const setOpen = useSearchStore(s => s.setOpen)
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: Infinity })
  const { data: entries = [], isLoading } = useQuery({ queryKey: ['entries'], queryFn: fetchEntries, staleTime: Infinity })
  const { data: posts = [] } = useQuery({ queryKey: ['blog', 'all'], queryFn: fetchBlogPosts })

  const recent = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6)

  return (
    <div className="flex flex-col">
      <SEO canonical="/" />
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          The answer is here.
        </h1>
        <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
          Real code for React, TypeScript, and the packages you actually use.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="group mt-8 flex w-full max-w-sm items-center gap-3 rounded border border-border bg-card px-4 py-3 text-left shadow-sm transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="flex-1 text-sm text-muted-foreground">
            Search docs…
          </span>
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6 pb-16 space-y-12">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Popular topics</h2>
            <Link to="/docs" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              All docs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map(cat => {
              const Icon = ICON_MAP[cat.icon ?? 'FileText'] ?? FileText
              return (
                <Link
                  key={cat.id}
                  to={`/docs/${cat.slug}`}
                  className="group flex items-center gap-3 rounded border border-border bg-card p-4 transition-colors hover:bg-accent/40 hover:border-primary/30"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted transition-colors group-hover:bg-primary/10">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.entryCount} entries</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recent entries */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">Recently added</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recent.map(entry => (
                <DocCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>

        {/* Browse CTA */}
        <div className="flex justify-center">
          <Button asChild size="lg" className="bg-[#448460] text-white hover:bg-[#3a7050] border-0">
            <Link to="/docs">
              Browse all docs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Blog teaser */}
        {posts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">From the blog</h2>
              <Link to="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                All posts <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="space-y-px">
              {posts.slice(0, 3).map(post => (
                <li key={post.id}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex items-start gap-4 rounded border border-transparent hover:border-border hover:bg-card px-4 py-4 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-muted-foreground">{formatDate(post.publishedAt)}</span>
                        {post.type === 'news' && (
                          <>
                            <span className="text-muted-foreground/30">·</span>
                            <span className="font-mono text-[10px] text-primary/60 uppercase">news</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-1 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
