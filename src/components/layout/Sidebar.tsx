import { NavLink, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { HardDrive, Layers, Zap, Box, RefreshCw, FileText, Search, LogOut, BookOpen } from 'lucide-react'
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
        <NavLink to="/" onClick={() => nav('/')} className="flex items-center gap-1.5 font-bold text-sidebar-foreground tracking-tight">
          <span className="text-sidebar-primary">·</span>
          <span>Cheatstack</span>
        </NavLink>
      </div>

      {/* Search trigger */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="font-mono opacity-40 text-[10px]">⌘K</kbd>
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
              'flex items-center gap-2 px-3 py-2 text-sm mb-1 transition-colors',
              isActive
                ? 'font-medium text-sidebar-foreground'
                : 'font-normal text-sidebar-foreground/60 hover:text-sidebar-foreground'
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
              'flex items-center gap-2 px-3 py-2 text-sm mb-1 transition-colors',
              isActive
                ? 'font-medium text-sidebar-foreground'
                : 'font-normal text-sidebar-foreground/60 hover:text-sidebar-foreground'
            )
          }
        >
          <BookOpen className="h-4 w-4" />
          Blog
        </NavLink>

        <CollapsibleSection label="Concepts" categories={concepts} onNavigate={onNavigate} />
        <CollapsibleSection label="Packages" categories={packages} onNavigate={onNavigate} />
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
          <div className="flex items-center gap-3 px-1">
            <Link
              to="/login"
              onClick={() => nav('/login')}
              className="text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              onClick={() => nav('/register')}
              className="text-xs text-[color:var(--color-green)] hover:opacity-80 transition-opacity font-medium"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}

function CollapsibleSection({ label, categories, onNavigate }: {
  label: string
  categories: Category[]
  onNavigate?: (to: string) => void
}) {
  return (
    <div className="mb-1">
      <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest px-3 mt-4 mb-1">
        {label}
      </p>
      <ul className="space-y-0.5">
        {categories.map(cat => {
          const Icon = ICON_MAP[cat.icon ?? 'FileText'] ?? FileText
          return (
            <li key={cat.id}>
              <NavLink
                to={`/docs/${cat.slug}`}
                onClick={() => onNavigate?.(`/docs/${cat.slug}`)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'font-medium text-sidebar-foreground'
                      : 'font-normal text-sidebar-foreground/60 hover:text-sidebar-foreground'
                  )
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                <span className="flex-1 truncate">{cat.name}</span>
                <span className="text-[10px] tabular-nums text-muted-foreground/30">{cat.entryCount}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
