const STAR =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

export default function Rating({ value = 0, size = 14, showValue = true }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0))
  const uid = `star-${rating.toFixed(2).replace('.', '-')}-${size}`

  return (
    <span className="inline-flex items-center gap-1" title={`${rating.toFixed(1)} out of 5`}>
      <span className="inline-flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i))

          return (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
              <defs>
                <clipPath id={`${uid}-${i}`}>
                  <rect x="0" y="0" width={24 * fill} height="24" />
                </clipPath>
              </defs>
              <path d={STAR} fill="#e5e7eb" />
              <path d={STAR} fill="#f59e0b" clipPath={`url(#${uid}-${i})`} />
            </svg>
          )
        })}
      </span>

      {showValue && <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>}
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
    </span>
  )
}
