"use client"

import * as React from "react"

export function ClientMount({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    // Render null or a minimal placeholder on the server/initial client render
    return null
  }

  return <>{children}</>
}