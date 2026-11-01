export const PAGE_SIZE = 12

export function parseFilters(params) {
  const page = parseInt(params.get('page') || '1', 10)

  return {
    search: params.get('q') || '',
    category: params.get('category') || '',
    minPrice: params.get('min') || '',
    maxPrice: params.get('max') || '',
    brands: (params.get('brands') || '').split(',').filter(Boolean),
    page: page > 0 ? page : 1,
  }
}

export function serializeFilters(filters) {
  const params = new URLSearchParams()

  if (filters.search) params.set('q', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.minPrice) params.set('min', filters.minPrice)
  if (filters.maxPrice) params.set('max', filters.maxPrice)
  if (filters.brands.length) params.set('brands', filters.brands.join(','))
  if (filters.page > 1) params.set('page', String(filters.page))

  return params
}

export function hasActiveFilters(f) {
  return Boolean(f.search || f.category || f.minPrice || f.maxPrice || f.brands.length)
}

export function extractBrands(products) {
  const brands = new Set()

  for (const product of products) {
    if (product.brand) brands.add(product.brand)
  }

  return [...brands].sort((a, b) => a.localeCompare(b))
}

export function filterByCategory(products, category) {
  if (!category) return products
  return products.filter((p) => p.category === category)
}

export function applyFilters(products, { minPrice, maxPrice, brands }) {
  const min = minPrice === '' ? null : Number(minPrice)
  const max = maxPrice === '' ? null : Number(maxPrice)
  const picked = new Set(brands)

  return products.filter((product) => {
    if (min !== null && !isNaN(min) && product.price < min) return false
    if (max !== null && !isNaN(max) && product.price > max) return false
    if (picked.size && !picked.has(product.brand)) return false
    return true
  })
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize

  return { items: items.slice(start, start + pageSize), totalPages, page: safePage }
}
