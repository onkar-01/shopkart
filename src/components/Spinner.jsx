export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-slate-700" />
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  )
}
