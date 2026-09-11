# Celoria Frontend — Code Review Bug Report

Manual static review of `src/` (no automated test suite exists in this repo — no Jest/Vitest/Playwright config found). Findings are grouped by severity. File:line references point to the reviewed code.

---

## High severity

### 1. Stone Type / Stone Color filters do nothing
`ShopFilters` lets a user check "Stone Type" and "Stone Color" options, and the selections are round-tripped into the URL (`?stoneType=...&stoneColor=...`) by [ShopListing.tsx](src/components/shop/ShopListing.tsx) and parsed back out by [ShopPageView.tsx](src/components/shop/ShopPageView.tsx#L42-L43). However neither value is ever forwarded to [`fetchProducts`](src/services/products.ts#L31) (initial load) or [`loadProductsPage`](src/actions/products.ts#L11) (Load More) — both only accept `page`, `pageSize`, `sortBy`, `categorySlug`, `q`. Checking any stone filter changes the URL and the "(N)" active-filter badge, but the product grid never actually filters. This will read as broken/misleading to users.

**Fix**: either wire `stoneTypes`/`stoneColors` through to the API call (if the backend supports it) or remove the UI until it does.

### 2. Category filter UI is entirely commented out
In [ShopFilters.tsx:58-81](src/components/shop/ShopFilters.tsx#L58-L81), the whole "Category" filter section (and the `categories`/`onCategoryChange` props that feed it) is commented out. `categories` and `onCategoryChange` are destructured with a `//` prefix in the function signature, so the props are silently unused. Category browsing only works via direct category-slug URLs (`/products/[categorySlug]`) or the landing page's "Shop by Category" tiles — there is no way to switch category from the products listing itself.

### 3. Quantity decrease in the cart drawer is a remove-then-re-add, not atomic
[HeaderCart.tsx `handleDecrease`](src/components/cart/HeaderCart.tsx#L101-L128) implements "decrease quantity" as:
1. `removeCartItem` (deletes the line entirely)
2. `addCartItem` with `quantity - 1`

If the add call fails after the remove succeeds (network blip, stock changed, session expired), the item is now **gone from the cart** instead of merely decremented — `applyCart(removed.cart)` is called in the failure branch, which reflects the item having been deleted. There's also a `notifyFromResult(added)` bug: on the failure branch it calls `notifyFromResult(added)` (the failed add) which is correct, but on the success branch it also calls `notifyFromResult(added)` — meaning every successful decrease shows the generic "added" flow toast rather than nothing/quiet update, and any transient failure permanently drops the item instead of leaving quantity unchanged. A dedicated update/decrement endpoint (or an update quantity call) would avoid the destructive intermediate state.

### 4. Header "Account" and "Wishlist" icon buttons do nothing
In both [Header.tsx](src/components/landing/Header.tsx#L95-L108) (desktop) and [MobileNavDrawer.tsx](src/components/landing/MobileNavDrawer.tsx#L99-L106) (mobile), the "Account" and "Wishlist" buttons have `aria-label`s and icons but **no `onClick`, no `href`, and no route to navigate to** — there is no `/wishlist` or `/account` page anywhere in `src/app`. Clicking them is a complete no-op. Since `useWishlistStore` already persists wishlisted product IDs, there's a working data layer with no UI to view it — users can add to a wishlist but never see it again except via the heart icon toggle on each product card.

### 5. `setState` during render in `Header`
[Header.tsx:27-31](src/components/landing/Header.tsx#L27-L31):
```tsx
if (pathname !== menuPathname) {
  setMenuPathname(pathname);
  setIsMenuOpen(false);
  setIsSearchOpen(false);
}
```
This runs unconditionally on every render, directly in the component body (not inside `useEffect`). It's the documented React "adjusting state during render" pattern, which is only safe when it's the *only* state update in that render and doesn't cascade. Here it fires three `setState` calls together on every pathname change, which works today but is fragile: any future addition to this component (or a concurrent-mode re-render) risks extra render passes or inconsistent intermediate states. Should be moved into a `useEffect(() => { ... }, [pathname])`.

---

## Medium severity

### 6. Shipping fee shown to the user is never sent to the backend
[OrderSummary.tsx](src/components/orders/OrderSummary.tsx#L22) and the checkout form's "Shipping method" row ([CheckoutView.tsx:642-654](src/components/orders/CheckoutView.tsx#L642-L654)) both hardcode `SHIPPING_AMOUNT = 200` client-side and add it into the displayed total. But [`PlaceOrderPayload`](src/types/api.ts#L116-L130) has no shipping/total field at all — `placeOrder` only sends address + payment info, and the backend presumably computes its own total. If the backend's shipping logic ever differs (free shipping threshold, different rate, per-city rate), the confirmation total shown to the customer during checkout will not match what's actually charged/recorded, with no code path reconciling the two.

### 7. `ShopListing`'s "Load More" and filter links silently drop the search query when combined with category/stone filters
`buildListingHref` ([ShopListing.tsx:95-130](src/components/shop/ShopListing.tsx#L95-L130)) does correctly propagate `searchQuery` into filter/sort/grid link changes. However `handleLoadMore` ([ShopListing.tsx:142-169](src/components/shop/ShopListing.tsx#L142-L169)) calls `loadProductsPage` with the current `searchQuery`, `sortBy`, `categorySlug` — but since stone filters aren't threaded through (see #1), paginating while stone filters are "active" (per the UI) will load more products that ignore those filters too, compounding bug #1 rather than being an independent issue — flagged separately because it means Load More and initial load are at least *consistent* with each other, just consistently wrong.

### 8. Guest session id can silently change identity if `localStorage` is cleared mid-session
[`lib/session.ts`](src/lib/session.ts#L69-L86) generates a new random session id whenever `localStorage` doesn't have a valid one (missing, expired, or cleared by browser/privacy tooling). Because cart items are tied server-side to `X-Session-Id`, a user who clears site data, uses private browsing weirdness, or hits the 7-day TTL will silently get a **brand new empty cart** with no warning — `getCart` will just return an empty cart rather than any indication that "your previous cart expired." Not necessarily wrong behavior, but there's no user-facing messaging for it, so a returning guest customer's cart disappearing looks like a bug from the outside.

### 9. `notifyFromResult` in `HeaderCart.handleIncrease`/`handleDecrease` can toast twice in flight due to shared toast id collisions
[`lib/notify.ts`](src/lib/notify.ts#L9-L15) keys toasts by `id: `success:${message}`` / `id: `error:${message}``. This is good for de-duping identical messages, but it means two *different* actions that happen to produce the same success message (e.g. two rapid `addCartItem` calls both resolving with no `message` field, falling back to `options?.successMessage`) will collapse into one toast — acceptable — but if a user rapid-fires increase/decrease clicks, `pendingProductId` guards prevent overlap for the *same* button, but nothing prevents interleaved increase on item A and decrease on item B from producing overlapping `applyCart` calls that race and can leave `cart` state reflecting whichever network response returns last, not the last user action. Minor UX inconsistency under fast double-clicking across multiple line items.

### 10. `ShopPageView` category name fallback can show a stale/wrong name after a failed categories fetch
[ShopPageView.tsx:74-97](src/components/shop/ShopPageView.tsx#L74-L97): if `fetchDashboardCategories()` throws, the fallback rebuilds `categories` purely from the *current page's* product results (`items`). If that particular page of products happens to be empty (e.g., a valid category slug with 0 products, or the product fetch itself also failed), `categoryName` falls through to `formatCategoryLabel(categorySlug)`, which naively title-cases the slug (e.g. `mens-rings` → "Mens Rings" — no apostrophe handling, so "Men's Rings" can never be produced this way). This is a cosmetic-only concern but will visibly show an incorrect breadcrumb/category title whenever both API calls degrade at once.

### 11. `ProductTabs` "Reviews(N)" label has no space before the parenthesis
[ProductTabs.tsx:99](src/components/product/ProductTabs.tsx#L99): `` `Reviews(${reviewCount})` `` renders as "Reviews(3)" with no space, inconsistent with the other tab labels ("Product Description", "Additional Information"). Purely cosmetic but likely unintentional.

---

## Low severity / robustness notes

### 12. `parseCart`/`parseOrder` narrow but don't validate array item types beyond a shallow check
[actions/cart.ts `parseCartItem`](src/actions/cart.ts#L35-L60) checks `productId`/`productName`/`quantity` types but silently coerces missing/invalid `productSlug`, `productImage`, `unitPrice`, `lineTotal`, `availableStock` to defaults (`""`, `"0"`, `0`) rather than surfacing that the backend response was malformed. This is defensive-by-design (per the project's stated convention) but means a backend contract change could degrade silently (e.g., all cart items showing "Rs 0.00") instead of failing loudly in development.

### 13. `getAccessToken`/`getCartAuth` reference an access-token flow with no login UI
[lib/auth.ts](src/lib/auth.ts) reads `celoria-access-token` from `localStorage`, but no code path in `src/` ever *writes* that key — there is no login/signup form, no auth action, nothing that sets `celoria-access-token`. Today every user is effectively always a guest-session user; the bearer-token branch is unreachable dead code path (harmless, but worth knowing it's unfinished/future work rather than assuming auth exists).

### 14. Duplicate/near-duplicate price formatting utilities
There are three separate money formatters with different output formats: [`formatProductPrice`](src/lib/catalog.ts#L86-L95) (`"Rs 1,234"`, no decimals), [`formatCheckoutMoney`](src/lib/checkout.ts#L146-L156) (`"Rs.1,234.56"`, with decimals, no space after "Rs"), and an inline `formatCheckoutTotal`/`formatLinePrice` duplicated in [CartDrawer.tsx:19-29](src/components/cart/CartDrawer.tsx#L19-L29) and [CartLineItem.tsx:14-24](src/components/cart/CartLineItem.tsx#L14-L24) (`"Rs 1,234.56"` / `"Rs.1,234.56"`). The currency string is inconsistently "Rs", "Rs.", with or without a space, and with or without decimals across the cart drawer, product cards, and checkout — a real visual inconsistency a user could notice moving between pages ("Rs 4,500" on a product card vs. "Rs.4,500.00" in the cart for the same item).

### 15. `RecentlyViewed` scroller nav buttons don't disable/hide at scroll extremes
[RecentlyViewed.tsx `scrollByCard`](src/components/product/RecentlyViewed.tsx#L56-L76) wraps around (jumps back to start/end) rather than disabling the prev/next button at the boundary — this is a deliberate carousel-loop design choice, not necessarily a bug, but there's no visual affordance (e.g., dots, disabled state) indicating the wraparound is about to happen, which can feel like a jump/glitch to users.

### 16. `ProductGallery` thumbnail `alt=""` provides no accessible label
[ProductGallery.tsx:42](src/components/product/ProductGallery.tsx#L42): each thumbnail `<Image alt="" />` is empty while the surrounding button already has `aria-label` — acceptable per WCAG for redundant decorative images inside a labeled control, but worth confirming intentional since every other image in the app (`ProductCard`, `RecentlyViewed`, `QuickViewModal`) uses a real `alt={product.name}`.

### 17. `HeaderSearch` reads `window.location.search` in `useState` initializer without listening for external changes
[HeaderSearch.tsx:19](src/components/landing/HeaderSearch.tsx#L19): `useState(readSearchQuery)` seeds the input once on mount. If the user opens search, closes it, navigates via a different path to a `/products?q=...` URL, then reopens search — the input will still show whatever query was set the first time the component mounted in this session (or empty, if `HeaderSearch` unmounts/remounts each open, which it does since `Header` conditionally renders it — actually on remount `useState` reruns the initializer, so this self-corrects on each open/close cycle). Flagging only because it's easy to break if `HeaderSearch` is ever kept mounted (e.g., animated instead of conditionally rendered) in a future change.

---

## Summary table

| # | Severity | Area | Issue |
|---|----------|------|-------|
| 1 | High | Shop filters | Stone type/color filters don't affect results |
| 2 | High | Shop filters | Category filter section fully commented out |
| 3 | High | Cart | Decrease quantity = destructive remove+re-add, can lose item on partial failure |
| 4 | High | Header nav | Account/Wishlist buttons have no handler or route |
| 5 | High | Header | `setState` in render body instead of `useEffect` |
| 6 | Medium | Checkout | Displayed shipping fee never sent to/reconciled with backend |
| 7 | Medium | Shop listing | Load More inherits the stone-filter no-op from #1 |
| 8 | Medium | Cart/session | Guest cart silently resets if session id is lost, no messaging |
| 9 | Medium | Cart | Rapid multi-item qty changes can race and show stale cart state |
| 10 | Medium | Shop listing | Category name fallback can mis-title on double API failure |
| 11 | Medium | Product tabs | "Reviews(N)" missing space |
| 12 | Low | Data parsing | Malformed cart/order fields silently defaulted, not surfaced |
| 13 | Low | Auth | Access-token auth path is unreachable dead code (no login UI yet) |
| 14 | Low | Formatting | Inconsistent "Rs"/"Rs." currency formatting across cart/shop/checkout |
| 15 | Low | UX | Recently-viewed carousel wraps with no visual cue |
| 16 | Low | Accessibility | Gallery thumbnail alt text intentionally empty — confirm intent |
| 17 | Low | Search | Search input state depends on remount timing |

## Recommended next steps

1. Fix #1/#2 first — they're user-facing "broken feature" bugs (filters that visibly do nothing).
2. Fix #3 (cart decrement) — the only bug here with real data-loss potential.
3. Either wire up #4 (Account/Wishlist) or remove the buttons until those pages exist — dead UI erodes trust.
4. Since there's no test harness yet, consider adding a minimal Playwright/Vitest setup and covering the cart/checkout flow first, since that's the highest-risk (money-handling) path in the app.
