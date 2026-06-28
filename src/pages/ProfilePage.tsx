import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { entries } from '@/mocks/fixtures'
import type { Comment, ViewedEntry } from '@/types'

function entryPath(entrySlug: string) {
  const entry = entries.find(e => e.slug === entrySlug)
  if (!entry) return `/docs/${entrySlug}`
  return `/docs/${entry.categorySlug}/${entry.slug}`
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">{children}</h2>
  )
}

function getViewedEntries(): ViewedEntry[] {
  try {
    const raw = localStorage.getItem('cs:viewed')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, changePassword } = useAuthStore()

  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [profileError, setProfileError] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [profilePending, setProfilePending] = useState(false)

  const [pwMode, setPwMode] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwPending, setPwPending] = useState(false)

  const [viewed, setViewed] = useState<ViewedEntry[]>([])

  useEffect(() => {
    setViewed(getViewedEntries().slice(0, 8))
  }, [])

  const { data: userComments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ['user-comments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/${user!.id}/comments`)
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    enabled: !!user,
  })

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileError('')
    setProfileSaved(false)
    setProfilePending(true)
    try {
      await updateProfile(user!.id, name, email)
      setProfileSaved(true)
      setEditMode(false)
    } catch (err) {
      setProfileError((err as Error).message)
    } finally {
      setProfilePending(false)
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    setPwSaved(false)
    if (newPw !== confirmPw) {
      setPwError('Passwords do not match')
      return
    }
    if (newPw.length < 8) {
      setPwError('Password must be at least 8 characters')
      return
    }
    setPwPending(true)
    try {
      await changePassword(user!.id, currentPw, newPw)
      setPwSaved(true)
      setPwMode(false)
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err) {
      setPwError((err as Error).message)
    } finally {
      setPwPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xl font-bold">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      {/* Edit profile */}
      <section>
        <SectionLabel>profile</SectionLabel>
        {!editMode ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground w-20 shrink-0">Name</span>
              <span className="flex-1 text-foreground">{user.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground w-20 shrink-0">Email</span>
              <span className="flex-1 text-foreground">{user.email}</span>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={() => { setEditMode(true); setName(user.name); setEmail(user.email) }}>
                Edit profile
              </Button>
              {profileSaved && <span className="text-xs text-primary">Saved.</span>}
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            {profileError && <p className="text-xs text-destructive">{profileError}</p>}
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" disabled={profilePending} className="bg-[#448460] text-white hover:bg-[#3a7050] border-0">
                {profilePending ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => { setEditMode(false); setProfileError('') }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </section>

      <Separator />

      {/* Change password */}
      <section>
        <SectionLabel>security</SectionLabel>
        {!pwMode ? (
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => setPwMode(true)}>
              Change password
            </Button>
            {pwSaved && <span className="text-xs text-primary">Password updated.</span>}
          </div>
        ) : (
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Current password</label>
              <input
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                required
                className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">New password</label>
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                required
                minLength={8}
                className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Confirm new password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                required
                className="w-full rounded border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            {pwError && <p className="text-xs text-destructive">{pwError}</p>}
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" disabled={pwPending} className="bg-[#448460] text-white hover:bg-[#3a7050] border-0">
                {pwPending ? 'Updating…' : 'Update password'}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => { setPwMode(false); setPwError(''); setCurrentPw(''); setNewPw(''); setConfirmPw('') }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </section>

      <Separator />

      {/* Activity */}
      <section className="space-y-8">
        <SectionLabel>activity</SectionLabel>

        {/* Recent comments */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Comments</h2>
          {commentsLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : userComments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            <ul className="space-y-3">
              {userComments.slice(0, 5).map(c => (
                <li key={c.id}>
                  <Link
                    to={entryPath(c.entrySlug)}
                    className="block rounded border border-border bg-card px-4 py-3 space-y-1 hover:border-primary/40 hover:bg-card/80 transition-colors group"
                  >
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">{c.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono truncate">{c.entrySlug}</span>
                      <span>·</span>
                      <span>{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recently viewed */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Recently viewed</h2>
          {viewed.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entries viewed yet.</p>
          ) : (
            <ul className="space-y-1">
              {viewed.map(v => (
                <li key={v.slug + v.viewedAt}>
                  <Link
                    to={`/docs/${v.categorySlug}/${v.slug}`}
                    className="flex items-center justify-between gap-4 rounded px-3 py-2 text-sm hover:bg-muted transition-colors group"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors truncate">{v.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(v.viewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
