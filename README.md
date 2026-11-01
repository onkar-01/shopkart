# ShopKart - Product Listing & Detail Page

A small e-commerce listing app built on the public [DummyJSON products API](https://dummyjson.com/docs/products).

Built with React 18, React Router v6, Tailwind CSS and Vite. No UI component library, all the components here are hand rolled.

## Running it

```bash
npm install
npm run dev
```

That serves the app on http://localhost:5173.

To build:

```bash
npm run build     # output goes to dist/
npm run preview   # serve the built files
```

Node 18 or newer. There's nothing to configure, the API is public and needs no key.

## What it does

**Listing page (`/`)**

- Grid of product cards showing image, title, brand, price and a star rating
- Category filter, pulled from `/products/categories`
- Price range with Min / Max inputs and an Apply button
- Brand filter, multi select, built from the brands in the products that came back
- Search box in the header, debounced so it doesn't fire on every keystroke
- Pagination, 12 per page
- Loading skeletons while fetching, an error box with a retry button if the request fails, and a "nothing matched" state with a way to clear filters

**Detail page (`/product/:id`)**

- Main image plus thumbnails you can switch between
- Title, price (with the discounted price if there is one), rating, brand, category, stock, description and reviews
- A Back button that returns you to the listing with your filters still applied

**Filter behaviour**

All the filters work together. Changing any of them sends you back to page 1. Everything lives in the query string, so the page can be reloaded, bookmarked or shared and you get the same view back.

## How it's put together

**Filters live in the URL.** The whole filter state is `?q=&category=&min=&max=&brands=&page=`, parsed back out on every render in `src/lib/filters.js`. This is mostly why "filters stay applied when you go back" works at all, there's no context or store or sessionStorage involved, the URL is the state. Product links also carry the listing's query string along as `?from=...`, so the Back button still works if you open a detail URL cold in a new tab.

**Category and search go to the API, price and brand are done locally.** DummyJSON has no price or brand query params, so there isn't a choice there. The app pulls the full set for the current category or search with `limit=0`, then filters and paginates over that. Paginating on the server and filtering afterwards would leave pages with gaps in them, which is the main reason it's done this way.

**One hook owns the fetching.** `useAsync` in `src/hooks` returns `{ data, loading, error, reload }` and aborts the request in flight whenever its deps change, so a slow response can't come back late and overwrite a newer one. Both pages use it, which is why loading and error handling look the same in both places.

**The filter logic is plain functions.** `parseFilters`, `applyFilters`, `extractBrands` and `paginate` don't import React or touch fetch, they just take data and return data. Easy to test, and it keeps the components to rendering.

**Hash router.** `createHashRouter` means `npm run build` can be dropped onto any static host and deep links work without server side rewrite rules.

## Assumptions

- One category at a time. The API endpoint is `/products/category/{slug}`, so categories are radio buttons. Brands are multi select, which the brief allows.
- Brands are taken from the fetched products as the brief asks, so the list is scoped to whatever category or search you're in rather than being a global list. Some products (groceries, a few beauty items) have no brand field at all and won't show up under any brand.
- The price range includes both ends. If you type a min higher than the max it swaps them rather than returning nothing.
- Search and category stack. `/products/search` ignores the category param, so when both are set the category gets applied on our side instead of being quietly dropped.
- `limit=0` pulls the whole catalogue, which is about 194 products. Fine at this size, would not be fine at 100k.
- The cart and account icons in the header are decorative, the brief doesn't ask for them.

## What I'd do with more time

- **Tests.** The pure filter functions are the obvious first thing to cover with Vitest, then a React Testing Library test or two for the filter -> URL -> grid round trip.
- **Move pagination server side.** `limit=0` stops being reasonable on a real catalogue. Price and brand would have to move to the backend or a search index, and `src/api/products.js` is the seam where that swap would happen.
- **React Query or SWR** for caching and request dedupe. Right now coming back from a detail page refetches the list.
- **A proper mobile filter drawer.** The sidebar currently just stacks above the grid on small screens, which works but isn't great.
- **TypeScript.** Most of the surprises here came from the API response shape, `brand` being optional being exactly that kind of thing.
- Focus management when the page changes, and an `aria-live` region announcing the result count after a filter change.

## Folder layout

```
src/
  api/products.js          all the DummyJSON calls
  lib/filters.js           filter + pagination logic (pure functions)
  lib/format.js            price / date / slug formatting
  hooks/useAsync.js        fetch state + abort
  hooks/useDebouncedValue.js
  components/              Header, FilterSidebar, ProductCard, Pagination, Rating, loading + error states
  pages/                   ListingPage, ProductDetailPage, NotFound
  App.jsx                  layout shell
  main.jsx                 routes
```
# shopkart
