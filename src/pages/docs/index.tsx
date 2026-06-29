import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DocCard } from '@/components/docs/DocCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import type { Entry, Difficulty, EntryType } from '@/types'

async function fetchEntries(params: Record<string, string>): Promise<Entry[]> {
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)))
  const res = await fetch(`/api/entries?${qs}`)
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

const DIFFICULTIES: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const TYPES: { value: EntryType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'concept', label: 'Concept' },
  { value: 'package', label: 'Package' },
]

export default function DocsIndex() {
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [type, setType] = useState<EntryType | 'all'>('all')

  const params = {
    ...(difficulty !== 'all' && { difficulty }),
    ...(type !== 'all' && { type }),
  }

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['entries', difficulty, type],
    queryFn: () => fetchEntries(params),
  })

  const hasFilters = difficulty !== 'all' || type !== 'all'

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <SEO
        title="All docs — React & TypeScript how-to guides"
        description="Browse all how-to guides for React, TypeScript, localStorage, useState, useEffect, Zustand, and TanStack Query."
        canonical="/docs"
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">All docs</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entries.length} entries</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Tabs value={type} onValueChange={v => setType(v as EntryType | 'all')}>
          <TabsList>
            {TYPES.map(t => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={difficulty} onValueChange={v => setDifficulty(v as Difficulty | 'all')}>
          <TabsList>
            {DIFFICULTIES.map(d => (
              <TabsTrigger key={d.value} value={d.value}>{d.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs"
            onClick={() => { setDifficulty('all'); setType('all') }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 py-3" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No entries match your filters.</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setDifficulty('all'); setType('all') }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {entries.map(e => <DocCard key={e.id} entry={e} />)}
        </div>
      )}
    </div>
  )
}
