import { cn } from '@/lib/utils'
import type { Difficulty } from '@/types'

const MAP: Record<Difficulty, { label: string; className: string }> = {
  beginner: {
    label: 'Beginner',
    className: 'bg-[#448460]/15 text-[#448460] border-[#448460]/25',
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-[#E3796A]/15 text-[#E3796A] border-[#E3796A]/25',
  },
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, className } = MAP[difficulty]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        className
      )}
    >
      {label}
    </span>
  )
}
