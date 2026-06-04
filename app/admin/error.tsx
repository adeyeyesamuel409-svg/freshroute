'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <h2 className="text-xl font-bold">Dashboard Error</h2>
      <p className="text-gray-500 text-sm text-center max-w-md">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => unstable_retry()}
        className="inline-flex h-10 items-center rounded-lg bg-green-700 px-5 text-sm text-white font-medium hover:bg-green-800 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
