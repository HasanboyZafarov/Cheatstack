# CheatStack UI Redesign — Design Spec

**Date:** 2026-06-29  
**Goal:** Remove the "AI-assembled shadcn template" look. Replace with utility-dense clean minimalism — tight like Tailwind CSS docs. Keep existing dark palette (charcoal + salmon-red + green).

---

## 1. Typography & Color System

### Section labels
- **Before:** `text-xs font-semibold uppercase tracking-wider text-primary` (used 6+ times)
- **After:** `text-[11px] font-medium text-muted-foreground` — sentence case, no tracking, no caps

### Hero headline
- Replace generic "The answer is here." with a specific, concrete line: `"React & TypeScript, when you need it."`
- Font: Roboto Slab, `text-3xl font-bold`, tighter line-height

### Border radius
- Global `--radius` drops from `0.45rem` → `0.25rem` — sharper, less bubbly

### Color discipline
- Remove all inline hardcoded hex (`bg-[#448460]`, `#3a7050`, `#44846040`)
- Add `--color-green` CSS var for the brand green; reference it consistently
- Primary (salmon-red `#E3796A`) used only for interactive/active states
- Green used only for logo/brand mark and one primary CTA

---

## 2. Layout & Cards

### Hero section
- Reduce padding: `pt-20 pb-14` → `pt-12 pb-8`
- Search bar: sharper border, no box shadow

### Category cards (Home)
- Remove icon wrapper background container
- Remove `entryCount` sub-label — icon + name only
- Padding: `p-4` → `p-3`
- Hover: `border-primary/50` only, no bg color change

### DocCard
- Remove shadcn `<Card>` wrapper
- Replace with plain `<div>` separated by `border-b border-border` — list style, not box style
- Title + tags rendered inline
- DifficultyBadge moves inline left of title

### Recent entries (Home)
- Render as tight divider-separated list, not 2-col card grid
- Better for scanning; less "dashboard" feel

### Browse CTA button
- Remove inline hex colors
- Use `bg-primary` (salmon-red from theme) — one consistent CTA color

---

## 3. Sidebar & Navigation

### Logo
- Remove the `border px-1.5 py-0.5 rounded-sm` box around "CS"
- Plain `Cheatstack` wordmark in `font-bold`
- Small salmon-red `·` as the only brand mark (before or after the wordmark)

### Nav active state
- Remove `border-l-2` + bg fill combo
- Active: `text-foreground font-medium`
- Inactive: `text-muted-foreground`
- No background highlight on any nav item

### Section group labels ("Concepts", "Packages")
- Remove collapsible chevron behavior — always visible
- Label style: `text-[10px] text-muted-foreground/50 uppercase tracking-widest px-3 mt-4 mb-1`
- Purely decorative grouping, not interactive

### Search trigger
- Remove border box and bg fill
- Just `Search` icon + "Search…" text, muted, no background

### User strip
- Logged-out: sign-in and sign-up as plain text links (no button variants)
- Logged-in: avatar initial + name, logout icon only

---

## 4. Doc Detail Page

### Section labels
- Same `text-[11px] font-medium text-muted-foreground` treatment — no ALL CAPS, no tracking

### Separators
- Remove all decorative `<Separator />` between content sections
- Spacing alone (`space-y-10`) provides separation
- Keep one `<Separator />` before "Related entries" section only

### Breadcrumb
- `text-[11px] font-mono text-muted-foreground` — monospace used here as a navigational signal (only place)

### Pitfall bullets
- Replace amber dot with `—` dash in `text-primary/60`

### Related entries
- Plain text links in tight list, no enclosing section box

### CodeBlock
- No changes to logic — verify `border-radius` matches new `0.25rem` global after CSS var change

---

## Out of scope
- Blog detail page (same patterns apply but lower priority)
- Login / Register / Profile pages
- Search command palette
- Any data/API changes
