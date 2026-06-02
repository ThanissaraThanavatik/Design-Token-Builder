# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build locally
npm run storybook    # Launch Storybook on port 6006
```

No test runner beyond Storybook/Vitest stories — run `npm run storybook` to exercise component tests.

## Architecture

**Design Token Builder** is a browser-based design system manager. Teams define tokens (colors, typography, spacing, etc.) grouped into collections inside brands, then export them to CSS/Tailwind, JSON-DTCG, Markdown, Swift, or Kotlin.

### State layer (Zustand, `src/store/`)

Three stores with distinct roles:

- **`useBrandStore`** — persisted (`dtb-v3` localStorage, schema v8). Owns all brand/collection/token/icon data. Contains migration logic for schema upgrades. The source of truth.
- **`useTokenStore`** — in-memory, delegates persistence to brandStore. Manages active selection and all token CRUD. Holds undo/redo history (50-snapshot circular buffer).
- **`useUIStore`** — ephemeral UI state: active panel (`editor` | `graph` | `validation` | `preview` | `docs` | `icons`), theme, sidebar collapse, graph filters.
- **`useExportStore`** — selected formats + dialog open state.

The token store calls `getCollections()` to read brand data from brandStore and calls `updateBrandCollections()` to write back.

### Data model (`src/types/`)

```
Brand → Collection[] → Token[]
          ↓               ↓
      prefix, modes   cssVariable, type, values (keyed by TokenMode)
```

`TokenMode` is either a theme (`light` | `dark` | `default`) or a breakpoint (`xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl`). Collections declare which modes they support.

Token references use `var(--css-var-name)` syntax — `src/lib/dependency.ts` regex-parses these to build a dependency graph and detect circular references.

### Business logic (`src/lib/`)

| File | Purpose |
|------|---------|
| `dependency.ts` | Parse refs, build dependency map, detect cycles |
| `validation.ts` | Naming convention + dangling/circular ref checks |
| `color-generator.ts` | Hex → perceptual color scale (Material profile) |
| `css-export.ts` | CSS custom props + media queries |
| `json-export.ts` | DTCG format |
| `design-md-export.ts` | Markdown docs |
| `swift-export.ts` / `kotlin-export.ts` | Native platform constants |

### Components (`src/components/`)

- **`layout/`** — AppShell, TopBar, Sidebar (brand/collection nav), PanelTabs
- **`token-editor/`** — main editing surface: TokenEditor grid, TokenRow, TokenValueCell, ColorPickerPopover, ColorGeneratorDialog
- **`dependency-graph/`** — visual token reference graph via `@xyflow/react` + dagre layout
- **`validation/`** — ValidationPanel, surfaces issues from `src/lib/validation.ts`
- **`export/`** — ExportDialog: format selection and file download
- **`icons/`** — Lucide + Material Symbols browser, custom SVG uploader
- **`ui/`** — shadcn/ui primitives (40+ components, do not edit directly)

### Preset data (`src/data/`)

`brands.ts` defines `initialBrands` (default, 12victory, j-lek) with pre-wired collections. The `tw-*.ts` files are Tailwind scale presets; `device-specs.ts` and `platform-defaults.ts` define breakpoint/platform presets. These are static — they seed the store on first load.

### Storybook sync

`vite.config.ts` registers a dev-only `POST /api/storybook-sync` endpoint that writes `src/stories/brands-snapshot.json`. Storybook stories read this snapshot to render live brand data.

## Key conventions

- **CSS variables**: tokens map to `--prefix-name` (e.g., `--color-primary-600`). References use `var(--...)`.
- **UUIDs**: brands, collections, and tokens all use UUID-based IDs suffixed with brand slug.
- **Naming conventions**: per-collection — `kebab-case`, `slash-separated`, `numeric-scale`, `tw-utility`, or `free`. Enforced by validation.
- **shadcn/ui**: configured via `components.json`. Add components with `npx shadcn@latest add <component>`, never edit `src/components/ui/` manually.
- **Tailwind CSS 4**: uses `@tailwindcss/vite` plugin — no `tailwind.config.js`, all config is in CSS.
