# KiotBean — Agent Guide

## Stack
- **Backend**: ASP.NET Core (.NET 10), EF Core + Npgsql (PostgreSQL), Redis (StackExchange.Redis), MediatR, FluentValidation
- **Frontend**: Next.js 16 App Router, Tailwind v4, shadcn/ui (new-york style), next-intl, lucide-react, next-themes

## Commands

| Location | Command | Notes |
|----------|---------|-------|
| `backend/` | `dotnet build` | 0 warnings expected, NuGet vuln warnings are transitive |
| `frontend/` | `yarn build` | Full build + type check |
| `frontend/` | `yarn dev` | Dev server on port 3000 |

No tests, lint, or typecheck scripts exist.

## Backend Architecture

```
backend/KiotBean/
├── Controllers/          # ASP.NET Controllers, inject IMediator + validators
├── Database/             # AppDbContext + Entities (data annotations only)
├── Features/             # CQRS handlers + Models/, Validation/ subfolders per feature
└── Program.cs            # DI: EF Core, Redis, MediatR, FluentValidation, Controllers, CORS
```

- **Pattern**: Controller → MediatR handler → EF Core. No repository layer.
- **Validators**: in `Validation/` subfolder per feature (namespace `KiotBean.Features.{Feature}.Validation`).
- **Entities**: `CoffeePurchaseOrder`, `CashFlow`. Configured via `[Table]`, `[ForeignKey]` annotations.
- **Cash flow**: Created as `FlowType = "CHI"` inside the purchase order handler's ACID transaction.
- **Net weight formula**: `Gross - BagTare - (Gross * Impurity / 100) - (Moisture > 15 ? Gross * (Moisture - 15) / 100 : 0)`
- **Redis key**: `coffee:current-price`
- **CORS**: DEBUG = `AllowAnyOrigin()`, RELEASE = `WithOrigins("https://kiotbean.com")`
- **Infra**: PostgreSQL + Redis run locally (no docker-compose in repo). Default connection strings in `appsettings.json`. Frontend API URL in `frontend/.env` (override via `frontend/.env.local`).

## Frontend Architecture

```
frontend/
├── app/
│   ├── page.tsx          # / → redirect /dashboard
│   ├── layout.tsx        # Root layout (Geist font)
│   └── globals.css       # Tailwind v4 + shadcn + @theme
├── app/[locale]/         # Route pages under locale prefix (en/vi)
├── components/           # ui/ (shadcn primitives)
├── i18n/                 # next-intl: routing.ts, request.ts, messages/{en,vi}.json
├── lib/                  # api.ts, client.ts (axios), use-role.tsx, utils.ts
├── proxy.ts              # next-intl locale middleware
├── next.config.ts        # next-intl plugin + /api/* rewrite
├── postcss.config.mjs    # @tailwindcss/postcss
└── components.json       # shadcn config (new-york)
```

- **Routing**: `[locale]` segment with `as-needed` prefix. English (default) has no prefix: `/dashboard`, Vietnamese: `/vi/dashboard`.
- **Proxy**: `proxy.ts` handles locale detection. `next.config.ts` rewrites `/api/*` → `localhost:5000`.
- **i18n**: `useTranslations()` in client components, `getTranslations()` in server components. Keys in `i18n/messages/`.
- **Role switcher**: `lib/use-role.tsx` is a client-side Context for demo only. No real auth.
- **shadcn/ui**: Uses Radix primitives (new-york style). All components in `components/ui/` are from shadcn CLI — do not install `@base-ui/react` or any non-shadcn component libraries.
- **CSS**: `@import "tailwindcss"` (v4) + `@import "shadcn/tailwind.css"`. `tw-animate-css` is in package.json but NOT imported (Turbopack can't resolve it).

## API Endpoints

| Method | Path | Handler | Notes |
|--------|------|---------|-------|
| POST | `/api/purchase-orders` | `CreatePurchaseOrderHandler` | Creates order + CHI cashflow in transaction |
| GET | `/api/price` | `GetCurrentPriceHandler` | Returns 404 if no price set |
| POST | `/api/price` | `SetCurrentPriceHandler` | Superadmin only (enforced client-side) |

## Color Palette (CSS variables in `globals.css`)
- `--primary`: `#119da4` (dark_cyan) — buttons, links, active states
- `--sidebar`: `#13505b` (dark_teal) — sidebar bg
- `--accent`: `#0c7489` (cerulean) — hover states
- `--background`: `#f7f7f5` (dust_grey) — page bg
- `--muted` / `--border`: `#d7d9ce` (dust_grey) — borders, muted text
- `--foreground`: `#040404` (black)

## Conventions
- Namespace root: `KiotBean.*` (backend), `@/` alias → `frontend/` (frontend)
- Backend features: models in `Models/` subfolder (own namespace), handlers/validators in feature root
- No XML comments in code. No empty lines between imports and namespace.
- Vietnamese in i18n keys, not hardcoded. Use `t("key")` everywhere.
- C# property naming: PascalCase. JSON serialization uses camelCase.
- **Styling**: Tailwind v4 utility classes + CSS custom properties from `globals.css`. CSS lives in `globals.css` and no co-located `.css` files. No SCSS.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **KiotBean** (386 symbols, 796 relationships, 14 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "master"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/KiotBean/context` | Codebase overview, check index freshness |
| `gitnexus://repo/KiotBean/clusters` | All functional areas |
| `gitnexus://repo/KiotBean/processes` | All execution flows |
| `gitnexus://repo/KiotBean/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
