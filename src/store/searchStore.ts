import { create } from 'zustand'
import Fuse from 'fuse.js'
import type { Entry } from '@/types'

interface SearchStore {
  query: string
  results: Entry[]
  isOpen: boolean
  fuse: Fuse<Entry> | null
  _allEntries: Entry[]
  setQuery: (q: string) => void
  setOpen: (open: boolean) => void
  initFuse: (entries: Entry[]) => void
}

export const useSearchStore = create<SearchStore>()((set, get) => ({
  query: '',
  results: [],
  isOpen: false,
  fuse: null,
  _allEntries: [],

  setOpen: (open) => set({ isOpen: open }),

  initFuse: (entries) => {
    const fuse = new Fuse(entries, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'tags', weight: 2 },
        { name: 'problem', weight: 1 },
      ],
      threshold: 0.35,
      includeScore: true,
    })
    const sorted = [...entries].sort((a, b) => b.views - a.views)
    set({ fuse, _allEntries: sorted })
  },

  setQuery: (query) => {
    const { fuse, _allEntries } = get()
    if (!query.trim()) {
      set({ query, results: _allEntries.slice(0, 8) })
      return
    }
    const results = fuse
      ? fuse.search(query).map(r => r.item)
      : []
    set({ query, results })
  },
}))
