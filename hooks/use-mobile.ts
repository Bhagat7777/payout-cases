import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize as undefined to ensure server render is consistent (no window access)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // This code only runs on the client side after hydration
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkMobile)
    
    // Set initial state on mount
    checkMobile()
    
    return () => mql.removeEventListener("change", checkMobile)
  }, [])

  // Return false until the client-side effect runs, preventing hydration mismatch.
  return isMobile ?? false
}