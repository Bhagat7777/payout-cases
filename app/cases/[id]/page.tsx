import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  FileText,
  LinkIcon,
  User,
  Loader2,
  ArrowLeft,
  ExternalLink, // <-- Added import
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCaseById } from "@/lib/queries/cases"
import { getSignedEvidenceUrls } from "@/lib/actions/storage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CaseDetailPageProps {
  params: {
    id: string
  }
}

const formatRelativeTime = (dateString: string | null) => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const renderStars = (rating: number, isApproval: boolean) => {
  const colorClass = isApproval ? "text-yellow-400 fill-current" : "text-[#EF4444] fill-current"
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${i < Math.floor(rating) ? colorClass : "text-gray-600"}`}
    />
  ))
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const caseItem = await getCaseById(params.id)

  if (!caseItem) {
    notFound()
  }

  const isApproval = caseItem.type === "approval"
  const gradientFrom = isApproval ? "#22C55E" : "#EF4444"
  const gradientTo = isApproval ? "#00D1B2" : "#7C5CFF"
  const badgeColor = isApproval ? "#22C55E" : "#EF4444"
  const Icon = isApproval ? CheckCircle : XCircle

  const evidenceUrls = await getSignedEvidenceUrls(caseItem.evidence_urls || [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0F17" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            href={isApproval ? "/approvals" : "/denials"}
            className="inline-flex items-center text-gray-400 hover:text-[#E6E7EB] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {isApproval ? "Approvals" : "Denials"}
          </Link>

          <Card className="glass border-white/10">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#E6E7EB" }}>
                      {caseItem.title || (isApproval ? "Successful Payout Approval" : "Payout Denial Report")}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Case ID: {caseItem.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <Badge
                  className="text-sm font-semibold"
                  style={{ backgroundColor: `${badgeColor}10`, color: badgeColor, borderColor: `${badgeColor}20` }}
                >
                  {isApproval ? "Approved Payout" : "Denied Payout"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-8">
              {/* Metadata Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wider flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {isApproval ? "Payout Date" : "Denial Date"}
                  </p>
                  <p className="text-[#E6E7EB] font-medium">
                    {formatRelativeTime(caseItem.payout_date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wider flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Rating
                  </p>
                  <div className="flex items-center space-x-1">
                    {renderStars(caseItem.rating, isApproval)}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs uppercase tracking-wider flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Prop Firm
                  </p>
                  <Link href={`/firms/${caseItem.firms?.slug}`} className="text-[#7C5CFF] hover:underline font-medium">
                    {caseItem.firms?.name || "Unknown Firm"}
                  </Link>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center" style={{ color: "#E6E7EB" }}>
                  <FileText className="w-5 h-5 mr-2 text-gray-400" />
                  Details
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {caseItem.notes || "No detailed notes provided for this case."}
                </p>
              </div>

              {/* Evidence Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center" style={{ color: "#E6E7EB" }}>
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  Submitted By
                </h2>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {caseItem.profiles?.handle ? caseItem.profiles.handle[0].toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[#E6E7EB] font-medium">
                    {caseItem.profiles?.handle || "Anonymous Trader"}
                  </span>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center" style={{ color: "#E6E7EB" }}>
                  <LinkIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Evidence ({evidenceUrls.length})
                </h2>
                {evidenceUrls.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {evidenceUrls.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group aspect-square overflow-hidden rounded-lg shadow-lg"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Button variant="secondary" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Full Image
                          </Button>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No evidence screenshots were provided for this case.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}