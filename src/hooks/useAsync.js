import { useCallback, useEffect, useState } from 'react'

export default function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [retryCount, setRetryCount] = useState(0)

  const reload = useCallback(() => setRetryCount((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fn(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return
        setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        setState({ data: null, loading: false, error: err.message || 'Something went wrong.' })
      })

    return () => controller.abort()
  }, [...deps, retryCount])

  return { ...state, reload }
}
