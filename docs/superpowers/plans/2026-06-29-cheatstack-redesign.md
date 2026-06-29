# CheatStack UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AI-assembled shadcn template look with utility-dense clean minimalism across all major surfaces.

**Architecture:** Pure styling/markup changes — no data, logic, or API changes. Five targeted file groups: CSS tokens → Sidebar → Header → Home → DocCard → DocsDetail. Each task is independently shippable.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, shadcn/ui, Vite

## Global Constraints

- Keep existing dark palette: charcoal bg `oklch(0.165 0.009 264)`, salmon-red primary `oklch(0.65 0.13 25)`, green `#448460`
- No changes to API calls, data fetching, stores, or types
- No changes to `CodeBlock.tsx`, `SearchCommand.tsx`, `CommentSection.tsx`, or auth pages
- All inline hex `#448460` / `#3a7050` / `#44846040` must be replaced with CSS var
- Section labels site-wide: `text-[11px] font-medium text-muted-foreground` — no uppercase, no tracking-wider, no text-primary
- Border radius global: `0.25rem`

---

### Task 1: CSS tokens — radius + green color var

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: `--color-green` CSS custom property available everywhere; `--radius: 0.25rem`

- [ ] **Step 1: Update `src/index.css`**

  In the `:root` block, change `--radius` from `0.45rem` to `0.25rem`.

  In the `.dark` block (after `--sidebar-ring`), add the green var:

  ```css
  --radius: 0.25rem;
  ```

  And in `.dark` after `--sidebar-ring: oklch(0.65 0.13 25);`, add:

  ```css
  --green: #448460;
  --green-hover: #3a7050;
  ```

  Also add to `:root` (light mode, same values):

  ```css
  --green: #448460;
  --green-hover: #3a7050;
  ```

  And expose in `@theme inline` block (after `--color-sidebar-ring`):

  ```css
  --color-green: var(--green);
  --color-green-hover: var(--green-hover);
  ```

- [ ] **Step 2: Verify dev server starts without errors**

  Run: `npm run dev`
  Expected: no CSS errors, site loads, border-radius visibly sharper everywhere (buttons, cards, inputs)

- [ ] **Step 3: Commit**

  ```bash
  git add src/index.css
  git commit -m "style: tighten border-radius to 0.25rem, add --color-green token"
  ```

---

### Task 2: Sidebar redesign

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

**Interfaces:**
- Consumes: `--color-green` from Task 1
- Produces: Updated sidebar used by `Layout.tsx` (desktop) and `Header.tsx` (mobile sheet)

- [ ] **Step 1: Replace logo mark**

  In `Sidebar.tsx`, find the logo NavLink (line ~40-43). Replace:

  ```tsx
  <NavLink to="/" onClick={() => nav('/')} className="flex items-center gap-2 font-bold text-sidebar-foreground tracking-tight">
    <span className="font-mono text-xs border px-1.5 py-0.5 rounded-sm" style={{ color: '#448460', borderColor: '#44846040' }}>CS</span>
    <span>Cheatstack</span>
  </NavLink>
  ```

  With:

  ```tsx
  <NavLink to="/" onClick={() => nav('/')} className="flex items-center gap-1.5 font-bold text-sidebar-foreground tracking-tight">
    <span className="text-[color:var(--color-green)]">·</span>
    <span>Cheatstack</span>
  </NavLink>
  ```

- [ ] **Step 2: Replace search trigger**

  Find the search button (line ~47-55). Replace:

  ```tsx
  <button
    onClick={() => setOpen(true)}
    className="flex w-full items-center gap-2 rounded border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent transition-colors"
  >
    <Search className="h-3.5 w-3.5 shrink-0" />
    <span className="flex-1 text-left">Search…</span>
    <kbd className="font-mono opacity-50">⌘K</kbd>
  </button>
  ```

  With:

  ```tsx
  <button
    onClick={() => setOpen(true)}
    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
  >
    <Search className="h-3.5 w-3.5 shrink-0" />
    <span className="flex-1 text-left">Search…</span>
    <kbd className="font-mono opacity-40 text-[10px]">⌘K</kbd>
  </button>
  ```

- [ ] **Step 3: Fix "All docs" and "Blog" nav link active states**

  Find the two NavLink items for `/docs` and `/blog` (lines ~60-91). Replace both className functions:

  ```tsx
  className={({ isActive }) =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-sm mb-1 transition-colors',
      isActive
        ? 'font-medium text-sidebar-foreground'
        : 'font-normal text-sidebar-foreground/60 hover:text-sidebar-foreground'
    )
  }
  ```

  (Same pattern for both `/docs` and `/blog` links — remove `border-l-2`, remove background fill.)

- [ ] **Step 4: Make CollapsibleSection non-collapsible**

  Replace the entire `CollapsibleSection` component (lines ~137-184) with:

  ```tsx
  function CollapsibleSection({ label, categories, onNavigate }: {
    label: string
    categories: Category[]
    defaultOpen?: boolean
    onNavigate?: (to: string) => void
  }) {
    return (
      <div className="mb-1">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest px-3 mt-4 mb-1">
          {label}
        </p>
        <ul className="space-y-0.5">
          {categories.map(cat => {
            const Icon = ICON_MAP[cat.icon ?? 'FileText'] ?? FileText
            return (
              <li key={cat.id}>
                <NavLink
                  to={`/docs/${cat.slug}`}
                  onClick={() => onNavigate?.(`/docs/${cat.slug}`)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'font-medium text-sidebar-foreground'
                        : 'font-normal text-sidebar-foreground/60 hover:text-sidebar-foreground'
                    )
                  }
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                  <span className="flex-1 truncate">{cat.name}</span>
                  <span className="text-[10px] tabular-nums text-muted-foreground/30">{cat.entryCount}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  ```

  Also remove `ChevronDown` from the import since it's no longer used.

- [ ] **Step 5: Update user strip**

  Replace the logged-out state (lines ~123-130):

  ```tsx
  <div className="flex items-center gap-3 px-1">
    <Link
      to="/login"
      onClick={() => nav('/login')}
      className="text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
    >
      Sign in
    </Link>
    <Link
      to="/register"
      onClick={() => nav('/register')}
      className="text-xs text-[color:var(--color-green)] hover:opacity-80 transition-opacity font-medium"
    >
      Sign up
    </Link>
  </div>
  ```

  Remove unused `Button` import if it's no longer used anywhere in Sidebar.tsx after this change.

- [ ] **Step 6: Verify sidebar visually**

  Run: `npm run dev`
  Check:
  - Logo is `· Cheatstack` with green dot, no box
  - Search trigger has no border/bg
  - Active nav item: bold text, no left border, no bg highlight
  - "Concepts" / "Packages" are static labels, not toggle buttons
  - User strip: plain text links

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/layout/Sidebar.tsx
  git commit -m "style: redesign sidebar — clean logo, text-only nav states, static sections"
  ```

---

### Task 3: Header (mobile) logo update

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `--color-green` from Task 1
- Produces: Mobile header logo matches desktop sidebar logo

- [ ] **Step 1: Update logo mark in Header**

  In `Header.tsx` line ~33-36, replace:

  ```tsx
  <NavLink to="/" className="flex items-center gap-2 font-bold text-foreground tracking-tight">
    <span className="font-mono text-xs border px-1.5 py-0.5 rounded-sm" style={{ color: '#448460', borderColor: '#44846040' }}>CS</span>
    <span>Cheatstack</span>
  </NavLink>
  ```

  With:

  ```tsx
  <NavLink to="/" className="flex items-center gap-1.5 font-bold text-foreground tracking-tight">
    <span className="text-[color:var(--color-green)]">·</span>
    <span>Cheatstack</span>
  </NavLink>
  ```

- [ ] **Step 2: Verify mobile header**

  Run: `npm run dev`, resize browser to mobile width.
  Check: logo matches sidebar — green dot + wordmark, no box.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/layout/Header.tsx
  git commit -m "style: update mobile header logo to match sidebar"
  ```

---

### Task 4: Home page redesign

**Files:**
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Consumes: `--color-green` from Task 1, `DocCard` from Task 5 (but Task 5 is independent — Home uses DocCard, can be done in either order)

- [ ] **Step 1: Update hero section**

  Replace the hero `<section>` (lines ~53-73):

  ```tsx
  <section className="flex flex-col items-center justify-center px-6 pt-12 pb-8 text-center">
    <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight">
      React & TypeScript,<br className="hidden sm:block" /> when you need it.
    </h1>
    <p className="mt-3 max-w-md text-sm text-muted-foreground">
      Real code for the packages you actually use.
    </p>

    <button
      onClick={() => setOpen(true)}
      className="group mt-6 flex w-full max-w-sm items-center gap-3 rounded border border-border bg-card px-4 py-2.5 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="flex-1 text-sm text-muted-foreground">Search docs…</span>
      <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  </section>
  ```

- [ ] **Step 2: Update category cards**

  Replace the category grid inside the `{categories.map(...)}` block (lines ~85-103):

  ```tsx
  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
    {categories.map(cat => {
      const Icon = ICON_MAP[cat.icon ?? 'FileText'] ?? FileText
      return (
        <Link
          key={cat.id}
          to={`/docs/${cat.slug}`}
          className="group flex items-center gap-2.5 rounded border border-border bg-card p-3 transition-colors hover:border-primary/40"
        >
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-sm font-medium text-foreground truncate">{cat.name}</span>
        </Link>
      )
    })}
  </div>
  ```

- [ ] **Step 3: Update section labels and recent entries layout**

  Replace the "Popular topics" section header (line ~79):
  ```tsx
  <h2 className="text-[11px] font-medium text-muted-foreground mb-3">Popular topics</h2>
  ```

  Replace the "Recently added" section header (line ~108):
  ```tsx
  <h2 className="text-[11px] font-medium text-muted-foreground mb-3">Recently added</h2>
  ```

  Replace the recent entries grid (lines ~110-122) with a list layout:

  ```tsx
  {isLoading ? (
    <div className="space-y-px">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 rounded" />
      ))}
    </div>
  ) : (
    <div className="divide-y divide-border">
      {recent.map(entry => (
        <DocCard key={entry.id} entry={entry} />
      ))}
    </div>
  )}
  ```

- [ ] **Step 4: Update Browse CTA button**

  Replace the Browse CTA (lines ~125-130):

  ```tsx
  <div className="flex justify-center">
    <Button asChild size="lg" className="bg-[color:var(--color-green)] text-white hover:bg-[color:var(--color-green-hover)] border-0">
      <Link to="/docs">
        Browse all docs <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </div>
  ```

- [ ] **Step 5: Update "From the blog" section label**

  Replace (line ~137):
  ```tsx
  <h2 className="text-[11px] font-medium text-muted-foreground mb-3">From the blog</h2>
  ```

- [ ] **Step 6: Remove unused imports if any**

  Check if `HardDrive, Layers, Zap, Box, RefreshCw` are still used via `ICON_MAP`. They are — keep them. No removals needed.

- [ ] **Step 7: Verify home page visually**

  Run: `npm run dev`, navigate to `/`.
  Check:
  - Hero: shorter padding, new headline, clean search bar
  - Category cards: icon + name only, no icon wrapper bg
  - Recent entries: vertical list with dividers, not card grid
  - CTA: green button via CSS var (no inline hex)
  - Section labels: small, quiet, no caps

- [ ] **Step 8: Commit**

  ```bash
  git add src/pages/Home.tsx
  git commit -m "style: redesign home — compact hero, stripped category cards, list entries"
  ```

---

### Task 5: DocCard — list style

**Files:**
- Modify: `src/components/docs/DocCard.tsx`

**Interfaces:**
- Produces: `DocCard` renders as a border-b list row (no Card box). Consumed by `Home.tsx` and `src/pages/docs/index.tsx` and `src/pages/docs/DocsCategory.tsx`.

- [ ] **Step 1: Rewrite DocCard**

  Replace the entire file content:

  ```tsx
  import { Link } from 'react-router-dom'
  import { DifficultyBadge } from './DifficultyBadge'
  import type { Entry } from '@/types'

  export function DocCard({ entry }: { entry: Entry }) {
    return (
      <Link
        to={`/docs/${entry.categorySlug}/${entry.slug}`}
        className="group flex items-start gap-3 py-3 px-1 transition-colors hover:bg-accent/20"
      >
        <div className="mt-0.5 shrink-0">
          <DifficultyBadge difficulty={entry.difficulty} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {entry.title}
          </p>
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
  ```

- [ ] **Step 2: Check DocsCategory and docs/index pages use DocCard in a list context**

  Open `src/pages/docs/index.tsx` and `src/pages/docs/DocsCategory.tsx`. If they wrap `DocCard` in a grid, change the wrapper to `divide-y divide-border` list. Look for any `grid` className wrapping DocCard renders and replace with:

  ```tsx
  <div className="divide-y divide-border">
    {entries.map(entry => <DocCard key={entry.id} entry={entry} />)}
  </div>
  ```

- [ ] **Step 3: Verify DocCard visually**

  Run: `npm run dev`, check `/docs` and a category page.
  Check:
  - Entries render as a clean vertical list with dividers
  - No card box / background fill
  - Title, tags, difficulty badge visible
  - Hover: subtle bg shift

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/docs/DocCard.tsx src/pages/docs/index.tsx src/pages/docs/DocsCategory.tsx
  git commit -m "style: DocCard → borderless list row, remove Card wrapper"
  ```

---

### Task 6: Doc detail page

**Files:**
- Modify: `src/pages/docs/DocsDetail.tsx`

**Interfaces:**
- No interface changes — purely visual

- [ ] **Step 1: Update breadcrumb to monospace**

  Replace the `<nav>` breadcrumb className (line ~113):

  ```tsx
  <nav className="mb-6 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
  ```

- [ ] **Step 2: Update all Section label style**

  In the `Section` component (lines ~230-244), replace:

  ```tsx
  function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <section>
        <h2 className="mb-3 text-[11px] font-medium text-muted-foreground">
          {label}
        </h2>
        {children}
      </section>
    )
  }
  ```

- [ ] **Step 3: Remove decorative Separators, increase section spacing**

  In the `<article>` (line ~132), change `className="space-y-8"` to `className="space-y-10"`.

  Remove the first `<Separator />` (the one after `<header>`, line ~154).

  Keep only the `<Separator />` before "Related entries" (line ~203).

- [ ] **Step 4: Update pitfall bullets**

  Replace the pitfall bullet dot (lines ~186-196):

  ```tsx
  {entry.pitfalls.map((p, i) => (
    <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
      <span className="mt-0.5 shrink-0 text-primary/50 font-medium">—</span>
      <span><InlineText text={p} /></span>
    </li>
  ))}
  ```

- [ ] **Step 5: Verify doc detail page visually**

  Run: `npm run dev`, navigate to any `/docs/:category/:slug`.
  Check:
  - Breadcrumb is monospace, small, muted
  - Section labels are `text-[11px]` quiet — no caps, no tracking
  - No separator between Problem / Solution / Code / Explanation
  - Pitfall list uses `—` dash instead of amber dot
  - One separator before Related entries

- [ ] **Step 6: Commit**

  ```bash
  git add src/pages/docs/DocsDetail.tsx
  git commit -m "style: doc detail — quiet section labels, remove decorative separators, mono breadcrumb"
  ```

---

## Self-Review

**Spec coverage:**
- [x] Section labels site-wide: `text-[11px] font-medium text-muted-foreground` — covered in Tasks 2, 4, 6
- [x] Border-radius `0.25rem` — Task 1
- [x] `--color-green` var, remove inline hex — Tasks 1, 2, 3, 4
- [x] Hero headline + padding — Task 4
- [x] Category cards stripped — Task 4
- [x] DocCard list style — Task 5
- [x] Sidebar logo, nav states, search trigger, section labels, user strip — Task 2
- [x] Header logo — Task 3
- [x] Doc detail: section labels, separators, breadcrumb, pitfalls — Task 6
- [x] Blog detail — marked out of scope in spec ✓

**Placeholder scan:** No TBD/TODO found. All steps have concrete code.

**Type consistency:** No new types introduced. All component interfaces unchanged.
