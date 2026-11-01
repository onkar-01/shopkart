import { useEffect, useMemo, useState } from 'react'
import { titleCase } from '../lib/format.js'

function Section({ title, children }) {
  return (
    <div className="border-t border-gray-200 px-4 py-4 first:border-t-0">
      <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  )
}

function CheckRow({ type, name, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-700 hover:text-gray-900">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="truncate">{children}</span>
    </label>
  )
}

export default function FilterSidebar({
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  brands,
  brandsLoading,
  filters,
  onChange,
  onReset,
}) {
  const [minPrice, setMinPrice] = useState(filters.minPrice)
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice)
  const [brandQuery, setBrandQuery] = useState('')

  useEffect(() => {
    setMinPrice(filters.minPrice)
    setMaxPrice(filters.maxPrice)
  }, [filters.minPrice, filters.maxPrice])

  const visibleBrands = useMemo(() => {
    const q = brandQuery.trim().toLowerCase()
    if (!q) return brands
    return brands.filter((brand) => brand.toLowerCase().includes(q))
  }, [brands, brandQuery])

  function applyPrice(e) {
    e.preventDefault()

    const min = minPrice.trim()
    const max = maxPrice.trim()

    const flipped = min !== '' && max !== '' && Number(min) > Number(max)
    onChange({ minPrice: flipped ? max : min, maxPrice: flipped ? min : max })
  }

  function toggleBrand(brand) {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]

    onChange({ brands: next })
  }

  return (
    <aside className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white lg:w-64 lg:shrink-0">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-blue-600 transition hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      <Section title="Categories">
        {categoriesError ? (
          <div className="space-y-1.5">
            <p className="text-xs text-red-600">{categoriesError}</p>
            <button
              type="button"
              onClick={onRetryCategories}
              className="text-xs font-medium text-blue-600 transition hover:text-blue-800"
            >
              Retry
            </button>
          </div>
        ) : categoriesLoading ? (
          <p className="text-xs text-gray-400">Loading categories...</p>
        ) : (
          <div className="max-h-56 overflow-y-auto pr-1">
            <CheckRow
              type="radio"
              name="category"
              checked={filters.category === ''}
              onChange={() => onChange({ category: '' })}
            >
              All categories
            </CheckRow>

            {categories.map((cat) => (
              <CheckRow
                key={cat.slug}
                type="radio"
                name="category"
                checked={filters.category === cat.slug}
                onChange={() => onChange({ category: cat.slug })}
              >
                {cat.name || titleCase(cat.slug)}
              </CheckRow>
            ))}
          </div>
        )}
      </Section>

      <Section title="Price Range">
        <form onSubmit={applyPrice} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Min"
              aria-label="Minimum price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder="Max"
              aria-label="Maximum price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Apply
          </button>
        </form>
      </Section>

      <Section title="Brands">
        {brandsLoading ? (
          <p className="text-xs text-gray-400">Loading brands...</p>
        ) : brands.length === 0 ? (
          <p className="text-xs text-gray-400">No brands listed for these products.</p>
        ) : (
          <>
            {brands.length > 8 && (
              <input
                type="search"
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                placeholder="Search brands..."
                aria-label="Search brands"
                className="mb-2 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            )}

            <div className="max-h-60 overflow-y-auto pr-1">
              {visibleBrands.map((brand) => (
                <CheckRow
                  key={brand}
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                >
                  {brand}
                </CheckRow>
              ))}

              {visibleBrands.length === 0 && (
                <p className="text-xs text-gray-400">No brand matches "{brandQuery}".</p>
              )}
            </div>
          </>
        )}
      </Section>
    </aside>
  )
}
