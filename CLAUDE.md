# DocuMind AI — Frontend Guidelines

React modular monolith. JavaScript (no TypeScript), Vite, Tailwind, Redux Toolkit.
Read this before writing code. It encodes decisions already made — do not re-litigate them.

---

## 1. Stack (pinned, verified working)

| Concern | Choice | Notes |
| :--- | :--- | :--- |
| Build | Vite 8 (rolldown) | not Rollup — chunking config differs, see §8 |
| UI | React 19, **function components only** | no class components anywhere |
| Styling | Tailwind v4 via `@tailwindcss/vite` | CSS-first config, **no `tailwind.config.js`** |
| State | Redux Toolkit 2 + RTK Query | RTK Query owns all server state |
| HTTP | axios + custom `axiosBaseQuery` | one client, refresh handled in an interceptor |
| Routing | React Router 7 data router | `createBrowserRouter` |
| Animation | `motion` (v13, ex-framer-motion) | import from `motion/react` |
| Icons | `lucide-react` | |

---

## 2. Directory layout

```
src/
├── main.jsx               entry
├── App.jsx                Provider + session bootstrap + router + toasts
├── app/store.js           store built FROM the feature registry
├── features/
│   ├── registry.js        FEATURE REGISTRY — reducers and routes both derive from this
│   ├── auth/  dashboard/  home/  toast/  tools/  upload/
├── components/
│   ├── ui/                reusable, feature-agnostic primitives (+ index.js barrel)
│   ├── illustrations/     shared inline SVGs used by home and tools
│   └── layout/            Navbar, Footer, PublicLayout, AuthLayout
├── routes/                AppRouter, guards, paths, 404, error page
├── lib/                   api, httpClient, axiosBaseQuery, storage, cn, format, constants
└── styles/index.css       Tailwind import + @theme tokens
```

**Import direction is one-way:** `features/` → `components/` → `lib/`.
A file in `components/ui/` must never import from `features/`. If a "reusable" component needs
feature state, it is not reusable — keep it in the feature.

Path aliases (`vite.config.js` + `jsconfig.json`, keep them in sync):
`@`, `@app`, `@components`, `@features`, `@lib`, `@routes`.

---

## 3. Adding a feature — the only correct way

```
src/features/documents/
├── index.js                 export default { name, reducer?, routes }
├── documentsApi.js          api.injectEndpoints({...})
├── documentsSlice.js        client-only state (optional)
├── pages/DocumentsPage.jsx
└── components/              feature-local components
```

`index.js`:

```js
import { PATHS } from '@routes/paths';
import documentsReducer from './documentsSlice';
import DocumentsPage from './pages/DocumentsPage';

export default {
  name: 'documents',
  reducer: documentsReducer,
  routes: [{ path: PATHS.documents, Component: DocumentsPage, layout: 'protected' }],
};
```

Then add it to the array in `src/features/registry.js` — **one line**. The store picks up the
reducer and the router picks up the route automatically. Never edit `store.js` or `AppRouter.jsx`
to add a feature.

`layout` is one of:
- `public` — navbar + footer, open to everyone
- `protected` — same chrome, requires a session (`ProtectedRoute`, optional `roles`)
- `guest` — centred auth chrome, redirects away if already signed in (`GuestRoute`)

Route objects use `Component:` (not `element:`) so registry files stay plain `.js` with no JSX.

---

## 4. Redux Toolkit — how it is wired

**One RTK Query API instance** (`lib/api.js`). Features never call `createApi`; they call
`api.injectEndpoints`. This keeps one cache, one middleware, one set of tags.

```js
export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listDocuments: builder.query({
      query: (params) => ({ url: '/documents', params }),
      transformResponse: (response) => response.data,
      providesTags: ['Document'],
    }),
    uploadDocument: builder.mutation({
      query: (formData) => ({ url: '/documents', method: 'POST', data: formData }),
      invalidatesTags: ['Document'],
    }),
  }),
});
```

Note it is **`data:`, not `body:`** — the base query is axios, not `fetch`. Tags are declared up
front in `lib/api.js` (`Auth`, `Document`, `Summary`, `Conversation`); add new ones there.

**Server state belongs to RTK Query. Slices are for client state only** — `authSlice` (current
user + token) and `toastSlice`. Do not mirror fetched lists into a slice.

`authSlice` derives its state from RTK Query lifecycle matchers
(`authApi.endpoints.login.matchFulfilled`, …) rather than manual dispatches, so there is exactly
one place credentials are set or cleared.

---

## 5. Auth flow

- Access token → `localStorage` (`documind.accessToken`), attached as `Authorization: Bearer` by a
  request interceptor.
- Refresh token → httpOnly cookie, invisible to JS, sent automatically (`withCredentials: true`).
- On **401**, the response interceptor calls `/auth/refresh` once, then replays the original
  request. Concurrent 401s share a single in-flight refresh promise. `/auth/login`, `/register`,
  `/refresh` and `/logout` are excluded, so a wrong password does not trigger a refresh attempt.
- If refresh fails, `setSessionExpiredHandler` fires and the store clears credentials.

**`documind.hasSession` flag.** The cookie is httpOnly, so the app cannot tell whether a session
might exist. This flag records "this browser has logged in before" so a first-time visitor does not
fire a pointless `/auth/me` → 401 → `/auth/refresh` → 401 pair on every page load. Set on login,
cleared on logout/expiry. Keep it in sync if you touch `authSlice`.

`useSessionBootstrap()` runs once in `App.jsx`; guards wait on `isBootstrapped` before deciding to
redirect, which is what stops a flash of the login page on reload.

**Known trade-off:** `localStorage` for the access token is XSS-readable. It was chosen for
simplicity and short (15 min) token life. An in-memory token is stricter if this ever goes public.

---

## 6. Reusable components (`components/ui/`)

Import from the barrel: `import { Button, Table, Modal } from '@components/ui';`

| Component | Notes |
| :--- | :--- |
| `Button` | `variant`: primary \| danger \| secondary \| outline \| ghost \| link; `isLoading` also disables |
| `IconButton` | `label` is required — it becomes `aria-label` |
| `Input` | text/email/number/password; password gets a reveal toggle free |
| `NumberInput` | controlled: `value` + `onChange(number)`, with clamped steppers |
| `Select` | `options={[{ value, label, disabled? }]}` |
| `Textarea`, `FormField` | `FormField` owns the label/hint/error row — reuse it for new inputs |
| `Modal` | portal, focus trap, Escape, scroll lock, backdrop click |
| `ConfirmModal` | destructive-action wrapper over `Modal` |
| `Table` | pass `pagination={{...}}` for a paginated table, **omit it for a plain one** |
| `Pagination` | standalone; collapses to `page / total` on mobile |
| `FileUploader` | drag-drop, extension + size validation, `progress` prop |
| `FileDownloader` | button; `useFileDownload()` hook for custom triggers |
| `Card`/`CardHeader`/`CardBody`, `Badge`, `Spinner`, `EmptyState` | |

Every input takes `label`, `hint`, `error`, `required` and wires `aria-invalid` / `aria-describedby`
itself. Server field errors map straight on:

```js
const fieldErrors = Object.fromEntries((result.error.details ?? []).map((d) => [d.field, d.message]));
```

**Tool pages are generated, not hand-written.** `src/lib/tools.js` is the single source of truth:
each entry carries its `path`, copy, `benefits`, `points`, `illustration` key and a `ready` flag.
From that one array come the navbar dropdown, the navbar links, the footer list, the homepage
`ToolGrid`, and **one real route per tool** (`/summarize`, `/ask`, `/entities`, `/export`,
`/upload`, `/analytics`).

`features/tools/index.js` maps `TOOLS` into route objects via `createToolPage(key)`, so every tool
renders through the same `ToolPage` component. To add a tool: add one entry to `TOOLS` and a path to
`PATHS`. Do not create a page component per tool, and do not hand-write nav links anywhere.

`ready: false` puts a "Soon" badge in the nav and an amber "Not built yet" banner on the page — the
page still exists and still accepts an upload. When a module ships, flip the flag.

**Upload is split across two layers on purpose.** `components/ui/UploadDropzone.jsx` is purely
presentational (takes `onFiles`, no feature imports, so the one-way import rule holds), and
`features/upload/useDocumentIntake.js` owns the auth-aware behaviour — validate, then route to login
or the workspace. Hero and every tool page use both. Put upload behaviour in the hook, never in the
component.

**Toasts** are Redux-driven — never render one locally:

```js
const toast = useToast();
toast.success('Saved'); toast.error(message); toast.info(...); toast.warning(...);
```

`DashboardPage` is currently a live reference exercising most of these against sample data.
Replace its contents when the real documents module lands; keep it as the post-login destination.

---

## 7. Styling

Tailwind v4 is configured **in CSS**, in `src/styles/index.css`. There is no `tailwind.config.js`
and adding one will not be read. Add design tokens to the `@theme` block:

```css
@theme {
  --color-brand-500: oklch(0.61 0.19 285);
  --radius-card: 1rem;
}
```

`--color-brand-*` generates `bg-brand-500`, `text-brand-600`, … automatically. Also defined:
`surface`, `surface-muted`, `line`, and the `.container-page` utility. Use `cn()` from `@lib/cn`
(clsx + tailwind-merge) whenever class names are conditional.

**Source scanning is scoped on purpose.** The CSS opens with
`@import 'tailwindcss' source(none);` followed by explicit `@source` lines for `index.html` and
`src/**/*.{js,jsx}`. Tailwind v4 otherwise auto-scans the whole project and picks up the `.tsx`
templates inside `.claude/skills/`, which doubled the production CSS (29 kB → 62 kB) with classes
the app never uses. If you add source files outside `src/`, add an `@source` line for them —
do not remove `source(none)`.

**Responsive is mandatory and verified.** Mobile-first; `sm:` 640, `md:` 768, `lg:` 1024.
Rules that are already holding and must keep holding:
- the page never scrolls horizontally — wide content scrolls inside its own `overflow-x-auto` box
  (this is why `Table` has `min-w-[640px]` inside a scroller)
- interactive targets are >= 44px tall on mobile (`Button` md = 44px, lg = 48px)
- the navbar collapses to a drawer below `md`
- modals are bottom-sheets on mobile, centred from `sm:` up

A `prefers-reduced-motion` block in `index.css` neutralises transitions globally.

---

## 8. Build and env

```bash
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

**Dev talks to the backend through the Vite proxy.** `VITE_API_BASE_URL=/api/v1` and the proxy
forwards `/api` → `VITE_API_PROXY_TARGET` (default `http://localhost:5000`). Everything is
same-origin in dev, so cookies and CORS are non-issues. For a deployed build, set
`VITE_API_BASE_URL` to the full backend URL — the backend's `CORS_ORIGINS` must then list the
frontend origin, and its cookie settings switch to `SameSite=none; Secure` in production.

Only `VITE_`-prefixed vars reach the client, and **anything in them is public**. No secrets.

Vite 8 runs **rolldown**, so `build.rollupOptions.output.manualChunks` throws
(`manualChunks is not a function`). Use `output.codeSplitting.groups` — already configured to split
`react`, `redux` and `motion` vendor chunks. `advancedChunks` is the deprecated spelling.

---

## 9. Animation

`motion` is installed and used in `Hero`, `Navbar` (drawer), `Modal` and `ToastViewport`.

`AnimatePresence` children must be **`motion` components with a stable `key`** — a plain `<div>`
child will not animate out. Keep exit transitions short (0.15–0.2s).

Note: exit animations depend on `requestAnimationFrame`. In a hidden/background tab rAF is paused,
so an exiting element stays mounted until the tab is visible again. That is normal motion
behaviour, not a bug — do not add workarounds for it.

---

## 10. Installed skills

`.claude/skills/` contains (MIT, vendored — ~11 MB, safe to trim or gitignore):

- **`ui-ux-pro-max`** + `design`, `design-system`, `ui-styling`, `brand`, `banner-design`, `slides`
  — from `nextlevelbuilder/ui-ux-pro-max-skill`. Searchable local database of styles, palettes,
  font pairings and chart patterns. Use before inventing colours or typography.
- **`motion`** — from `secondsky/claude-skills`. Motion patterns, performance and accessibility
  references.

**21st.dev is not a skill** — it is a component registry. It is wired instead as an MCP server in
`.mcp.json` (`@21st-dev/magic`), which needs an API key from <https://21st.dev>:
set `TWENTY_FIRST_API_KEY` in your environment, then approve the server when Claude Code prompts.
Without the key the server simply will not start; nothing else breaks. Components pulled from
21st.dev are usually TypeScript + shadcn/ui — **convert to JavaScript and to the primitives in
`components/ui/` before committing.** Do not introduce shadcn or TypeScript into this codebase.

---

## 11. Style rules

- Function components only. Error boundaries use the router's `errorElement` (`routes/ErrorPage.jsx`)
  precisely so no class component is needed.
- No comments unless the *why* is non-obvious. Prefer one line where one line reads clearly.
- Default export the component, named export the hooks/helpers beside it.
- Anything used by two features moves to `components/ui/` and gets added to the barrel.
