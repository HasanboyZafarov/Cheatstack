import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { DifficultyBadge } from '@/components/docs/DifficultyBadge'
import { useSearchStore } from '@/store/searchStore'
import { entries } from '@/mocks/fixtures'

export function SearchCommand() {
  const { isOpen, query, results, setOpen, setQuery, initFuse } = useSearchStore()
  const navigate = useNavigate()

  useEffect(() => {
    initFuse(entries)
  }, [initFuse])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!isOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, setOpen])

  function select(categorySlug: string, slug: string) {
    setOpen(false)
    setQuery('')
    navigate(`/docs/${categorySlug}/${slug}`)
  }

  const heading = query.trim() ? 'Results' : 'Popular'

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search docs…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results for &ldquo;{query}&rdquo;</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading={heading}>
              {results.slice(0, 8).map(entry => (
                <CommandItem
                  key={entry.id}
                  value={entry.slug}
                  onSelect={() => select(entry.categorySlug, entry.slug)}
                  className="flex items-start gap-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.categorySlug}</p>
                  </div>
                  <DifficultyBadge difficulty={entry.difficulty} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
