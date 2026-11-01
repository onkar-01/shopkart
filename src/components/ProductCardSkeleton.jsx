export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="h-40 bg-gray-100" />

      <div className="space-y-2 border-t border-gray-100 px-3 py-3">
        <div className="h-3 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-2/5 rounded bg-gray-100" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  )
}
