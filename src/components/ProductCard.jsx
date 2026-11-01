import { Link } from 'react-router-dom'
import Rating from './Rating.jsx'
import { formatPrice } from '../lib/format.js'

export default function ProductCard({ product, to }) {
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
    >
      <div className="flex h-40 items-center justify-center bg-white p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 border-t border-gray-100 px-3 py-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">{product.title}</h3>
        {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="text-base font-semibold text-gray-900">{formatPrice(product.price)}</span>
          <Rating value={product.rating} />
        </div>
      </div>
    </Link>
  )
}
