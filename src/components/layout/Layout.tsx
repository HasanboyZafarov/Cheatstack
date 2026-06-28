import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { SearchCommand } from '@/components/search/SearchCommand'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-60 md:z-30">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col md:pl-60">
        {/* Mobile header */}
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <SearchCommand />
    </div>
  )
}
