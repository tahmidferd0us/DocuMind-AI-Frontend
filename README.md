# DocuMind AI — Frontend

React modular monolith for the Smart NLP Platform (KOI). JavaScript, Vite, Tailwind CSS,
Redux Toolkit.

> Working on the code? Read [CLAUDE.md](CLAUDE.md) first — it holds the architecture rules,
> the feature recipe and the component catalogue.

## Requirements

- Node.js >= 20
- The backend running on `http://localhost:5000` (see `../documind-backend`)

## Setup

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Open <http://localhost:5173>.

The defaults in `.env.example` work as-is against a local backend — `/api` is proxied to
`http://localhost:5000` by Vite, so there is nothing to configure unless your backend runs
elsewhere (then change `VITE_API_PROXY_TARGET`).

Sign in with an account created through the backend's `/auth/register` endpoint.

## Scripts

| Command | Does |
| :--- | :--- |
| `npm run dev` | dev server on :5173 with API proxy |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve the built output |

## What exists

- **Home** (`/`) — navbar, hero, footer. Public.
- **Login** (`/login`) — email + password, client and server validation, toast feedback.
  Redirects away if you already have a session.
- **Dashboard** (`/dashboard`) — protected. Currently a working reference that exercises the shared
  components (uploader, paginated table, modal, inputs, toasts) against sample data. Replace its
  body when the documents module is built.

Everything is mobile and tablet friendly: the navbar collapses to a drawer below `md`, tables
scroll inside their own container rather than the page, modals become bottom sheets on phones.

## Reusable components

`import { Button, Table, Modal } from '@components/ui';`

Buttons (primary/danger/secondary/outline/ghost/link), Input (text/number/email/password),
NumberInput, Select, Textarea, FormField, Modal, ConfirmModal, Table (with **or** without
pagination), Pagination, FileUploader (drag-drop + validation), FileDownloader, Card, Badge,
Spinner, EmptyState. Toasts come from `useToast()`.

Full prop notes in [CLAUDE.md](CLAUDE.md) §6.

## Project structure

```
src/
├── app/store.js        store built from the feature registry
├── features/           registry.js + auth/ dashboard/ home/ toast/
├── components/ui/      reusable primitives
├── components/layout/  Navbar, Footer, layouts
├── routes/             router, guards, paths
├── lib/                api client, axios, storage, helpers
└── styles/index.css    Tailwind + design tokens
```

Adding a feature means creating one folder and adding one line to `src/features/registry.js` —
the store and the router both derive from it. See [CLAUDE.md](CLAUDE.md) §3.

## Configuration notes

- **Tailwind v4** is configured in CSS (`src/styles/index.css`, `@theme` block). There is no
  `tailwind.config.js` and adding one has no effect.
- **Vite 8 uses rolldown**, so chunking uses `output.codeSplitting`, not `manualChunks`.
- Only `VITE_`-prefixed env vars reach the browser, and they are **public**. Never put a secret in
  one — the service-role key and JWT secrets belong to the backend only.

## Claude Code skills

`.claude/skills/` ships with the `ui-ux-pro-max` design skills and the `motion` animation skill
(both MIT, ~11 MB vendored). 21st.dev is wired separately as an MCP server in `.mcp.json` and needs
a `TWENTY_FIRST_API_KEY`. Details in [CLAUDE.md](CLAUDE.md) §10.
