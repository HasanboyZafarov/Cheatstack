# Cheatstack

A use-case-first developer documentation platform. Find the answer to "how do I do X" in under 10 seconds — real code, clear explanations, no filler.

Covers React hooks, TypeScript patterns, and the most-used frontend packages (Zustand, TanStack Query, React Hook Form, Zod, MSW, React Router, and more).

---

## Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Zustand — UI state (search, auth session)
- TanStack Query — server state
- React Hook Form + Zod — admin forms
- React Router v6
- Fuse.js — client-side fuzzy search
- MSW + Faker.js — mock API during development
- Lucide React — icons
- Shiki — syntax highlighting

**Backend** *(planned)*
- Node.js + Express
- Supabase (Postgres + Auth)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npm run dev

# Type check + build
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn base components
│   ├── docs/        # DocCard, CodeBlock, CategoryFilter
│   ├── search/      # SearchBar, SearchResults
│   └── admin/       # AdminForms, EntryEditor
├── pages/
│   ├── docs/        # /docs, /docs/:category, /docs/:category/:slug
│   ├── error/       # 404, error boundaries
│   └── register/    # Admin auth
├── store/
│   ├── searchStore.ts
│   └── authStore.ts
├── lib/
│   ├── api/         # All API calls (never fetch directly in components)
│   ├── utils/       # Shared utilities
│   └── validators/  # Zod schemas
├── hooks/           # Custom hooks
├── mocks/           # MSW handlers + Faker fixtures
├── types/           # Shared TypeScript interfaces
└── i18n/            # EN strings (UZ + RU planned)
```

---

## Routes

| Path | Description |
|---|---|
| `/` | Homepage — search, featured topics |
| `/docs` | All entries, filterable |
| `/docs/:category` | Category landing page |
| `/docs/:category/:slug` | Single doc entry |
| `/search` | Search results |
| `/admin` | Dashboard (protected) |
| `/admin/entries` | Manage entries |
| `/admin/entries/new` | Create entry |
| `/admin/entries/:id/edit` | Edit entry |
| `/admin/categories` | Manage categories |
| `/login` | Admin login |

---

## Doc Entry Format

Every entry follows this structure — no exceptions:

```
Title       "How to store an array in localStorage"
Category    localStorage
Type        Concept | Package
Difficulty  Beginner | Intermediate | Advanced
Tags        [localStorage, serialization, JSON]

Problem     What the developer is stuck on
Solution    The approach in plain English
Code        Tested, runnable TypeScript
Why         What's happening under the hood
Watch out   Specific pitfalls, not vague warnings
Related     Links to related entries
```

---

## Content Rules

- Every title starts with "How to..." or is a clear question
- Code examples are tested — no guessing
- 5–10 high-quality entries per category beats 50 mediocre ones
- No filler — every sentence earns its place
- All UI strings go through `i18n/` from day one

---

## User Roles

| Role | Access |
|---|---|
| Guest | Browse, search, copy — no account needed |
| Admin | Create, edit, delete entries and categories |

All content is public. Login is only for content management.
