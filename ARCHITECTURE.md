# KiotBean — Architecture

## Overview

KiotBean is a web application for coffee purchase order management. It follows a **vertical slice architecture** with CQRS on the backend and Next.js App Router on the frontend.

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                  │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Dashboard  │  │  Orders  │  │  Price / Cashflow    │  │
│  │  Pages      │  │  Pages   │  │  Pages               │  │
│  └─────┬───────┘  └────┬─────┘  └──────────┬───────────┘  │
│        │               │                   │              │
│  ┌─────┴───────────────┴───────────────────┴───────────┐  │
│  │              next-intl i18n middleware               │  │
│  │              proxy.ts (locale detection)             │  │
│  └─────────────────────┬───────────────────────────────┘  │
│                        │                                  │
│  ┌─────────────────────┴───────────────────────────────┐  │
│  │              lib/api.ts (axios client)               │  │
│  │              Rewrites: /api/* → localhost:5000      │  │
│  └─────────────────────┬───────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────┘
                         │ HTTP
┌────────────────────────┼──────────────────────────────────┐
│              Backend (ASP.NET Core 10)                    │
│  ┌─────────────────────┴───────────────────────────────┐  │
│  │  Controllers      PurchaseOrdersController          │  │
│  │                   PricesController                  │  │
│  └─────────────────────┬───────────────────────────────┘  │
│                        │ MediatR                          │
│  ┌─────────────────────┴───────────────────────────────┐  │
│  │  Features (CQRS)   CreatePurchaseOrder              │  │
│  │                   GetCurrentPrice / SetCurrentPrice │  │
│  └──┬──────────────────────┬──────────────────────────┘  │
│     │                      │                             │
│  ┌──┴────────────┐  ┌─────┴────────────┐                │
│  │  EF Core      │  │  Redis           │                │
│  │  PostgreSQL   │  │  (StackExchange) │                │
│  └───────────────┘  └──────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

## Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | ASP.NET Core (.NET 10), EF Core + Npgsql (PostgreSQL), Redis (StackExchange.Redis), MediatR, FluentValidation |
| **Frontend** | Next.js 16 App Router, Tailwind v4, shadcn/ui (new-york), next-intl, lucide-react |
| **Infrastructure** | PostgreSQL 16, Redis 7 (local dev, no Docker Compose) |

## Backend

### Directory Structure

```
backend/KiotBean/
├── Controllers/
│   ├── PurchaseOrdersController.cs    POST /api/purchase-orders
│   └── PricesController.cs            GET|POST /api/price
├── Database/
│   ├── AppDbContext.cs
│   └── Entities/
│       ├── CoffeePurchaseOrder.cs     [Table("CoffeePurchaseOrders")]
│       └── CashFlow.cs                [Table("CashFlows")]
├── Features/
│   ├── PurchaseOrders/
│   │   ├── CreatePurchaseOrder.cs     Handler + Validator
│   │   └── Models/
│   │       ├── CreatePurchaseOrderCommand.cs
│   │       └── CreatePurchaseOrderResult.cs
│   └── Prices/
│       ├── GetCurrentPrice.cs         Handler
│       ├── SetCurrentPrice.cs         Handler
│       └── Models/
│           ├── GetCurrentPriceQuery.cs
│           ├── GetCurrentPriceResult.cs
│           ├── SetCurrentPriceCommand.cs
│           └── SetCurrentPriceResult.cs
├── Migrations/
│   └── 20260704060903_Initial.cs
├── Program.cs                         DI + CORS + Middleware
├── appsettings.json
└── appsettings.Development.json
```

### Pattern: Controller → MediatR Handler → EF Core

No repository layer. Controllers inject `IMediator` and validators, then dispatch commands/queries to handlers that interact directly with `AppDbContext`.

### Entities

| Entity | Table | Key Fields |
|--------|-------|------------|
| `CoffeePurchaseOrder` | `CoffeePurchaseOrders` | Id, TotalBags, GrossWeight, BagTareWeight, Moisture, ImpurityRate, NetWeight, UnitPrice, TotalAmount, CashFlowId (FK→CashFlow) |
| `CashFlow` | `CashFlows` | Id, FlowType="CHI", Amount, PaymentMethod, Category="Mua cà phê", Note?, CreatedAt |

**Net weight formula:** `Gross - BagTare - (Gross × Impurity / 100) - (Moisture > 15 ? Gross × (Moisture - 15) / 100 : 0)`

### Cash Flow Integration

Creating a purchase order atomically creates a CashFlow record (FlowType=`"CHI"`, Category=`"Mua cà phê"`) inside an ACID transaction, then sets `CashFlowId` back on the order. PaymentMethod is passed from the request, not hardcoded.

### Redis

Used for the `coffee:current-price` key. `GetCurrentPriceHandler` reads from Redis (returns 404 if absent), `SetCurrentPriceHandler` writes to Redis.

### CORS

| Environment | Policy |
|-------------|--------|
| DEBUG | `AllowAnyOrigin()` |
| RELEASE | `WithOrigins("https://kiotbean.com")` |

### DI Setup (Program.cs)

```
EF Core (Npgsql) + Redis (ConnectionMultiplexer) + MediatR + FluentValidation + Controllers (camelCase JSON) + CORS
```

## Frontend

### Directory Structure

```
frontend/
├── app/
│   ├── page.tsx                        / → redirect /dashboard
│   ├── layout.tsx                      Root layout (Geist font)
│   └── globals.css                     Tailwind v4 + shadcn + @theme
├── app/[locale]/
│   ├── layout.tsx                      i18n provider (next-intl)
│   ├── page.tsx                        / → redirect ./dashboard
│   └── dashboard/
│       ├── layout.tsx                  RoleProvider + Sidebar + Shell
│       ├── page.tsx                    Dashboard home (stat cards)
│       ├── _components/
│       │   ├── shell.tsx               Sidebar layout shell
│       │   ├── locale-switcher.tsx     en/vi toggle
│       │   ├── role-switcher.tsx       superadmin/user demo toggle
│       │   ├── orders-table.tsx        Orders data table
│       │   └── recent-orders.tsx       Dashboard recent orders card
│       ├── orders/
│       │   ├── page.tsx                Orders list
│       │   ├── [id]/page.tsx           Order detail
│       │   └── create/page.tsx         Create order form
│       ├── cashflow/page.tsx           Cashbook
│       ├── price/page.tsx              Coffee price management
│       └── users/page.tsx              Users list (placeholder)
├── components/
│   └── ui/                            20 shadcn primitives (new-york)
├── i18n/
│   ├── routing.ts                      en/vi, as-needed prefix
│   ├── request.ts                      Locale resolution
│   └── messages/
│       ├── en.json
│       └── vi.json
├── lib/
│   ├── api.ts                          API client functions
│   ├── client.ts                       Axios instance + error interceptor
│   ├── use-role.tsx                    Demo role context (superadmin/user)
│   └── utils.ts                        cn() helper
├── proxy.ts                            next-intl middleware
├── next.config.ts                      next-intl + /api/* rewrite
├── postcss.config.mjs                  @tailwindcss/postcss
└── components.json                     shadcn config (new-york)
```

### Routing

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `app/page.tsx` | Redirects to `/dashboard` |
| `/dashboard` | `app/[locale]/dashboard/page.tsx` | English (no prefix) |
| `/vi/dashboard` | same | Vietnamese (prefix) |
| `/dashboard/orders` | Orders list | |
| `/dashboard/orders/create` | Create order form | |
| `/dashboard/orders/[id]` | Order detail | |
| `/dashboard/cashflow` | Cashbook | |
| `/dashboard/price` | Price management | |
| `/dashboard/users` | Users (placeholder) | |

Locale prefix strategy: `as-needed` — English has no prefix, Vietnamese uses `/vi/`.

### Styling

- **Tailwind v4** with `@tailwindcss/postcss` plugin for `@theme` processing
- **shadcn/ui** (new-york style) with Radix primitives
- **CSS custom properties** in `globals.css` with light/dark `.dark` class support
- **No SCSS** — all CSS in `globals.css` (no co-located `.css` files currently)
- **`cn()` utility** via `clsx` + `tailwind-merge`

### API Client

`lib/client.ts` creates an Axios instance with JSON content-type and a response error interceptor. `lib/api.ts` wraps it with typed functions:

- `getPrice()` → `GET /api/price`
- `setPrice(price)` → `POST /api/price`
- `createPurchaseOrder(data)` → `POST /api/purchase-orders`

Next.js rewrites `/api/*` → `http://localhost:5000/api/*` in `next.config.ts`.

### i18n

next-intl with two locales (`en`, `vi`), `as-needed` prefix, and locale detection via `proxy.ts` middleware. Keys in `i18n/messages/{en,vi}.json`.

### Role Switcher

Client-side demo-only context (`lib/use-role.tsx`) with two roles: `"user"` and `"superadmin"`. No real authentication.

## API Endpoints

| Method | Path | Handler | Request | Response |
|--------|------|---------|---------|----------|
| POST | `/api/purchase-orders` | `CreatePurchaseOrderHandler` | `{ totalBags, grossWeight, bagTareWeight, moisture, impurityRate, unitPrice, paymentMethod }` | `{ id, netWeight, totalAmount, cashFlowId }` |
| GET | `/api/price` | `GetCurrentPriceHandler` | — | `{ price }` or 404 |
| POST | `/api/price` | `SetCurrentPriceHandler` | `{ price }` | `{ price }` |

## Execution Flows

### 1. Create Purchase Order
```
[Form] → api.ts:createPurchaseOrder()
  → POST /api/purchase-orders
    → PurchaseOrdersController.Create(CreatePurchaseOrderCommand)
      → FluentValidation (TotalBags>0, GrossWeight>0, UnitPrice>0, Moisture 0-100, Impurity 0-100)
      → CreatePurchaseOrderHandler
        → BEGIN transaction
          → Compute net weight
          → Compute total amount (netWeight × unitPrice)
          → INSERT CashFlow (FlowType="CHI", PaymentMethod=req.PaymentMethod, Category="Mua cà phê")
          → INSERT CoffeePurchaseOrder (with CashFlowId)
          → SET CashFlowId on order
        → COMMIT
      → 201 Created
```

### 2. Get Current Price
```
[dashboard / price page]
  → api.ts:getPrice()
  → GET /api/price
    → PricesController.Get()
      → GetCurrentPriceHandler
        → Redis GET "coffee:current-price"
        → Found? → 200 { price }
        → Not found? → 404
```

### 3. Set Current Price
```
[price page (superadmin)]
  → api.ts:setPrice(price)
  → POST /api/price
    → PricesController.Set(SetCurrentPriceCommand)
      → SetCurrentPriceHandler
        → Redis SET "coffee:current-price"
      → 200 { price }
```

## Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#119da4` (dark_cyan) | Buttons, links, active states |
| `--sidebar` | `#13505b` (dark_teal) | Sidebar background |
| `--accent` | `#0c7489` (cerulean) | Hover states |
| `--background` | `#f7f7f5` (dust_grey) | Page background |
| `--muted` / `--border` | `#d7d9ce` (dust_grey) | Borders, muted text |
| `--foreground` | `#040404` (black) | Text color |
| `--radius` | `0.625rem` | Border radius (shadcn new-york) |

## Conventions

- Backend namespace root: `KiotBean.*`
- Frontend `@/` alias → `frontend/`
- Backend features: models in `Models/` subfolder (own namespace), handlers + validators in feature root
- No repository layer — handlers use `AppDbContext` directly
- C# PascalCase → camelCase JSON serialization
- No XML comments, no empty lines between imports and namespace
- Vietnamese text in i18n keys only (`t("key")`)
- shadcn components in `components/ui/`, page-specific components in `app/[locale]/.../_components/`
