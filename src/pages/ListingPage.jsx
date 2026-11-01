import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSidebar from '../components/FilterSidebar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductCardSkeleton from '../components/ProductCardSkeleton.jsx'
import Pagination from '../components/Pagination.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import useAsync from '../hooks/useAsync.js'
import { getCategories, getProducts } from '../api/products.js'
import {
  PAGE_SIZE,
  applyFilters,
  extractBrands,
  filterByCategory,
  hasActiveFilters,
  paginate,
  parseFilters,
  serializeFilters,
} from '../lib/filters.js'

export default function ListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  const categoriesState = useAsync((signal) => getCategories({ signal }), [])

  const productsState = useAsync(
    (signal) => getProducts({ category: filters.category, search: filters.search }, { signal }),
    [filters.category, filters.search]
  )

  const allProducts = productsState.data || []
  const scoped = useMemo(
    () => filterByCategory(allProducts, filters.category),
    [allProducts, filters.category]
  )

  const brands = useMemo(() => extractBrands(scoped), [scoped])

  const filtered = useMemo(() => applyFilters(scoped, filters), [scoped, filters])
  const { items, totalPages, page } = paginate(filtered, filters.page, PAGE_SIZE)

  const updateFilters = useCallback(
    (patch) => {
      const next = { ...filters, ...patch, page: patch.page || 1 }
      setSearchParams(serializeFilters(next), { replace: !patch.page })
    },
    [filters, setSearchParams]
  )

  const resetFilters = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  function goToPage(nextPage) {
    updateFilters({ page: nextPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <FilterSidebar
        categories={categoriesState.data || []}
        categoriesLoading={categoriesState.loading}
        categoriesError={categoriesState.error}
        onRetryCategories={categoriesState.reload}
        brands={brands}
        brandsLoading={productsState.loading}
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <section className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-900">
            {filters.search ? `Results for "${filters.search}"` : 'All Products'}
          </h1>

          {!productsState.loading && !productsState.error && (
            <p className="text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              {totalPages > 1 && ` · page ${page} of ${totalPages}`}
            </p>
          )}
        </div>

        {productsState.loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : productsState.error ? (
          <ErrorState message={productsState.error} onRetry={productsState.reload} />
        ) : items.length === 0 ? (
          <EmptyState onReset={hasActiveFilters(filters) ? resetFilters : undefined} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={{
                    pathname: `/product/${product.id}`,
                    search: `?from=${encodeURIComponent(searchParams.toString())}`,
                  }}
                />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
          </>
        )}
      </section>
    </div>
  )
}
