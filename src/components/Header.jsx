import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useDebouncedValue from '../hooks/useDebouncedValue.js'

function IconButton({ label, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={`${label} (not part of this assessment)`}
      className="hidden rounded-md p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white sm:block"
    >
      {children}
    </button>
  )
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const onListing = location.pathname === '/'
  const [term, setTerm] = useState(() => searchParams.get('q') || '')
  const debouncedTerm = useDebouncedValue(term, 400)

  const lastPushed = useRef(term)

  useEffect(() => {
    if (!onListing) return

    const fromUrl = searchParams.get('q') || ''
    if (fromUrl !== lastPushed.current) {
      lastPushed.current = fromUrl
      setTerm(fromUrl)
    }
  }, [searchParams, onListing])

  useEffect(() => {
    if (!onListing || debouncedTerm === lastPushed.current) return

    lastPushed.current = debouncedTerm

    const next = new URLSearchParams(searchParams)
    if (debouncedTerm) next.set('q', debouncedTerm)
    else next.delete('q')
    next.delete('page')

    navigate({ pathname: '/', search: next.toString() }, { replace: true })
  }, [debouncedTerm, onListing])

  function handleSubmit(e) {
    e.preventDefault()
    lastPushed.current = term
    navigate({ pathname: '/', search: term ? `?q=${encodeURIComponent(term)}` : '' })
  }

  return (
    <header className="sticky top-0 z-20 bg-slate-800 shadow">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="shrink-0 text-base font-semibold tracking-tight text-white sm:text-lg">
          🛒 ShopKart
        </Link>

        <form onSubmit={handleSubmit} className="relative mx-auto w-full max-w-xl" role="search">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>

          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-full border border-transparent bg-white py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-1">
          <IconButton label="Cart">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M3 4h2l2.4 10.4A2 2 0 0 0 9.35 16h7.3a2 2 0 0 0 1.95-1.6L20 7H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.4" />
              <circle cx="17" cy="20" r="1.4" />
            </svg>
          </IconButton>

          <IconButton label="Account">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
            </svg>
          </IconButton>
        </div>
      </div>
    </header>
  )
}
