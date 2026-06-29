import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Search } from 'lucide-react'
import { DocCard } from '@/components/docs/DocCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { SEO } from '@/components/SEO'
import type { Category, Entry } from '@/types'

interface CategoryWithEntries extends Category {
  entries: Entry[]
}

async function fetchCategory(slug: string): Promise<CategoryWithEntries> {
  const res = await fetch(`/api/categories/${slug}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export default function DocsCategory() {
  const { category } = useParams<{ category: string }>()
  const [query, setQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', category],
    queryFn: () => fetchCategory(category!),
    enabled: !!category,
  })

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Category not found.</p>
        <Link to="/docs" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to docs
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {data && (
        <SEO
          title={`${data.name} — How-to guides`}
          description={`${data.entryCount} practical how-to guides for ${data.name}. ${data.description}`}
          canonical={`/docs/${data.slug}`}
          type="website"
        />
      )}
      <Link
        to="/docs"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        All docs
      </Link>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 py-3" />)}
          </div>
        </div>
      ) : data && (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
              <Badge variant="outline" className="text-xs capitalize">{data.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{data.description}</p>
            <p className="mt-1 text-xs text-muted-foreground/60">{data.entries.length} entries</p>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={`Search in ${data.name}…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded border border-border bg-card pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          {(() => {
            const q = query.trim().toLowerCase()
            const filtered = q
              ? data.entries.filter(e =>
                  e.title.toLowerCase().includes(q) ||
                  e.tags.some(t => t.toLowerCase().includes(q))
                )
              : data.entries

            if (data.entries.length === 0)
              return <p className="py-12 text-center text-muted-foreground text-sm">No entries yet.</p>

            if (filtered.length === 0)
              return <p className="py-12 text-center text-muted-foreground text-sm">No results for "{query}".</p>

            return (
              <div className="divide-y divide-border">
                {filtered.map(e => <DocCard key={e.id} entry={e} />)}
              </div>
            )
          })()}
        </>
      )}
    </div>
  )
}
