"use client"

import { useState, useEffect, useCallback } from "react"

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(options.immediate || false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiFunction(...args)
        setData(result)
        options.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error")
        setError(error)
        options.onError?.(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, options],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (options.immediate) {
      execute()
    }
  }, [execute, options.immediate])

  return { data, loading, error, execute, reset }
}
