"use client"

import * as React from "react"

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    // Render a placeholder div on the server/initial client render
    // to maintain structural consistency with the client-rendered output.
    return <div style={{ minHeight: '100vh' }} />
  }

  return <>{children}</>
}