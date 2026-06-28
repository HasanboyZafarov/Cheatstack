import type { Category, Entry } from '@/types'

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'localStorage',
    slug: 'localstorage',
    type: 'concept',
    description: 'Persist data in the browser across sessions.',
    icon: 'HardDrive',
    order: 1,
    entryCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'useState',
    slug: 'usestate',
    type: 'concept',
    description: 'Manage local component state in React.',
    icon: 'Layers',
    order: 2,
    entryCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'useEffect',
    slug: 'useeffect',
    type: 'concept',
    description: 'Sync your component with external systems.',
    icon: 'Zap',
    order: 3,
    entryCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Zustand',
    slug: 'zustand',
    type: 'package',
    description: 'Minimal global state management for React.',
    icon: 'Box',
    order: 4,
    entryCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'TanStack Query',
    slug: 'react-query',
    type: 'package',
    description: 'Async state management — fetching, caching, syncing.',
    icon: 'RefreshCw',
    order: 5,
    entryCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export const entries: Entry[] = [
  // ─── localStorage ────────────────────────────────────────────────────────────
  {
    id: 'e-ls-1',
    categoryId: 'cat-1',
    categorySlug: 'localstorage',
    title: 'How to store a string in localStorage',
    slug: 'store-string',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['localStorage', 'storage', 'string'],
    problem: 'You need to persist a simple string value — like a username or a preference — so it survives a page reload.',
    solution: 'Use `localStorage.setItem(key, value)` to write and `localStorage.getItem(key)` to read. Both key and value must be strings.',
    code: `// Write
localStorage.setItem('username', 'alice')

// Read
const username = localStorage.getItem('username') // "alice"

// Remove one item
localStorage.removeItem('username')`,
    codeLanguage: 'typescript',
    explanation: '`localStorage` is a synchronous key-value store attached to the origin. Data persists until explicitly cleared — it survives tab closes, browser restarts, and page refreshes. The API only accepts strings, so primitive values work out of the box.',
    pitfalls: [
      '`getItem` returns `null` (not `undefined`) when the key does not exist — always check for null before using the value.',
      'Storage is synchronous and blocks the main thread — avoid large reads/writes in tight loops.',
      'Storage is origin-scoped: `http://localhost:3000` and `http://localhost:4000` have separate stores.',
    ],
    relatedSlugs: ['store-array', 'store-object', 'read-safely'],
    published: true,
    views: 1420,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'e-ls-2',
    categoryId: 'cat-1',
    categorySlug: 'localstorage',
    title: 'How to store an array in localStorage',
    slug: 'store-array',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['localStorage', 'array', 'JSON'],
    problem: 'localStorage only stores strings. Storing an array directly converts it to `"[object Object]"` — useless.',
    solution: 'Serialize with `JSON.stringify` before writing, and parse with `JSON.parse` when reading.',
    code: `const fruits = ['apple', 'banana', 'cherry']

// Write
localStorage.setItem('fruits', JSON.stringify(fruits))

// Read
const raw = localStorage.getItem('fruits')
const stored: string[] = raw ? JSON.parse(raw) : []`,
    codeLanguage: 'typescript',
    explanation: '`JSON.stringify` converts any JSON-compatible value to a string. `JSON.parse` reverses it. Wrapping in a null check handles the case where the key has never been set.',
    pitfalls: [
      '`JSON.parse` throws a `SyntaxError` if the stored string is not valid JSON — wrap in try/catch if the value could ever be corrupted.',
      '`JSON.stringify` drops `undefined` values and converts `Date` objects to ISO strings (they come back as strings, not Date instances).',
      'Arrays of class instances lose their prototype — only plain objects and primitives survive the round-trip.',
    ],
    relatedSlugs: ['store-object', 'read-safely'],
    published: true,
    views: 2381,
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: 'e-ls-3',
    categoryId: 'cat-1',
    categorySlug: 'localstorage',
    title: 'How to store an object in localStorage',
    slug: 'store-object',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['localStorage', 'object', 'JSON'],
    problem: 'You have a user settings object and want it to persist across page refreshes.',
    solution: 'Same pattern as arrays: `JSON.stringify` to write, `JSON.parse` to read. Provide a typed fallback for the null case.',
    code: `interface Settings {
  theme: 'light' | 'dark'
  fontSize: number
}

const defaults: Settings = { theme: 'dark', fontSize: 14 }

// Write
localStorage.setItem('settings', JSON.stringify(defaults))

// Read with fallback
function getSettings(): Settings {
  const raw = localStorage.getItem('settings')
  return raw ? (JSON.parse(raw) as Settings) : defaults
}`,
    codeLanguage: 'typescript',
    explanation: 'The type assertion (`as Settings`) tells TypeScript what shape to expect. It does not validate at runtime — if the stored data is outdated or malformed, you will get a runtime error. For production apps, validate with Zod.',
    pitfalls: [
      'TypeScript`s `as` cast is compile-time only. A stored value from an old schema version will happily pass the cast and then break your UI.',
      'Consider using Zod`s `safeParse` to validate after parsing if the schema has ever changed.',
    ],
    relatedSlugs: ['store-array', 'read-safely'],
    published: true,
    views: 1853,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'e-ls-4',
    categoryId: 'cat-1',
    categorySlug: 'localstorage',
    title: 'How to read from localStorage safely',
    slug: 'read-safely',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['localStorage', 'error-handling', 'try-catch'],
    problem: '`JSON.parse` can throw, and `getItem` can return null. Raw reads are fragile in production.',
    solution: 'Wrap reads in a try/catch and always supply a typed fallback.',
    code: `function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

// Usage
const count = getItem<number>('count', 0)
const tags  = getItem<string[]>('tags', [])`,
    codeLanguage: 'typescript',
    explanation: 'The generic `T` lets TypeScript infer the return type from the fallback. The try/catch handles parse errors. The `null` check handles missing keys. This one function covers all localStorage reads safely.',
    pitfalls: [
      '`localStorage` itself can throw in private browsing mode when storage quota is exceeded — the try/catch handles that too.',
      'Do not swallow the error silently in production — at minimum log it for observability.',
    ],
    relatedSlugs: ['store-array', 'store-object', 'clear-on-logout'],
    published: true,
    views: 2140,
    createdAt: '2024-01-13T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z',
  },
  {
    id: 'e-ls-5',
    categoryId: 'cat-1',
    categorySlug: 'localstorage',
    title: 'How to clear localStorage on logout',
    slug: 'clear-on-logout',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['localStorage', 'auth', 'security'],
    problem: 'When a user logs out, their session data and preferences must be wiped from the browser.',
    solution: 'Use `localStorage.clear()` to remove everything, or `removeItem` to surgically remove specific keys.',
    code: `// Remove everything (use when all data belongs to the logged-in user)
function logout() {
  localStorage.clear()
  window.location.href = '/login'
}

// Remove specific keys (use when some data is app-wide)
function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('cart')
  window.location.href = '/login'
}`,
    codeLanguage: 'typescript',
    explanation: '`clear()` is one line and covers future keys automatically. `removeItem` is surgical — use it when some localStorage data (like UI preferences) should survive across different users on the same browser.',
    pitfalls: [
      'If you use `clear()`, any third-party scripts that also use localStorage (analytics, chat widgets) lose their data too.',
      'Tokens stored in localStorage are accessible to JavaScript — consider `httpOnly` cookies for sensitive auth tokens.',
    ],
    relatedSlugs: ['store-string', 'listen-for-changes'],
    published: true,
    views: 987,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: 'e-ls-6',
    categoryId: 'cat-1',
    categorySlug: 'localstorage',
    title: 'How to listen for localStorage changes',
    slug: 'listen-for-changes',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['localStorage', 'events', 'cross-tab'],
    problem: 'You need to react when localStorage is updated — for example, to sync state across browser tabs.',
    solution: 'Listen to the `storage` event on `window`. It fires when another tab modifies localStorage, not the current tab.',
    code: `useEffect(() => {
  function handleStorage(e: StorageEvent) {
    if (e.key === 'theme' && e.newValue) {
      setTheme(e.newValue as 'light' | 'dark')
    }
  }

  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}, [])`,
    codeLanguage: 'typescript',
    explanation: 'The `StorageEvent` includes `key`, `oldValue`, `newValue`, and `url` (the tab that made the change). The event only fires in OTHER tabs — your current tab will not receive it for its own writes.',
    pitfalls: [
      'The `storage` event does NOT fire in the tab that made the change — only in other tabs on the same origin.',
      'To react to changes in the current tab, you must call your handler manually after writing.',
      '`e.newValue` is `null` when the key was removed, not when it was set to an empty string.',
    ],
    relatedSlugs: ['store-string', 'clear-on-logout'],
    published: true,
    views: 1234,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },

  // ─── useState ────────────────────────────────────────────────────────────────
  {
    id: 'e-us-1',
    categoryId: 'cat-2',
    categorySlug: 'usestate',
    title: 'How to toggle a boolean with useState',
    slug: 'toggle-boolean',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useState', 'boolean', 'toggle'],
    problem: 'You need a boolean flag — like `isOpen` or `isLoading` — that flips on and off.',
    solution: 'Pass a callback to the setter so the toggle is always based on the latest state, not a stale closure.',
    code: `const [isOpen, setIsOpen] = useState(false)

// ✅ Always correct — uses latest state
const toggle = () => setIsOpen(prev => !prev)

// ❌ Can be stale in closures
const toggle = () => setIsOpen(!isOpen)

return <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>`,
    codeLanguage: 'typescript',
    explanation: 'When you pass a function to `setState`, React calls it with the most recent state value. This matters in event handlers and effects where `isOpen` might be stale due to closures.',
    pitfalls: [
      'Using `setIsOpen(!isOpen)` instead of the callback form can cause bugs when the handler is called multiple times before React re-renders (e.g. rapid clicks).',
    ],
    relatedSlugs: ['update-object', 'reset-state'],
    published: true,
    views: 3210,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'e-us-2',
    categoryId: 'cat-2',
    categorySlug: 'usestate',
    title: 'How to update an object in state without mutation',
    slug: 'update-object',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useState', 'object', 'immutability'],
    problem: 'You have an object in state and need to update one property. Mutating it directly does not cause a re-render.',
    solution: 'Spread the existing object into a new one, then override the changed field.',
    code: `interface User {
  name: string
  age: number
  email: string
}

const [user, setUser] = useState<User>({ name: 'Alice', age: 30, email: 'a@example.com' })

// ✅ Creates a new object — React sees the change
setUser(prev => ({ ...prev, age: 31 }))

// ❌ Mutates in place — React sees same reference, no re-render
user.age = 31
setUser(user)`,
    codeLanguage: 'typescript',
    explanation: 'React uses `Object.is` to compare state. A mutated object has the same reference, so React considers it unchanged and skips the render. Spreading creates a new reference, which triggers a re-render.',
    pitfalls: [
      'Spread is shallow — nested objects still share references. For deeply nested state, spread each level or use `immer`.',
      'Do not mutate the `prev` argument inside the setter callback.',
    ],
    relatedSlugs: ['update-array', 'toggle-boolean'],
    published: true,
    views: 2890,
    createdAt: '2024-01-21T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
  {
    id: 'e-us-3',
    categoryId: 'cat-2',
    categorySlug: 'usestate',
    title: 'How to add and remove items from an array in state',
    slug: 'update-array',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useState', 'array', 'immutability'],
    problem: 'You need to add or remove items from an array in state without mutating it.',
    solution: 'Use spread for adding, `filter` for removing. Never use `push`, `pop`, or `splice` on state arrays.',
    code: `const [tags, setTags] = useState<string[]>(['react', 'typescript'])

// Add
const addTag = (tag: string) =>
  setTags(prev => [...prev, tag])

// Remove by value
const removeTag = (tag: string) =>
  setTags(prev => prev.filter(t => t !== tag))

// Remove by index
const removeAt = (index: number) =>
  setTags(prev => prev.filter((_, i) => i !== index))`,
    codeLanguage: 'typescript',
    explanation: 'Spread creates a new array. `filter` creates a new array containing only the items that pass the test. Both return new references, which React detects as a state change.',
    pitfalls: [
      '`push` and `splice` mutate in place — they will not trigger a re-render.',
      'When removing by value, `filter` removes ALL items with that value. Use index removal if duplicates are possible.',
    ],
    relatedSlugs: ['update-object', 'toggle-boolean'],
    published: true,
    views: 2654,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: 'e-us-4',
    categoryId: 'cat-2',
    categorySlug: 'usestate',
    title: 'How to use lazy initializer for expensive initial state',
    slug: 'lazy-initializer',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['useState', 'performance', 'initializer'],
    problem: 'Your initial state is computed from an expensive function. Calling it directly runs it on every render, not just the first.',
    solution: 'Pass the function itself (not its result) to `useState`. React calls it once on mount.',
    code: `// ❌ getInitialItems() runs on every render
const [items, setItems] = useState(getInitialItems())

// ✅ getInitialItems runs once on mount
const [items, setItems] = useState(getInitialItems)

// Works for localStorage reads too
const [settings, setSettings] = useState(() => {
  const raw = localStorage.getItem('settings')
  return raw ? JSON.parse(raw) : defaultSettings
})`,
    codeLanguage: 'typescript',
    explanation: 'When you pass a value, React evaluates it synchronously on every render (even though it uses it only on mount). When you pass a function, React calls it once and ignores it afterward.',
    pitfalls: [
      'The initializer function must not take arguments.',
      'Do not confuse this with the setter callback form — `setState(() => …)` is different from `useState(() => …)`.',
    ],
    relatedSlugs: ['toggle-boolean', 'reset-state'],
    published: true,
    views: 1876,
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z',
  },
  {
    id: 'e-us-5',
    categoryId: 'cat-2',
    categorySlug: 'usestate',
    title: 'How to reset state to its initial value',
    slug: 'reset-state',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useState', 'reset', 'form'],
    problem: 'You need a reset button that returns all form fields (or any state) to their starting values.',
    solution: 'Extract initial values into a constant and call `setState(initial)` in the reset handler.',
    code: `const INITIAL = { name: '', email: '', message: '' }

const [form, setForm] = useState(INITIAL)

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

const reset = () => setForm(INITIAL)

return (
  <form onReset={reset}>
    <input name="name" value={form.name} onChange={handleChange} />
    <button type="reset">Reset</button>
  </form>
)`,
    codeLanguage: 'typescript',
    explanation: 'Keeping the initial state in a constant means the reset handler always restores exactly the same shape, even if the component re-renders between edits.',
    pitfalls: [
      'If initial state is derived from props, use `key` on the component instead — changing `key` unmounts and remounts, resetting all state for free.',
    ],
    relatedSlugs: ['update-object', 'toggle-boolean'],
    published: true,
    views: 1543,
    createdAt: '2024-01-24T00:00:00Z',
    updatedAt: '2024-01-24T00:00:00Z',
  },
  {
    id: 'e-us-6',
    categoryId: 'cat-2',
    categorySlug: 'usestate',
    title: 'How to share state between sibling components',
    slug: 'share-state',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['useState', 'lifting state', 'props'],
    problem: 'Two sibling components need to read and write the same piece of state.',
    solution: 'Lift the state to their closest common parent and pass it down via props.',
    code: `function Parent() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <TabList selected={selected} onSelect={setSelected} />
      <TabPanel selected={selected} />
    </div>
  )
}

function TabList({ selected, onSelect }: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  return <button onClick={() => onSelect('tab-1')}>Tab 1</button>
}`,
    codeLanguage: 'typescript',
    explanation: 'Lifting state is the idiomatic React pattern for sharing state between siblings. The parent owns the state; children read and write it through props.',
    pitfalls: [
      'If the shared state needs to be accessed in deeply nested components, prop-drilling becomes painful. At that point, reach for Context or Zustand.',
    ],
    relatedSlugs: ['update-object', 'reset-state'],
    published: true,
    views: 1987,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },

  // ─── useEffect ───────────────────────────────────────────────────────────────
  {
    id: 'e-ue-1',
    categoryId: 'cat-3',
    categorySlug: 'useeffect',
    title: 'How to fetch data when a component mounts',
    slug: 'fetch-on-mount',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useEffect', 'fetch', 'async'],
    problem: 'You need to load data from an API when a component first appears on screen.',
    solution: 'Call your fetch inside a `useEffect` with an empty dependency array. Handle loading and error states.',
    code: `interface User { id: number; name: string }

function UserCard({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(\`/api/users/\${userId}\`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data: User = await res.json()
        if (!cancelled) setUser(data)
      } catch (e) {
        if (!cancelled) setError((e as Error).message)
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  if (error) return <p>Error: {error}</p>
  if (!user) return <p>Loading…</p>
  return <p>{user.name}</p>
}`,
    codeLanguage: 'typescript',
    explanation: 'The `cancelled` flag prevents setting state on an unmounted component or after a newer request has started. This matters when `userId` changes quickly.',
    pitfalls: [
      'Do not make the `useEffect` callback `async` directly — React ignores the returned Promise. Use an inner async function instead.',
      'Always handle the case where the component unmounts before the fetch completes.',
      'For production, use TanStack Query instead — it handles caching, deduplication, and background refetching automatically.',
    ],
    relatedSlugs: ['run-once', 'avoid-infinite-loop', 'cleanup-interval'],
    published: true,
    views: 4120,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'e-ue-2',
    categoryId: 'cat-3',
    categorySlug: 'useeffect',
    title: 'How to run code when a dependency changes',
    slug: 'run-on-change',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useEffect', 'dependencies', 'watch'],
    problem: 'You need to run side-effect code — like syncing to localStorage or resetting a form — whenever a specific value changes.',
    solution: 'Add the value to the dependency array. The effect runs after every render where that value changed.',
    code: `// Sync theme to localStorage whenever it changes
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])

// Reset form when user changes
useEffect(() => {
  setForm(INITIAL_FORM)
}, [userId])

// Log every search query change
useEffect(() => {
  if (query.trim()) {
    console.log('User searched for:', query)
  }
}, [query])`,
    codeLanguage: 'typescript',
    explanation: 'React compares dependencies using `Object.is`. When any dependency changes between renders, the effect re-runs. On first render, the effect always runs regardless of dependency values.',
    pitfalls: [
      'Object and array literals in dependencies are new references every render — they will cause the effect to run every time. Memoize them with `useMemo` or `useRef`.',
      'Functions defined inside the component are new references every render for the same reason. Use `useCallback` or move them outside the component.',
    ],
    relatedSlugs: ['avoid-infinite-loop', 'fetch-on-mount'],
    published: true,
    views: 2345,
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-02-02T00:00:00Z',
  },
  {
    id: 'e-ue-3',
    categoryId: 'cat-3',
    categorySlug: 'useeffect',
    title: 'How to clean up a timer or subscription in useEffect',
    slug: 'cleanup-interval',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['useEffect', 'cleanup', 'interval', 'subscription'],
    problem: 'You set up a `setInterval` or event listener in an effect but it keeps running after the component unmounts, causing memory leaks and errors.',
    solution: 'Return a cleanup function from the effect. React calls it before the next effect run and on unmount.',
    code: `// Interval cleanup
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)

  return () => clearInterval(id)
}, [])

// Event listener cleanup
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [onClose])`,
    codeLanguage: 'typescript',
    explanation: 'The function returned from `useEffect` is the "cleanup". React calls it in two situations: before running the effect again (when dependencies change) and when the component unmounts. Always clean up timers, listeners, and subscriptions.',
    pitfalls: [
      'Forgetting cleanup on intervals causes them to stack — each re-render adds a new interval.',
      'If `onClose` is not stable (new reference each render), add it to the dependency array and wrap it in `useCallback`.',
    ],
    relatedSlugs: ['run-on-change', 'avoid-infinite-loop'],
    published: true,
    views: 3012,
    createdAt: '2024-02-03T00:00:00Z',
    updatedAt: '2024-02-03T00:00:00Z',
  },
  {
    id: 'e-ue-4',
    categoryId: 'cat-3',
    categorySlug: 'useeffect',
    title: 'How to avoid the infinite loop in useEffect',
    slug: 'avoid-infinite-loop',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['useEffect', 'infinite loop', 'dependencies'],
    problem: 'Your effect runs, updates state, which triggers a render, which runs the effect again — forever.',
    solution: 'Make sure state updates inside an effect do not cause the dependencies to change. Common fixes: empty dependency array, comparing before updating, or removing the dependency.',
    code: `// ❌ Infinite loop — count is a dependency that the effect changes
useEffect(() => {
  setCount(count + 1) // changes count → rerenders → effect runs again
}, [count])

// ✅ Use setter function — no dependency on count
useEffect(() => {
  setCount(prev => prev + 1)
}, []) // runs once

// ❌ Infinite loop — object literal is a new reference every render
useEffect(() => {
  fetchData(options) // options is { page: 1 } defined in the component body
}, [options])

// ✅ Move stable objects outside the component
const OPTIONS = { page: 1 }
useEffect(() => {
  fetchData(OPTIONS)
}, []) // OPTIONS never changes`,
    codeLanguage: 'typescript',
    explanation: 'An infinite loop happens when an effect\'s side effect changes one of its own dependencies. The functional form of `setState` breaks the cycle because it does not need to read current state — React provides it.',
    pitfalls: [
      'Object and array dependencies are almost always the cause of unexpected loops — they are never `===` equal even with identical contents.',
      'ESLint exhaustive-deps rule will warn about missing dependencies. Adding them blindly can introduce loops — understand why they are missing first.',
    ],
    relatedSlugs: ['run-on-change', 'fetch-on-mount'],
    published: true,
    views: 5430,
    createdAt: '2024-02-04T00:00:00Z',
    updatedAt: '2024-02-04T00:00:00Z',
  },
  {
    id: 'e-ue-5',
    categoryId: 'cat-3',
    categorySlug: 'useeffect',
    title: 'How to run an effect only once on mount',
    slug: 'run-once',
    type: 'concept',
    difficulty: 'beginner',
    tags: ['useEffect', 'mount', 'once'],
    problem: 'You need to run code once when the component mounts — initialize a library, set a document title, etc.',
    solution: 'Pass an empty array `[]` as the dependency array. The effect runs once after the first render.',
    code: `// Run once on mount
useEffect(() => {
  document.title = 'My App'
}, [])

// Initialize a third-party library once
useEffect(() => {
  const map = new mapboxgl.Map({ container: 'map', style: '...' })
  return () => map.remove() // cleanup on unmount
}, [])`,
    codeLanguage: 'typescript',
    explanation: 'An empty dependency array tells React: "this effect has no dependencies that change." React runs it once after mount and calls the cleanup once when the component unmounts.',
    pitfalls: [
      'In React 18 Strict Mode (development only), effects run twice on mount to expose cleanup bugs. If your effect is not idempotent, check this first.',
      'If you use any value from the component inside the effect, it should be in the dependency array — do not use `[]` to silence ESLint.',
    ],
    relatedSlugs: ['cleanup-interval', 'fetch-on-mount'],
    published: true,
    views: 3780,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
  {
    id: 'e-ue-6',
    categoryId: 'cat-3',
    categorySlug: 'useeffect',
    title: 'How to debounce a value with useEffect',
    slug: 'debounce-value',
    type: 'concept',
    difficulty: 'intermediate',
    tags: ['useEffect', 'debounce', 'performance', 'search'],
    problem: 'You are firing an API call on every keystroke. You want to wait until the user stops typing for 300ms before searching.',
    solution: 'Store the debounced value in state using a `setTimeout` that is cleared on every change.',
    code: `function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

// In your component
const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (debouncedQuery) search(debouncedQuery)
}, [debouncedQuery])`,
    codeLanguage: 'typescript',
    explanation: 'Every time `value` changes, the cleanup clears the previous timeout. The new timeout starts. If `value` stops changing, the timeout completes and `debounced` updates — triggering the search effect.',
    pitfalls: [
      'The delay parameter itself is a dependency. If you pass a new number literal each render (`useDebounce(q, 300)`), the literal `300` is the same value each render — this is fine.',
    ],
    relatedSlugs: ['cleanup-interval', 'run-on-change'],
    published: true,
    views: 2901,
    createdAt: '2024-02-06T00:00:00Z',
    updatedAt: '2024-02-06T00:00:00Z',
  },

  // ─── Zustand ─────────────────────────────────────────────────────────────────
  {
    id: 'e-z-1',
    categoryId: 'cat-4',
    categorySlug: 'zustand',
    title: 'How to create a basic Zustand store',
    slug: 'create-store',
    type: 'package',
    difficulty: 'beginner',
    tags: ['zustand', 'store', 'state'],
    problem: 'You need global state shared across components without prop drilling or Context boilerplate.',
    solution: 'Define a store with `create`, describing state shape and updater functions.',
    code: `import { create } from 'zustand'

interface CountStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCountStore = create<CountStore>()(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

export default useCountStore`,
    codeLanguage: 'typescript',
    explanation: '`create` returns a hook. The function passed to `create` receives `set` — a function to merge partial state. Actions live alongside state in the same object, keeping everything co-located.',
    pitfalls: [
      'Do not call the store hook outside of React components or custom hooks — it uses React\'s hook rules.',
      'The double function call pattern `create<T>()()` is required for TypeScript type inference to work correctly.',
    ],
    relatedSlugs: ['read-state', 'update-state', 'typescript-store'],
    published: true,
    views: 3401,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'e-z-2',
    categoryId: 'cat-4',
    categorySlug: 'zustand',
    title: 'How to read state from a Zustand store',
    slug: 'read-state',
    type: 'package',
    difficulty: 'beginner',
    tags: ['zustand', 'selector', 'performance'],
    problem: 'You have a Zustand store and need to read one or more values in a component.',
    solution: 'Pass a selector to the hook. This subscribes the component only to the selected slice — not the whole store.',
    code: `// Select a single value
const count = useCountStore(state => state.count)

// Select an action (actions are stable — fine to select without memo)
const increment = useCountStore(state => state.increment)

// Select multiple values — returns a new object, so be careful
const { count, max } = useCountStore(state => ({ count: state.count, max: state.max }))
// ↑ re-renders when count OR max changes, but the object is new every call
// Use individual selectors to be precise:
const count = useCountStore(s => s.count)
const max   = useCountStore(s => s.max)`,
    codeLanguage: 'typescript',
    explanation: 'Zustand re-renders a component only when the selected value changes (using `Object.is`). Selecting the whole store (`state => state`) means every state change causes a re-render — avoid this.',
    pitfalls: [
      'Selectors that return new objects or arrays every call cause a re-render on every state update, even when the data did not change. Use `useShallow` from `zustand/react/shallow` for object/array selectors.',
    ],
    relatedSlugs: ['create-store', 'update-state'],
    published: true,
    views: 2780,
    createdAt: '2024-03-02T00:00:00Z',
    updatedAt: '2024-03-02T00:00:00Z',
  },
  {
    id: 'e-z-3',
    categoryId: 'cat-4',
    categorySlug: 'zustand',
    title: 'How to update state in a Zustand store',
    slug: 'update-state',
    type: 'package',
    difficulty: 'beginner',
    tags: ['zustand', 'set', 'update'],
    problem: 'You need to update state in your Zustand store from inside or outside a component.',
    solution: 'Call `set` inside an action. For complex updates, use the functional form to access current state.',
    code: `interface CartStore {
  items: string[]
  addItem: (item: string) => void
  removeItem: (item: string) => void
  clear: () => void
}

const useCartStore = create<CartStore>()(set => ({
  items: [],
  // Functional form — reads current state
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
  // Value form — replaces with a known value
  removeItem: (item) => set(state => ({ items: state.items.filter(i => i !== item) })),
  clear: () => set({ items: [] }),
}))`,
    codeLanguage: 'typescript',
    explanation: '`set` merges by default — you only need to include the fields you are changing. Zustand does a shallow merge, so `set({ items: [] })` does not wipe out the action functions.',
    pitfalls: [
      'Do not use `setState` patterns like spreading the entire store — Zustand merges automatically.',
      'For nested state, you must spread manually since the merge is shallow.',
    ],
    relatedSlugs: ['create-store', 'read-state', 'persist-localstorage'],
    published: true,
    views: 2341,
    createdAt: '2024-03-03T00:00:00Z',
    updatedAt: '2024-03-03T00:00:00Z',
  },
  {
    id: 'e-z-4',
    categoryId: 'cat-4',
    categorySlug: 'zustand',
    title: 'How to type a Zustand store with TypeScript',
    slug: 'typescript-store',
    type: 'package',
    difficulty: 'intermediate',
    tags: ['zustand', 'typescript', 'types'],
    problem: 'You want full type safety in your Zustand store — state, actions, and selectors.',
    solution: 'Define an interface for the store and pass it as a generic to `create`. Use the double-call pattern for correct inference.',
    code: `import { create } from 'zustand'

interface AuthState {
  user: { id: string; name: string } | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (user: AuthState['user'], token: string) => void
  logout: () => void
}

type AuthStore = AuthState & AuthActions

const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}))

// Selector type is inferred automatically
const user = useAuthStore(s => s.user) // type: { id: string; name: string } | null`,
    codeLanguage: 'typescript',
    explanation: 'Separating state and action interfaces makes the type easier to read. The generic parameter tells TypeScript what `set` and `get` can access. Selectors are inferred from the store type.',
    pitfalls: [
      'Without the double-call pattern (`create<T>()()`), TypeScript cannot infer the state type inside the creator function.',
    ],
    relatedSlugs: ['create-store', 'read-state'],
    published: true,
    views: 1987,
    createdAt: '2024-03-04T00:00:00Z',
    updatedAt: '2024-03-04T00:00:00Z',
  },
  {
    id: 'e-z-5',
    categoryId: 'cat-4',
    categorySlug: 'zustand',
    title: 'How to persist Zustand state to localStorage',
    slug: 'persist-localstorage',
    type: 'package',
    difficulty: 'intermediate',
    tags: ['zustand', 'persist', 'localStorage', 'middleware'],
    problem: 'You want your Zustand store to survive page refreshes by syncing it to localStorage automatically.',
    solution: 'Wrap your store creator with the `persist` middleware from `zustand/middleware`.',
    code: `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // localStorage key
      partialize: (state) => ({ theme: state.theme }), // only persist theme, not actions
    }
  )
)`,
    codeLanguage: 'typescript',
    explanation: '`persist` wraps your store and reads from localStorage on initialization, then writes on every state change. `partialize` lets you persist only the state you care about — actions are recreated each time.',
    pitfalls: [
      'If you rename a state field, old localStorage values will be ignored for that field. Use the `migrate` option to handle schema changes.',
      'Persist uses JSON serialization — the same limitations as manual localStorage apply (no `undefined`, no Dates, etc.).',
    ],
    relatedSlugs: ['create-store', 'update-state'],
    published: true,
    views: 2456,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: 'e-z-6',
    categoryId: 'cat-4',
    categorySlug: 'zustand',
    title: 'How to split a large Zustand store into slices',
    slug: 'store-slices',
    type: 'package',
    difficulty: 'advanced',
    tags: ['zustand', 'slices', 'architecture'],
    problem: 'Your Zustand store has grown large with many unrelated concerns mixed together.',
    solution: 'Define each concern as a slice — a function that takes `set` and `get` and returns part of the store. Merge them in a single `create` call.',
    code: `import { create, StateCreator } from 'zustand'

interface UserSlice { user: string | null; setUser: (u: string) => void }
interface CartSlice { items: string[]; addItem: (i: string) => void }

type AppStore = UserSlice & CartSlice

const createUserSlice: StateCreator<AppStore, [], [], UserSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
})

const createCartSlice: StateCreator<AppStore, [], [], CartSlice> = (set) => ({
  items: [],
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
})

const useAppStore = create<AppStore>()((...a) => ({
  ...createUserSlice(...a),
  ...createCartSlice(...a),
}))`,
    codeLanguage: 'typescript',
    explanation: 'Each slice is a self-contained module. Slices can call `get()` to read other slices\' state. The merged store behaves like a single store — components see no difference.',
    pitfalls: [
      'The `StateCreator` generic requires the full store type as the first parameter so cross-slice `get()` calls are typed correctly.',
    ],
    relatedSlugs: ['create-store', 'typescript-store'],
    published: true,
    views: 1654,
    createdAt: '2024-03-06T00:00:00Z',
    updatedAt: '2024-03-06T00:00:00Z',
  },

  // ─── TanStack Query ──────────────────────────────────────────────────────────
  {
    id: 'e-rq-1',
    categoryId: 'cat-5',
    categorySlug: 'react-query',
    title: 'How to fetch data with useQuery',
    slug: 'usequery-basic',
    type: 'package',
    difficulty: 'beginner',
    tags: ['react-query', 'useQuery', 'fetch'],
    problem: 'You need to fetch data from an API and handle loading, error, and success states.',
    solution: 'Use `useQuery` with a query key and an async fetch function.',
    code: `import { useQuery } from '@tanstack/react-query'

interface Post { id: number; title: string; body: string }

async function fetchPost(id: number): Promise<Post> {
  const res = await fetch(\`/api/posts/\${id}\`)
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

function PostDetail({ id }: { id: number }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

  if (isLoading) return <Skeleton />
  if (isError) return <p>Error: {(error as Error).message}</p>
  return <h1>{data.title}</h1>
}`,
    codeLanguage: 'typescript',
    explanation: 'The `queryKey` is an array that uniquely identifies this query. When it changes (e.g. `id` changes), React Query automatically refetches. Results are cached by key — subsequent renders with the same key use cached data instantly.',
    pitfalls: [
      'Always throw errors in the query function — do not resolve with error objects. React Query checks for thrown errors, not response shapes.',
      'The query key must include all variables used in the query function. Stale keys cause stale data.',
    ],
    relatedSlugs: ['usequery-params', 'loading-error-states', 'usemutation-basic'],
    published: true,
    views: 4230,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'e-rq-2',
    categoryId: 'cat-5',
    categorySlug: 'react-query',
    title: 'How to add query parameters to useQuery',
    slug: 'usequery-params',
    type: 'package',
    difficulty: 'beginner',
    tags: ['react-query', 'useQuery', 'filters', 'params'],
    problem: 'Your API accepts filter or pagination parameters and you need the query to re-run when they change.',
    solution: 'Include all parameters in the query key array. React Query re-fetches automatically when any key element changes.',
    code: `interface Filters { category: string; difficulty: string; page: number }

async function fetchEntries(filters: Filters) {
  const params = new URLSearchParams(filters as Record<string, string>)
  const res = await fetch(\`/api/entries?\${params}\`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function EntryList({ filters }: { filters: Filters }) {
  const { data, isLoading } = useQuery({
    queryKey: ['entries', filters.category, filters.difficulty, filters.page],
    queryFn: () => fetchEntries(filters),
    placeholderData: keepPreviousData, // keeps old data visible while fetching new page
  })

  return isLoading ? <Spinner /> : <List items={data} />
}`,
    codeLanguage: 'typescript',
    explanation: '`placeholderData: keepPreviousData` prevents the UI from showing a loading spinner on every page/filter change — it shows the old data with a subtle staleness indicator instead.',
    pitfalls: [
      'Do not put the entire `filters` object as one key element — `[\'entries\', filters]` would be a new object reference every render. Spread the values: `[\'entries\', filters.category, …]`.',
    ],
    relatedSlugs: ['usequery-basic', 'loading-error-states'],
    published: true,
    views: 2890,
    createdAt: '2024-04-02T00:00:00Z',
    updatedAt: '2024-04-02T00:00:00Z',
  },
  {
    id: 'e-rq-3',
    categoryId: 'cat-5',
    categorySlug: 'react-query',
    title: 'How to create a mutation with useMutation',
    slug: 'usemutation-basic',
    type: 'package',
    difficulty: 'beginner',
    tags: ['react-query', 'useMutation', 'POST', 'create'],
    problem: 'You need to send data to the server (POST, PUT, DELETE) and update the UI based on the result.',
    solution: 'Use `useMutation` for write operations. Call `mutate` or `mutateAsync` to trigger them.',
    code: `import { useMutation, useQueryClient } from '@tanstack/react-query'

async function createEntry(data: { title: string; code: string }) {
  const res = await fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

function NewEntryForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })

  return (
    <button
      onClick={() => mutation.mutate({ title: 'How to…', code: '…' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Saving…' : 'Save'}
    </button>
  )
}`,
    codeLanguage: 'typescript',
    explanation: '`onSuccess` is where you invalidate queries to trigger a refetch of fresh data. `invalidateQueries` marks all matching queries as stale — React Query refetches them when their component is visible.',
    pitfalls: [
      '`mutate` is fire-and-forget. `mutateAsync` returns a Promise — use it when you need to `await` the result or chain operations.',
      'Do not call `mutate` in a `useEffect` — it is an imperative action, not a side effect.',
    ],
    relatedSlugs: ['usequery-basic', 'invalidate-refetch', 'optimistic-update'],
    published: true,
    views: 3120,
    createdAt: '2024-04-03T00:00:00Z',
    updatedAt: '2024-04-03T00:00:00Z',
  },
  {
    id: 'e-rq-4',
    categoryId: 'cat-5',
    categorySlug: 'react-query',
    title: 'How to invalidate and refetch a query',
    slug: 'invalidate-refetch',
    type: 'package',
    difficulty: 'intermediate',
    tags: ['react-query', 'invalidate', 'refetch', 'cache'],
    problem: 'After a mutation, your query data is stale. You need to refresh it without a manual page reload.',
    solution: 'Call `queryClient.invalidateQueries` with the relevant query key. React Query refetches any active queries matching that key.',
    code: `const queryClient = useQueryClient()

// Invalidate all entries queries
queryClient.invalidateQueries({ queryKey: ['entries'] })

// Invalidate a specific entry
queryClient.invalidateQueries({ queryKey: ['entry', entryId] })

// Invalidate and await the refetch
await queryClient.invalidateQueries({ queryKey: ['entries'] })

// Direct refetch without invalidating
queryClient.refetchQueries({ queryKey: ['entries'] })

// Manually set the cache (useful after a mutation returns the updated data)
queryClient.setQueryData(['entry', entryId], updatedEntry)`,
    codeLanguage: 'typescript',
    explanation: '`invalidateQueries` marks queries as stale and refetches them if they have active observers (mounted components). `setQueryData` skips the network call entirely — use it when your mutation response already contains the updated data.',
    pitfalls: [
      '`invalidateQueries` uses prefix matching — `[\'entries\']` will also invalidate `[\'entries\', \'by-category\', …]`. Be specific when you need to.',
    ],
    relatedSlugs: ['usemutation-basic', 'optimistic-update'],
    published: true,
    views: 2567,
    createdAt: '2024-04-04T00:00:00Z',
    updatedAt: '2024-04-04T00:00:00Z',
  },
  {
    id: 'e-rq-5',
    categoryId: 'cat-5',
    categorySlug: 'react-query',
    title: 'How to handle loading and error states',
    slug: 'loading-error-states',
    type: 'package',
    difficulty: 'beginner',
    tags: ['react-query', 'loading', 'error', 'UI states'],
    problem: 'You need to show skeleton UI while data loads and a clear error message if it fails.',
    solution: 'Destructure `isLoading`, `isError`, `error`, and `data` from `useQuery` and render conditionally.',
    code: `function EntryPage({ slug }: { slug: string }) {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['entry', slug],
    queryFn: () => fetch(\`/api/entries/\${slug}\`).then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-destructive">
        <p>Could not load entry.</p>
        <p className="text-sm opacity-70">{(error as Error).message}</p>
      </div>
    )
  }

  return (
    <article>
      {isFetching && <span className="text-xs text-muted-foreground">Refreshing…</span>}
      <h1>{data.title}</h1>
    </article>
  )
}`,
    codeLanguage: 'typescript',
    explanation: '`isLoading` is true only on the first load with no cached data. `isFetching` is true whenever a request is in-flight — including background refetches. Use `isLoading` for skeleton screens and `isFetching` for subtle indicators.',
    pitfalls: [
      '`isLoading` will stay `true` forever for disabled queries (when `enabled: false`). Check the `status` field for more precise control.',
    ],
    relatedSlugs: ['usequery-basic', 'usequery-params'],
    published: true,
    views: 3780,
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 'e-rq-6',
    categoryId: 'cat-5',
    categorySlug: 'react-query',
    title: 'How to do an optimistic update with useMutation',
    slug: 'optimistic-update',
    type: 'package',
    difficulty: 'advanced',
    tags: ['react-query', 'optimistic update', 'useMutation', 'UX'],
    problem: 'Your mutation feels slow because the UI waits for the server before updating. You want the UI to update instantly and roll back if it fails.',
    solution: 'Use `onMutate` to update the cache before the request, `onError` to roll back, and `onSettled` to sync with the server.',
    code: `const mutation = useMutation({
  mutationFn: (newTitle: string) =>
    fetch(\`/api/entries/\${id}\`, {
      method: 'PATCH',
      body: JSON.stringify({ title: newTitle }),
    }).then(r => r.json()),

  onMutate: async (newTitle) => {
    await queryClient.cancelQueries({ queryKey: ['entry', id] })
    const previous = queryClient.getQueryData(['entry', id])
    queryClient.setQueryData(['entry', id], (old: Entry) => ({ ...old, title: newTitle }))
    return { previous }
  },

  onError: (_err, _vars, context) => {
    queryClient.setQueryData(['entry', id], context?.previous)
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['entry', id] })
  },
})`,
    codeLanguage: 'typescript',
    explanation: '`onMutate` cancels in-flight queries (to prevent them from overwriting the optimistic update), snapshots current cache, and applies the optimistic change. The snapshot is returned as `context`. On error, `context.previous` restores the original data.',
    pitfalls: [
      'Always cancel in-flight queries in `onMutate` — without it, a pending refetch can overwrite your optimistic update.',
      '`onSettled` runs after both success and error — use it instead of duplicating invalidation in both handlers.',
    ],
    relatedSlugs: ['usemutation-basic', 'invalidate-refetch'],
    published: true,
    views: 2134,
    createdAt: '2024-04-06T00:00:00Z',
    updatedAt: '2024-04-06T00:00:00Z',
  },
]
