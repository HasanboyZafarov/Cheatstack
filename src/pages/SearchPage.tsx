import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { DocCard } from '@/components/docs/DocCard'
import { useSearchStore } from '@/store/searchStore'
import { entries } from '@/mocks/fixtures'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const { results, setQuery, initFuse } = useSearchStore()

  useEffect(() => {
    initFuse(entries)
  }, [initFuse])

  useEffect(() => {
    setQuery(q)
  }, [q, setQuery])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearchParams(val ? { q: val } : {}, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          autoFocus
          value={q}
          onChange={handleChange}
          placeholder="Search docs…"
          className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {!q ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Start typing to search.</p>
      ) : results.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-sm">No results for &ldquo;<strong>{q}</strong>&rdquo;</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Try different keywords or browse by category.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-muted-foreground">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;</p>
          <div className="divide-y divide-border">
            {results.map(e => <DocCard key={e.id} entry={e} />)}
          </div>
        </>
      )}
    </div>
  )
}
