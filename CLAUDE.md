# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server on port 3001 (not the Next.js default 3000)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is no test suite configured in this repo.

## Architecture

This is a Next.js App Router storefront (Celoria — fashion/jewellery e-commerce) that talks to a separate backend API. There is no local database or API route handlers in this app — all data comes from `NEXT_PUBLIC_API_URL`.

### Data flow layers

- `src/services/*.ts` — plain `fetch`/data-loading functions called from Server Components (e.g. `services/products.ts`, `services/landing.ts`, `services/dashboard.ts`). These run on the server, use `next: { revalidate: 60 }` caching, and throw on non-OK responses (parsed via `lib/api-message.ts`).
- `src/actions/*.ts` — Server Actions (`"use server"`) used for mutations invoked from Client Components (cart add/remove, place order, product search). They never throw; they return a discriminated `{ success: true, ... } | { success: false, message }` result instead.
- `src/services/dashboard.ts` calls backend `/dashboard/*` endpoints using a server-only `x-api-key` header (`CELORIAS_API_KEY`) — never expose this key to the client.
- `src/services/api.ts` exports a bare `axios` instance; most code paths use `fetch` directly instead, so check which one a given file already uses before adding calls.

### Auth / cart identity

There's no traditional login flow yet. Cart/order requests are authenticated with either:
- a bearer access token from `localStorage` (`lib/auth.ts`, key `celoria-access-token`), or
- a generated, `localStorage`-persisted guest session id (`lib/session.ts`, key `celoria-session-id`, 7-day TTL)

`lib/auth.ts#getCartAuth()` picks whichever is available and both `actions/cart.ts` and `actions/orders.ts` send it as `Authorization: Bearer <token>` or `X-Session-Id` header. Both of these `lib` files are client-only (`typeof window === "undefined"` guards) — only call them from Client Components.

### State management

- Zustand for client state: `stores/cart.ts` (item count, no persistence — hydrated from API cart responses) and `stores/wishlist.ts` (persisted to `localStorage` via `zustand/middleware persist`), `stores/recentlyViewed.ts`.
- Server state/caching: `@tanstack/react-query` is a dependency but most pages currently fetch directly in Server Components rather than through React Query.

### Routing & pages

- `src/app/page.tsx` — landing page, fully server-rendered from `services/landing.ts` (merges live API data over `data/mock/landing.ts` fallback content — if a given API call fails, that section falls back to mock data rather than failing the whole page).
- `src/app/products/page.tsx` and `src/app/products/[categorySlug]/page.tsx` — shop listing, delegate to `components/shop/ShopPageView.tsx`; both are `force-dynamic` (query-param driven: sort, stone type/color, grid columns, search `q`).
- `src/app/product/[id]/page.tsx` — PDP, `force-dynamic`, fetches product + related products server-side; renders an inline error state (not `notFound()`) on fetch failure, but calls `notFound()` when the product genuinely doesn't exist.
- `next.config.ts` redirects legacy `/shop` and `/shop/:slug` paths to `/products` and `/products/:slug`.
- Query-param parsing/validation for the shop (sort, grid columns, search) is centralized in `lib/catalog.ts` — reuse its parsers rather than re-parsing `searchParams` inline.

### Layout composition

Most routes wrap content in `components/layout/SiteChrome.tsx` (announcement bar + header + footer, sourced from `data/mock/landing.ts` nav/footer content) rather than putting chrome in `app/layout.tsx`. `app/layout.tsx` itself only sets up fonts (Inter + Playfair Display, exposed as CSS vars `--font-inter`/`--font-playfair`) and mounts the global `AppToaster`.

### Styling

Tailwind v4 (CSS-first config, no `tailwind.config.js`) — theme tokens (`--color-rose`, `--color-gold`, `--color-cream`, etc.) are defined in `src/app/globals.css` via `@theme inline`. Use these semantic color tokens instead of raw Tailwind palette classes to stay consistent with the existing UI.

### Type source of truth

`src/types/api.ts` defines the shapes returned by the backend (products, cart, orders, testimonials, categories). Action files re-validate/narrow raw JSON manually (see `parseCart`/`parseOrder` in `actions/cart.ts`/`actions/orders.ts`) instead of trusting the API response blindly — follow this pattern for new actions rather than casting.
