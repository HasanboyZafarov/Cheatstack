import type { BlogPost } from '@/types'

export const blogPosts: BlogPost[] = [
  {
    id: 'bp-1',
    title: 'React 19 Actions: What You Actually Need to Know',
    slug: 'react-19-actions',
    summary: 'Server Actions changed how we handle form mutations. The practical breakdown — what changed, what it replaces, and what it does not.',
    type: 'article',
    author: 'Cheatstack',
    tags: ['react', 'react-19', 'forms', 'mutations'],
    readTime: 5,
    publishedAt: '2025-05-15T00:00:00Z',
    body: `React 19 shipped a model for handling form mutations that leans into the browser's native mechanics. The headline feature is Actions — async functions passed directly to form elements, with React managing pending state automatically.

## The old pattern

Before React 19, a form submit meant: prevent default, gather values from refs or controlled state, call fetch, manage loading and error manually, update UI on success. That is five or six moving pieces for a routine mutation.

## What changed

Pass an async function as a form's action prop and React handles the pending state via useFormStatus. The function receives a FormData object directly — no synthetic events, no controlled inputs required.

## What this doesn't replace

Actions are optimized for straightforward form submissions. For complex cache invalidation, optimistic updates across multiple queries, or retry logic, TanStack Query is still the right tool. They complement each other rather than compete.

## useOptimistic

The companion hook lets you show a speculative value while an action is pending, then reconcile with the actual server response. It replaces the manual set-state, fire-request, rollback-on-error cycle that optimistic updates previously required.

The practical takeaway: adopt Actions for forms where you own both sides of the request. Keep TanStack Query for client-side async state that outlives a single form interaction.`,
  },
  {
    id: 'bp-2',
    title: 'TypeScript 5.5: Inferred Type Predicates',
    slug: 'typescript-55-inferred-predicates',
    summary: 'TypeScript can now infer type predicates from function bodies. This quietly removes an entire category of manual annotation, starting with Array.filter.',
    type: 'article',
    author: 'Cheatstack',
    tags: ['typescript', 'type-predicates', 'narrowing', 'typescript-5.5'],
    readTime: 4,
    publishedAt: '2025-04-28T00:00:00Z',
    body: `TypeScript 5.5 added one feature that removes a category of manual type annotations: inferred type predicates.

## What type predicates do

A type predicate narrows the type inside a conditional branch. The function signature says what the return value means about the argument's type. Writing them manually is tedious and easy to get wrong.

## What changed in 5.5

TypeScript can now infer the predicate automatically when the return value is a boolean expression that narrows a parameter. The most immediate impact is on Array.filter calls.

Before 5.5, filtering out nulls produced an array still typed as (string | null)[] even though the runtime guarantees only strings pass through. You had to write the type predicate yourself or use a type assertion.

After 5.5, TypeScript sees the filter function, infers that it narrows null away, and correctly types the result as string[].

## Where it applies

- Array.prototype.filter callbacks that check for null or undefined
- Functions that return Boolean(value) or value !== null
- Any narrow-and-return pattern TypeScript can statically verify

## Limits

The inference only works when TypeScript can prove the predicate from the function body. Complex narrowing, external calls, or conditional logic with side effects won't be inferred — you'll still write the predicate manually in those cases.

If you have been writing is(x): x is T wrappers to keep filter results typed correctly, you can delete most of them after upgrading.`,
  },
  {
    id: 'bp-3',
    title: 'You Don\'t Need useEffect for That',
    slug: 'stop-overusing-useeffect',
    summary: 'Most useEffect calls are trying to synchronize two pieces of React state. Here are the patterns that replace them — and the one signal that tells you when an effect is right.',
    type: 'article',
    author: 'Cheatstack',
    tags: ['react', 'useEffect', 'performance', 'patterns'],
    readTime: 6,
    publishedAt: '2025-03-20T00:00:00Z',
    body: `useEffect is the most overused hook in React codebases. Most of the time it appears, it is trying to synchronize two pieces of state — and that is a sign that something should be restructured.

## The three wrong uses

The first wrong use: deriving state from props inside an effect. If a parent passes items as a prop and the child holds a filteredItems state updated by an effect, you have created a one-frame delay and a source of bugs. Compute filtered items during render instead — no state, no effect.

The second wrong use: subscribing to a store or event source to update local state. React ships useSyncExternalStore for exactly this. It handles concurrent mode correctly and removes the synchronization lag that effect-based subscriptions introduce.

The third wrong use: fetching data on mount with a bare useEffect. The effect fires after render, there is no deduplication, no caching, and error handling is manual. TanStack Query handles all of this correctly.

## When useEffect is right

Effects are for synchronizing with systems outside of React: setting document.title, calling a third-party DOM library, starting and stopping a WebSocket connection. The key signal is cleanup — if your effect does not return a cleanup function, there is a good chance it should not be an effect.

The mental model: effects run after render to make the outside world consistent with React's state. If you are using an effect to make React's state consistent with itself, you are working against the grain.

## The practical rule

Before reaching for useEffect, ask: is this synchronizing React with an external system, or am I trying to keep two pieces of state in sync? If it is the latter, there is almost always a better structure available.`,
  },
  {
    id: 'bp-4',
    title: 'Zustand vs Context: A 2025 Decision Guide',
    slug: 'zustand-vs-context-2025',
    summary: 'The right answer depends on one question: does this state outlive the component tree that reads it?',
    type: 'article',
    author: 'Cheatstack',
    tags: ['react', 'zustand', 'context', 'state-management'],
    readTime: 5,
    publishedAt: '2025-02-10T00:00:00Z',
    body: `The choice between Zustand and React Context comes down to one question: does this state outlive the component tree that reads it?

## What Context is good at

Context was designed for dependency injection — passing a theme, a locale, or an auth token down through a component tree without prop drilling. The component that provides the context owns the state. When that component unmounts, the state is gone.

That lifecycle coupling is not a bug. It is the feature. Context values are scoped to a subtree by design.

## What Zustand is good at

Zustand stores exist outside the component tree. The store initializes when you first call create and persists until the page unloads — regardless of whether any component is currently mounted.

This matters for: shopping carts that should survive navigating away, global search state that multiple unrelated components read, and anything that feeds into effects or callbacks that run after unmount.

## The performance difference

Context re-renders every consumer when any part of the context value changes. Zustand components re-render only when their specific selector changes. For high-frequency updates — mouse position, scroll progress, real-time data — this makes a measurable difference.

## The simplicity tradeoff

Context requires no library. For a theme toggle or a logged-in user object that changes once per session, the overhead of adding Zustand is not worth it.

The practical split: use Context for values that are static within a render tree. Use Zustand when state outlives the tree, updates frequently, or needs to be read by components with no natural common parent.`,
  },
  {
    id: 'bp-5',
    title: 'Vite 6 Released',
    slug: 'vite-6-released',
    summary: 'Vite 6 ships the Environment API as its headline feature, giving plugins and frameworks explicit control over multi-target builds.',
    type: 'news',
    author: 'Cheatstack',
    tags: ['vite', 'bundler', 'release', 'tooling'],
    readTime: 2,
    publishedAt: '2025-01-27T00:00:00Z',
    body: `Vite 6 shipped in November 2024 with its Environment API as the headline feature. The API gives plugins and frameworks explicit control over how code is processed for different runtime targets — browser, server, edge — within a single build configuration.

## Environment API

Previous Vite versions processed everything through a single pipeline, requiring workarounds when a project needed different transform rules for client and server bundles. The Environment API formalizes this as a first-class concept.

## Breaking changes

Vite 6 drops support for Node 18 and aligns with the Node.js LTS cadence going forward. The JavaScript API surface also changed — direct use of the internal plugin context is deprecated in favor of explicit environment access.

Most users upgrading from Vite 5 will not hit breaking changes unless they maintain custom plugins that touch the internal pipeline.

## Migration

The official migration guide covers the Environment API and the Node version requirement. Projects using Vite through a framework (Remix, Nuxt, SvelteKit) should wait for framework-level support rather than upgrading directly.`,
  },
  {
    id: 'bp-6',
    title: 'TanStack Query v5 Stable',
    slug: 'tanstack-query-v5-stable',
    summary: 'TanStack Query v5 reached stable in October 2023. The release unifies the API, renames cacheTime to gcTime, and sharpens TypeScript types throughout.',
    type: 'news',
    author: 'Cheatstack',
    tags: ['react-query', 'tanstack', 'release', 'typescript'],
    readTime: 2,
    publishedAt: '2024-11-05T00:00:00Z',
    body: `TanStack Query v5 reached stable in October 2023 after an extended beta. The release unifies the API across framework adapters and ships a simplified mental model for mutations.

## What changed

The biggest surface-area change: the options object replaces function overloads throughout. useQuery now accepts a single options object. cacheTime was renamed to gcTime to better reflect what the value actually controls. The isLoading state was split into isLoading and isPending to distinguish between initial loads and mutation pending states.

## The simplified mutation model

useMutation in v5 accepts the mutation function directly as mutationFn rather than as a positional argument. Error types are explicit — the generic parameter is no longer optional.

## Upgrading from v4

The TanStack team ships a codemod that handles the most mechanical changes. The options rename and the isLoading split require manual review in components that branch on query state. Budget a few hours for a medium-sized codebase.

The v5 API is cleaner and the stricter TypeScript types catch errors that v4 silently allowed. The migration cost is worth it for any project that will be maintained long-term.`,
  },
]
