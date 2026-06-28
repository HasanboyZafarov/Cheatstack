export interface Category {
  id: string
  name: string
  slug: string
  type: 'concept' | 'package'
  description: string
  icon: string | null
  order: number
  entryCount: number
  createdAt: string
}

export interface Entry {
  id: string
  categoryId: string
  categorySlug: string
  title: string
  slug: string
  type: 'concept' | 'package'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  problem: string
  solution: string
  code: string
  codeLanguage: string
  explanation: string
  pitfalls: string[]
  relatedSlugs: string[]
  published: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export type Difficulty = Entry['difficulty']
export type EntryType = Entry['type']

export interface AuthUser {
  id: string
  name: string
  email: string
}

export type ReactionType = 'like' | 'dislike' | 'super'

export interface Comment {
  id: string
  entrySlug: string
  userId: string
  user: { id: string; name: string }
  content: string
  parentId: string | null
  reactions: Record<ReactionType, number>
  userReaction: ReactionType | null
  flagged: boolean
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string
  body: string
  author: string
  tags: string[]
  readTime: number
  publishedAt: string
  type: 'article' | 'news'
}

export interface ViewedEntry {
  slug: string
  title: string
  categorySlug: string
  viewedAt: string
}
