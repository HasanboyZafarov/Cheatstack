import { Link } from 'react-router-dom'
import { DifficultyBadge } from './DifficultyBadge'
import type { Entry } from '@/types'

export function DocCard({ entry }: { entry: Entry }) {
  return (
    <Link
      to={`/docs/${entry.categorySlug}/${entry.slug}`}
      className="group flex items-start gap-3 py-3 px-1 transition-colors hover:bg-accent/20"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {entry.title}
          </p>
          <div className="shrink-0">
            <DifficultyBadge difficulty={entry.difficulty} />
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          {entry.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center rounded-sm px-1 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
