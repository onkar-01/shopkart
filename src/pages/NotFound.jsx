import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-20 text-center">
      <h1 className="text-xl font-semibold text-gray-900">Page not found</h1>
      <p className="text-sm text-gray-500">That route doesn't exist.</p>

      <Link
        to="/"
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Back to products
      </Link>
    </div>
  )
}
