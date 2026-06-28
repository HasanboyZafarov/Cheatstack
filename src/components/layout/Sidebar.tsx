import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { HardDrive, Layers, Zap, Box, RefreshCw, FileText, ChevronDown, Search, LogOut, User, BookOpen } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSearchStore } from '@/store/searchStore'
import { useAuthStore } from '@/store/authStore'
import type { Category } from '@/types'

const ICON_MAP: Record<string, React.ElementType> = {
  HardDrive, Layers, Zap, Box, RefreshCw, FileText,
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories')
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export function Sidebar({ onNavigate }: { onNavigate?: (to: string) => void }) {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  })
  const setOpen = useSearchStore(s => s.setOpen)
  const { user, isAuthenticated, logout } = useAuthStore()

  const nav = onNavigate ?? (() => {})

  const concepts = categories.filter(c => c.type === 'concept')
  const packages = categories.filter(c => c.type === 'package')

  return (
    <aside className="flex h-full w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border shrink-0">
        <NavLink to="/" onClick={() => nav('/')} className="flex items-center gap-2 font-bold text-sidebar-foreground tracking-tight">
          <span className="font-mono text-xs border px-1.5 py-0.5 rounded-sm" style={{ color: '#448460', borderColor: '#44846040' }}>CS</span>
          <span>Cheatstack</span>
        </NavLink>
      </div>

      {/* Search trigger */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="font-mono opacity-50">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-2">
        <NavLink
          to="/docs"
          end
          onClick={() => nav('/docs')}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium mb-1 transition-colors border-l-2',
              isActive
                ? 'border-sidebar-primary text-sidebar-primary bg-sidebar-accent/60'
                : 'border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )
          }
        >
          <FileText className="h-4 w-4" />
          All docs
        </NavLink>

        <NavLink
          to="/blog"
          onClick={() => nav('/blog')}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium mb-3 transition-colors border-l-2',
              isActive
                ? 'border-sidebar-primary text-sidebar-primary bg-sidebar-accent/60'
                : 'border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )
          }
        >
          <BookOpen className="h-4 w-4" />
          Blog
        </NavLink>

        <CollapsibleSection label="Concepts" categories={concepts} defaultOpen onNavigate={onNavigate} />
        <CollapsibleSection label="Packages" categories={packages} defaultOpen onNavigate={onNavigate} />
      </ScrollArea>

      {/* User strip */}
      <div className="border-t border-sidebar-border px-3 py-2 shrink-0">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              onClick={() => nav('/profile')}
              className="flex flex-1 items-center gap-2 min-w-0 rounded px-1 py-0.5 hover:bg-sidebar-accent transition-colors"
              title="View profile"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                {user.name[0].toUpperCase()}
              </div>
              <span className="flex-1 truncate text-xs text-sidebar-foreground">{user.name}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-sidebar-foreground"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm" className="flex-1 text-xs text-muted-foreground justify-start gap-1.5 px-2">
              <Link to="/login"><User className="h-3.5 w-3.5" />Sign in</Link>
            </Button>
            <Button asChild size="sm" className="flex-1 text-xs px-2 bg-[#448460] text-white hover:bg-[#3a7050] border-0">
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

function CollapsibleSection({ label, categories, defaultOpen = false, onNavigate }: {
  label: string
  categories: Category[]
  defaultOpen?: boolean
  onNavigate?: (to: string) => void
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary/60 hover:text-primary transition-colors rounded hover:bg-sidebar-accent/50"
      >
        {label}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul className="mt-0.5 space-y-0.5">
          {categories.map(cat => {
            const Icon = ICON_MAP[cat.icon ?? 'FileText'] ?? FileText
            return (
              <li key={cat.id}>
                <NavLink
                  to={`/docs/${cat.slug}`}
                  onClick={() => onNavigate?.(`/docs/${cat.slug}`)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-2 text-sm transition-colors border-l-2',
                      isActive
                        ? 'border-sidebar-primary text-sidebar-primary bg-sidebar-accent/60 font-medium'
                        : 'border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )
                  }
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground/40">{cat.entryCount}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
