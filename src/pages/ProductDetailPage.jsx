import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Rating from '../components/Rating.jsx'
import Spinner from '../components/Spinner.jsx'
import ErrorState from '../components/ErrorState.jsx'
import useAsync from '../hooks/useAsync.js'
import { getProductById } from '../api/products.js'
import { formatDate, formatPrice, titleCase } from '../lib/format.js'

function Field({ label, children }) {
  return (
    <p className="text-sm text-gray-700">
      <span className="font-semibold text-gray-900">{label}:</span> {children}
    </p>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [activeImage, setActiveImage] = useState(0)

  const { data: product, loading, error, reload } = useAsync(
    (signal) => getProductById(id, { signal }),
    [id]
  )

  const backTo = useMemo(() => {
    const from = searchParams.get('from') || ''
    return { pathname: '/', search: from ? `?${from}` : '' }
  }, [searchParams])

  const images = product?.images?.length ? product.images : product ? [product.thumbnail] : []

  const discounted = product?.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        ← Back
      </Link>

      {loading ? (
        <Spinner label="Loading product..." />
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : (
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex h-80 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-6">
              <img
                src={images[activeImage]}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === activeImage}
                    className={`h-16 w-16 rounded-md border p-1 transition ${
                      i === activeImage
                        ? 'border-blue-600 ring-1 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>

              {discounted && (
                <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                  {product.discountPercentage}% off → {formatPrice(discounted)}
                </span>
              )}

              <Rating value={product.rating} size={16} />
            </div>

            <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
              <Field label="Brand">{product.brand || 'Not specified'}</Field>
              <Field label="Category">{titleCase(product.category)}</Field>
              <Field label="Availability">
                <span className={product.stock > 0 ? 'text-green-700' : 'text-red-600'}>
                  {product.stock > 0
                    ? `${product.availabilityStatus} (${product.stock} left)`
                    : 'Out of stock'}
                </span>
              </Field>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <h2 className="mb-1 text-base font-semibold text-gray-900">Description</h2>
              <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <h2 className="mb-2 text-base font-semibold text-gray-900">
                Reviews {product.reviews?.length ? `(${product.reviews.length})` : ''}
              </h2>

              {product.reviews?.length ? (
                <ul className="space-y-3">
                  {product.reviews.map((review, i) => (
                    <li key={`${review.reviewerEmail}-${i}`} className="rounded-md bg-gray-50 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{review.reviewerName}</span>
                        <Rating value={review.rating} size={13} />
                        <span className="ml-auto text-xs text-gray-400">{formatDate(review.date)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
