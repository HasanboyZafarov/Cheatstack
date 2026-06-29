import { useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import { useSearchStore } from '@/store/searchStore'

export function Header() {
  const setOpen = useSearchStore(s => s.setOpen)
  const [sheetOpen, setSheetOpen] = useState(false)
  const navigate = useNavigate()

  function navAndClose(to: string) {
    setSheetOpen(false)
    navigate(to)
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-60">
          <Sidebar onNavigate={navAndClose} />
        </SheetContent>
      </Sheet>

      <NavLink to="/" className="flex items-center gap-1.5 font-bold text-foreground tracking-tight">
        <span className="text-primary">·</span>
        <span>Cheatstack</span>
      </NavLink>

      <Button
        variant="ghost"
        size="icon"
        className="ml-auto"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
    </header>
  )
}
