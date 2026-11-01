export default function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <p className="text-base font-medium text-gray-800">No products match these filters</p>
      <p className="text-sm text-gray-500">Try widening the price range or clearing a brand.</p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
