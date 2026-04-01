# CLAUDE.md

This file describes project conventions and patterns for Claude Code to follow when working in this codebase.

## Context Window Management

When working on large multi-step tasks, monitor context usage. If the user asks how much context is left:
- **Less than 80% used** — continue the task directly
- **80% or more used** — write a continuation prompt to a file (e.g. `CONTINUATION_PROMPT.md`) at the repo root with full context about what was done and what remains, so the task can be resumed after compression without losing state

## Tech Stack

- **React 19** + **TypeScript 5**
- **Vite** (with SWC plugin for fast refresh)
- **TanStack Router** (file-based routing, auto-generates `routeTree.gen.ts`)
- **Zustand** for UI state management
- **TanStack Query** for server state (loading, caching, error handling)
- **Tailwind CSS v4** + **shadcn/ui** (New York variant) + **Radix UI**
- **Lucide React** for icons, **Sonner** for toasts
- **date-fns** for date manipulation, **recharts** for charts
- **React Hook Form** + **Zod** for forms and validation
- Native **Fetch API** (custom wrapper) as primary HTTP client

## File Naming Conventions

All files use kebab-case. Suffix indicates the role of the file:

| Role | Suffix | Example |
|---|---|---|
| Component | `.component.tsx` | `login.component.tsx` |
| Page | `.page.tsx` | `profile.page.tsx` |
| Hook | `.hooks.tsx` | `use-custom-toast.hooks.tsx` |
| Store | `.store.ts` | `auth.store.ts` |
| Types | `.types.ts` | `auth.types.ts` |
| Utils | `.utils.ts` / `.utils.tsx` | `form-validator.utils.ts` |

## Project Structure

```
src/
├── api/          # API client wrapper (apiRequest, ApiError)
├── components/
│   ├── ui/       # shadcn/ui primitives — do not edit manually
│   └── <domain>/ # Domain-specific components (chat/, nutrition/, etc.)
├── hooks/        # Custom React hooks
├── lib/          # Shared utilities (cn(), etc.)
├── pages/        # Page components (orchestrate layout + components)
├── routes/       # TanStack Router file-based routes
├── store/        # Zustand stores — UI state only, one per domain
├── types/        # Shared TypeScript interfaces/types
└── utils/        # Pure utility functions
```

## Component Patterns

- Use **named exports** for components: `export const MyComponent = () => { ... }`
- Use **default exports** for page components
- Props typed with `interface`: `interface MyComponentProps { ... }`
- Event handlers prefixed with `handle`: `handleSubmit`, `handleLogout`
- Use `cn()` from `@/lib/utils` for conditional className merging
- **No inline SVG components** — save SVG files to `src/assets/` and import them: `import icon from '@/assets/icon.svg'`
- **No meaningless comments** — do not add comments like `{/* Full Name */}` or `{/* Password */}` that just repeat the label. Only add comments when logic is non-obvious
- Use **`enum`** for string union types, not `type` unions: `enum AccountType { BUYER = 'buyer', BUSINESS = 'business' }` instead of `type AccountType = 'buyer' | 'business'`

```tsx
import { cn } from '@/lib/utils'

export const MyComponent = ({ className, isActive }: MyComponentProps) => {
  return (
    <div className={cn('base-classes', isActive && 'active-class', className)}>
      ...
    </div>
  )
}
```

## State Management

### Single Source of Truth

**TanStack Query is the single source of truth for all server data. Zustand is for client-only UI state.**

This is the most critical architectural rule. Violating it creates two sources of truth that can drift out of sync.

| Data type | Where it lives |
|---|---|
| API responses (user profile, orders, products…) | TanStack Query cache only |
| UI flags (modal open, active tab, sidebar…) | Zustand only |
| Auth tokens, loginType | Zustand (`auth.store`) + `localStorage` |

### Server state — TanStack Query

`queryFn` must be a **pure fetch** — no side effects, no Zustand calls inside:

```typescript
// ✅ Correct
export const useUserProfileQuery = () =>
  useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => getUserInfo(), // pure fetch, nothing else
  })

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.profile() }),
    // ✅ invalidate only — do NOT call setUser() here
  })
```

```typescript
// ❌ Wrong — duplicates server data into Zustand
queryFn: async () => {
  const data = await getUserInfo()
  useUserStore.getState().setUser(data) // ← SSOT violation
  return data
}
```

Components read from `useQuery()` directly:
```typescript
// ✅ Correct
const { data: user } = useUserProfileQuery()

// ❌ Wrong — reading duplicated stale copy
const { user } = useUserStore()
```

### Query key naming convention

All query key objects use **singular** form:

```typescript
export const userKeys = { ... }      // ✅
export const orderKeys = { ... }     // ✅
export const productKeys = { ... }   // ✅
export const usersKeys = { ... }     // ❌
export const ordersKeys = { ... }    // ❌
```

### UI state — Zustand

Use **Zustand** only for client-side UI state (modals, sidebar open/closed, theme, etc.) — not for server data.

```typescript
interface UiState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}))
```

### Isolated stores — no cross-store dependencies

Stores must not import other stores. Cross-store mutation is an architectural smell.

```typescript
// ❌ Wrong — auth.store importing and mutating other stores
import { useEstablishmentStore } from '@/store/establishment.store'
clearAuth: () => {
  useEstablishmentStore.getState().clearProfile() // tight coupling
}

// ✅ Correct — queryClient.clear() resets all server state at once
clearAuth: () => {
  localStorage.removeItem('token')
  set({ accessToken: null, loginType: null })
  queryClient.clear()
}
```

## Forms — React Hook Form + Zod

Use **React Hook Form** with **Zod** for all forms. Do not use the legacy `FormValidator` class for new code.

### Zod error API — use consistently

- Built-in validators (`.min`, `.max`, `.email`, `.positive`, etc.) use **`error:`**
- `.refine()` and `.superRefine()` use **`message:`**

```typescript
// ✅ Correct
const schema = z.object({
  email: z.email({ error: i18next.t(StringKey.VALID_EMAIL) }),
  name: z.string().min(2, { error: i18next.t(StringKey.ITEM_NAME_MIN) }),
}).refine(data => data.password === data.confirm, {
  message: i18next.t(StringKey.PASSWORDS_DO_NOT_MATCH), // ← message for refine
  path: ['confirm'],
})

// ❌ Wrong — callback in error is unnecessary for static strings
email: z.email({ error: () => i18next.t(StringKey.VALID_EMAIL) })
```

### Always derive types with `z.infer`

Never write form types manually — always derive from the schema:

```typescript
export const loginSchema = z.object({ ... })
export type LoginFormData = z.infer<typeof loginSchema> // ✅ always infer
```

### Form schema = only user input

Schemas must only contain fields the user actually edits. Do not include display-only or server-read-only data in a form schema — pass those as props instead.

```typescript
// ❌ Wrong — originalPrice comes from server, user doesn't type it
const publishSchema = z.object({
  originalPrice: z.number(), // read-only, should be a prop
  discountPrice: z.number(),
})

// ✅ Correct — schema only for editable fields
const publishSchema = z.object({
  discountPrice: z.number(),
})
// originalPrice passed as prop: interface PublishDialogProps { originalPrice: number }
```

### Validation file structure — domain-based

Validation schemas live in `src/utils/` grouped by **domain**, not by flow:

```
src/utils/
├── validations-auth/         # login, register, verify-email, forgot/reset-password
├── validations-user/         # user profile settings
└── validations-establishment/ # product, box, publish-menu, profile, brand-images
```

### Validation message keys — generic over entity-specific

Use generic keys when the message applies across multiple entities:

```typescript
// ✅ Generic — reusable for Product, Box, any named item
ITEM_NAME_MIN = 'ITEM_NAME_MIN'  // "Name must be at least 2 characters"

// ❌ Entity-specific — forces duplication
PRODUCT_NAME_MIN = 'PRODUCT_NAME_MIN'
BOX_NAME_MIN = 'BOX_NAME_MIN'
```

```typescript
export const loginSchema = z.object({
  email: z.email({ error: i18next.t(StringKey.VALID_EMAIL) }),
  password: z.string().min(8, { error: i18next.t(StringKey.PASSWORD_MIN) }),
})

type LoginFormData = z.infer<typeof loginSchema>
```

## API Client Pattern

All requests go through `apiRequest<T>()` from `@/api/client.ts`. **Never use raw `fetch()` in api files** — it bypasses `ApiError` and breaks consistent error handling across the app.

```typescript
// ✅ Correct
export const getNearbyEstablishments = (lon: number, lat: number, radius: number) =>
  apiRequest<NearbyEstablishmentsResponse>(
    `/establishments/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
  )

// ❌ Wrong — raw fetch bypasses ApiError
const response = await fetch(`${BASE_URL}/establishments/nearby?...`)
```

- Base URL comes from `import.meta.env.VITE_API_URL`
- Auth token stored in `localStorage` under key `'token'`; `apiRequest` attaches it automatically
- Auth header format: `Authorization: Bearer <token>`
- Custom `ApiError` class has `.status` and `.data` properties — use `instanceof ApiError` in `onError` handlers

### API layer completeness

Every API function must have a corresponding Query hook, and every mutation operation (create/update/delete) must be represented. If a function exists in `api/` without a hook in `queries/`, it is dead code — either add the hook or remove the function.

## Type Naming Conventions

- Request body types: `LoginRequest`, `RegisterRequest`
- Response types: `LoginResponse`, `UserResponse`
- Use `import type { ... }` for type-only imports

## Routing

- Routes are file-based in `src/routes/`
- `__root.tsx` handles auth guards via `beforeLoad`
- Do not edit `routeTree.gen.ts` — it is auto-generated by the Vite plugin
- Role-based access (user / trainer) is handled in route `beforeLoad` or page components

## Styling Rules

- Use **Tailwind CSS** utility classes; avoid custom CSS unless absolutely necessary
- Brand colors are registered in `@theme inline` in `index.css` — use them as direct Tailwind classes: `bg-brand-green`, `text-brand-cream`, NOT `bg-(--brand-green)` or `bg-[var(--brand-green)]`
- Always **verify color values match the actual design mockups** — do not guess or approximate colors
- Dark mode is applied via `.dark` class
- Use `cn()` for conditional and merged class names
- Components from `src/components/ui/` use **CVA** for variants — follow that pattern for new variants

## Design System — Buttons and Inputs

`<Button>` and `<FormInput>` are the **single source of truth** for all interactive elements. Never write raw `<button className="...">` or `<input className="...">` with hardcoded styles.

### Button — `@/components/ui/button`

Always use `<Button variant="..." size="...">`. Available variants:

| Variant | When to use |
|---|---|
| `brand` | Primary actions (submit, save, publish, create) |
| `brand-outline` | Secondary brand actions (new product, new box) |
| `outline` | Neutral secondary (cancel, back) |
| `destructive` | Confirm-delete dialogs |
| `danger-outline` | Danger zone buttons (delete account) |
| `outline-pill` | Card edit actions, disabled stubs |
| `ghost-circle` | Icon-only circular buttons (pause, resume, edit in cards, logout) |
| `ghost-circle-destructive` | Icon-only destructive circular buttons (deactivate) |

Available sizes: `auth` (full-width form submit), `dialog` (full-width in modals), `settings` (rounded-full with shadow), `pill` / `pill-sm` (card action pills), `icon-circle` (34px circle).

**Exceptions — keep as raw `<button>`:**
- Eye/EyeOff password toggles (absolute-positioned inside input wrapper — not a standalone action)
- Dropdown menu list items (e.g. delete inside MoreVertical dropdown)
- Tab switcher buttons with complex CVA-incompatible active state

### FormInput — `@/components/ui/form-input`

Always use `<FormInput variant="..." hasError={!!errors.field} {...register('field')} />`. Available variants:

| Variant | When to use |
|---|---|
| `default` | Dialogs and general forms (white bg, ring focus) |
| `auth` | Login / register pages (white bg, ring, error tint) |
| `settings` | Settings pages (cream bg, border focus, no ring) |

For **textareas**, reuse the same styling via:
```tsx
<textarea className={cn(formInputVariants({ variant: 'settings', hasError: !!errors.field }), 'resize-none')} />
```

**Never** create local `inputClass` / `fieldClass` helper functions — that is the anti-pattern this system replaces.

## Environment Variables

- Access via `import.meta.env.VITE_*`
- Cast to string when needed: `import.meta.env.VITE_API_URL as string`
- Development: `.env.development`, Production: `.env.production`

## Import Paths

Always use the `@/` alias (maps to `src/`):

```typescript
import { useUiStore } from '@/store/ui.store'
import type { LoginRequest } from '@/types/auth.types'
import { cn } from '@/lib/utils'
```

## Commit Convention

Follow this format: `<type>: <short description>`

Types:
- `feat:` — new functionality
- `fix:` — bug fixes
- `docs:` — documentation
- `refactor:` — refactoring
- `chore:` — minor changes
- `build:` — CI/CD and deploy changes

## What NOT to Do

- Do not edit files in `src/components/ui/` — shadcn/ui managed components (exception: `button.tsx` and `form-input.tsx` are project-extended and can receive new CVA variants)
- Do not edit `routeTree.gen.ts` — auto-generated
- Do not use Axios — the project uses native Fetch via `apiRequest`
- Do not hardcode colors — use CSS variables from the design system
- Do not use `bg-(--brand-green)` syntax — use `bg-brand-green` (colors registered in `@theme inline`)
- Do not create inline SVG components — save SVGs as files in `src/assets/` and import them
- Do not add comments that just restate what the code does — no `{/* Email */}` above an email input
- Do not use `type` unions where `enum` is appropriate — use `enum` for named string sets
- Do not manage `isLoading` / `error` manually in Zustand for server data — use TanStack Query
- Do not store server data in Zustand — Zustand is for UI/client state only; server data belongs in TanStack Query cache
- Do not call Zustand setters inside `queryFn` or mutation `onSuccess` — `invalidateQueries` is enough
- Do not import one Zustand store inside another — stores must be isolated; `queryClient.clear()` handles resetting all server state on logout
- Do not use `FormValidator` for new forms — use React Hook Form + Zod
- Do not create circular store dependencies — restructure stores instead of using dynamic `import()`
- Do not use raw `fetch()` in `src/api/` files — always use `apiRequest()` so errors are consistently thrown as `ApiError`
- Do not write entity-specific validation message keys (`PRODUCT_NAME_MIN`, `BOX_NAME_MIN`) when a generic key covers the same message (`ITEM_NAME_MIN`)
- Do not put display-only or server-read-only fields in Zod form schemas — form schemas describe only what the user edits
- Do not use `error: () => i18next.t(...)` callback syntax in Zod — use `error: i18next.t(...)` (static string) for built-in validators
- Do not add tests unless specifically requested — no testing framework is set up
- Do not write raw `<button className="...">` or `<input className="...">` — use `<Button>` and `<FormInput>` from `src/components/ui/`
- Do not create local `inputClass` / `fieldClass` helper functions — they duplicate what `FormInput` already handles

Remember to read eslint config before writing code.