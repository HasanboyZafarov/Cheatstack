import { http, HttpResponse } from 'msw'
import { categories, entries } from './fixtures'
import { blogPosts } from './blogFixtures'
import type { Comment, ReactionType } from '@/types'

const users: Array<{ id: string; name: string; email: string; password: string }> = [
  { id: 'user-demo', name: 'Demo User', email: 'demo@example.com', password: 'password' },
]

const comments: Comment[] = [
  {
    id: 'c-1',
    entrySlug: 'store-array',
    userId: 'user-demo',
    user: { id: 'user-demo', name: 'Demo User' },
    content: 'This is exactly the pattern I needed. The try/catch wrapper is a lifesaver.',
    parentId: null,
    reactions: { like: 4, dislike: 0, super: 1 },
    userReaction: null,
    flagged: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'c-2',
    entrySlug: 'toggle-boolean',
    userId: 'user-demo',
    user: { id: 'user-demo', name: 'Demo User' },
    content: 'Burned by the stale closure version before. Always use the callback form now.',
    parentId: null,
    reactions: { like: 2, dislike: 0, super: 0 },
    userReaction: null,
    flagged: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

let commentIdCounter = 100

export const handlers = [
  // ── Categories ────────────────────────────────────────────────────────────
  http.get('/api/categories', () => HttpResponse.json(categories)),

  http.get('/api/categories/:slug', ({ params }) => {
    const cat = categories.find(c => c.slug === params.slug)
    if (!cat) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    const catEntries = entries.filter(e => e.categorySlug === params.slug && e.published)
    return HttpResponse.json({ ...cat, entries: catEntries })
  }),

  // ── Entries ───────────────────────────────────────────────────────────────
  http.get('/api/entries', ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const difficulty = url.searchParams.get('difficulty')
    const type = url.searchParams.get('type')

    let result = entries.filter(e => e.published)
    if (category) result = result.filter(e => e.categorySlug === category)
    if (difficulty) result = result.filter(e => e.difficulty === difficulty)
    if (type) result = result.filter(e => e.type === type)
    return HttpResponse.json(result)
  }),

  http.get('/api/entries/:slug', ({ params }) => {
    const entry = entries.find(e => e.slug === params.slug && e.published)
    if (!entry) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    const related = entries.filter(e => entry.relatedSlugs.includes(e.slug))
    return HttpResponse.json({ ...entry, related })
  }),

  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() ?? ''
    if (!q) return HttpResponse.json([])
    const results = entries.filter(e =>
      e.published && (
        e.title.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.problem.toLowerCase().includes(q)
      )
    )
    return HttpResponse.json(results)
  }),

  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post('/api/auth/register', async ({ request }) => {
    const { name, email, password } = await request.json() as { name: string; email: string; password: string }
    if (users.find(u => u.email === email)) {
      return HttpResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    const user = { id: `user-${Date.now()}`, name, email, password }
    users.push(user)
    return HttpResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string }
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return HttpResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    return HttpResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  }),

  http.patch('/api/user/profile', async ({ request }) => {
    const { userId, name, email } = await request.json() as { userId: string; name: string; email: string }
    const user = users.find(u => u.id === userId)
    if (!user) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    if (email !== user.email && users.find(u => u.email === email && u.id !== userId)) {
      return HttpResponse.json({ error: 'Email already in use' }, { status: 409 })
    }
    user.name = name
    user.email = email
    return HttpResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  }),

  http.patch('/api/user/password', async ({ request }) => {
    const { userId, currentPassword, newPassword } = await request.json() as {
      userId: string; currentPassword: string; newPassword: string
    }
    const user = users.find(u => u.id === userId)
    if (!user || user.password !== currentPassword) {
      return HttpResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }
    user.password = newPassword
    return HttpResponse.json({ ok: true })
  }),

  // ── Comments ──────────────────────────────────────────────────────────────
  http.get('/api/entries/:slug/comments', ({ params }) => {
    const entryComments = comments.filter(c => c.entrySlug === params.slug)
    return HttpResponse.json(entryComments)
  }),

  http.get('/api/user/:userId/comments', ({ params }) => {
    const userComments = comments.filter(c => c.userId === params.userId)
    return HttpResponse.json(userComments)
  }),

  http.post('/api/entries/:slug/comments', async ({ params, request }) => {
    const { content, parentId, userId, userName } = await request.json() as {
      content: string; parentId: string | null; userId: string; userName: string
    }
    const comment: Comment = {
      id: `c-${++commentIdCounter}`,
      entrySlug: params.slug as string,
      userId,
      user: { id: userId, name: userName },
      content,
      parentId: parentId ?? null,
      reactions: { like: 0, dislike: 0, super: 0 },
      userReaction: null,
      flagged: false,
      createdAt: new Date().toISOString(),
    }
    comments.push(comment)
    return HttpResponse.json(comment, { status: 201 })
  }),

  http.post('/api/comments/:id/react', async ({ params, request }) => {
    const { reaction } = await request.json() as { reaction: ReactionType | null }
    const comment = comments.find(c => c.id === params.id)
    if (!comment) return HttpResponse.json({ error: 'Not found' }, { status: 404 })

    if (comment.userReaction && comment.userReaction === reaction) {
      comment.reactions[comment.userReaction] = Math.max(0, comment.reactions[comment.userReaction] - 1)
      comment.userReaction = null
    } else {
      if (comment.userReaction) {
        comment.reactions[comment.userReaction] = Math.max(0, comment.reactions[comment.userReaction] - 1)
      }
      if (reaction) {
        comment.reactions[reaction] += 1
        comment.userReaction = reaction
      }
    }
    return HttpResponse.json(comment)
  }),

  http.post('/api/comments/:id/flag', ({ params }) => {
    const comment = comments.find(c => c.id === params.id)
    if (!comment) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    comment.flagged = !comment.flagged
    return HttpResponse.json(comment)
  }),

  http.delete('/api/comments/:id', async ({ params, request }) => {
    const { userId } = await request.json() as { userId: string }
    const idx = comments.findIndex(c => c.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    if (comments[idx].userId !== userId) return HttpResponse.json({ error: 'Forbidden' }, { status: 403 })
    comments.splice(idx, 1)
    return HttpResponse.json({ ok: true })
  }),

  // ── Blog ──────────────────────────────────────────────────────────────────
  http.get('/api/blog', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const result = type ? blogPosts.filter(p => p.type === type) : blogPosts
    return HttpResponse.json(result.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ))
  }),

  http.get('/api/blog/:slug', ({ params }) => {
    const post = blogPosts.find(p => p.slug === params.slug)
    if (!post) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    return HttpResponse.json(post)
  }),
]
