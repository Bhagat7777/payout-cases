import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CaseDetailLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-6 w-32 mb-6 bg-white/10" />

        <Card className="glass border-white/10 animate-pulse">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-14 h-14 rounded-lg bg-white/10 shrink-0" />
                <div>
                  <Skeleton className="h-6 w-96 mb-2 bg-white/10" />
                  <Skeleton className="h-4 w-48 bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 bg-white/10" />
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* Metadata Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24 bg-white/10" />
                  <Skeleton className="h-5 w-32 bg-white/10" />
                </div>
              ))}
            </div>

            <div className="h-px bg-white/10" />

            {/* Details Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-24 bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-11/12 bg-white/10" />
                <Skeleton className="h-4 w-10/12 bg-white/10" />
              </div>
            </div>

            {/* Submitted By Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 bg-white/10" />
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
                <Skeleton className="h-5 w-24 bg-white/10" />
              </div>
            </div>

            {/* Evidence Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40 bg-white/10" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg bg-white/10" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}