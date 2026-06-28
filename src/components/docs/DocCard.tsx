import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DifficultyBadge } from './DifficultyBadge'
import type { Entry } from '@/types'

export function DocCard({ entry }: { entry: Entry }) {
  return (
    <Link to={`/docs/${entry.categorySlug}/${entry.slug}`} className="group block">
      <Card className="transition-colors hover:bg-accent/30 border-border/60">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {entry.title}
            </h3>
            <DifficultyBadge difficulty={entry.difficulty} />
          </div>

          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {entry.problem}
          </p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {entry.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground/60">
              <Eye className="h-3 w-3" />
              {entry.views.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
