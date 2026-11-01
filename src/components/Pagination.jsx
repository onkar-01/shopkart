function pageWindow(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push(null)
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push(null)

  pages.push(total)
  return pages
}

const btn =
  'min-w-9 rounded-md border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500'
const plain = `${btn} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 py-6" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${plain} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        ← Previous
      </button>

      {pageWindow(page, totalPages).map((item, i) =>
        item === null ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={item === page ? `${btn} border-blue-600 bg-blue-600 text-white` : plain}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${plain} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next →
      </button>
    </nav>
  )
}
