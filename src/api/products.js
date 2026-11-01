const BASE_URL = 'https://dummyjson.com'

const LIST_FIELDS = 'id,title,price,rating,thumbnail,brand,category'

async function request(path, { signal } = {}) {
  let res

  try {
    res = await fetch(BASE_URL + path, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Network error. Please check your connection and try again.')
  }

  if (!res.ok) {
    const detail = res.statusText ? `${res.status} ${res.statusText}` : res.status
    throw new Error(`Request failed (${detail}).`)
  }

  return res.json()
}

export function getCategories(opts) {
  return request('/products/categories', opts)
}

export async function getProducts({ category, search }, opts) {
  const query = `limit=0&select=${LIST_FIELDS}`

  let path
  if (search) {
    path = `/products/search?q=${encodeURIComponent(search)}&${query}`
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}?${query}`
  } else {
    path = `/products?${query}`
  }

  const data = await request(path, opts)
  return data.products || []
}

export function getProductById(id, opts) {
  return request(`/products/${encodeURIComponent(id)}`, opts)
}
