"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RatingDistribution {
  rating: number
  count: number
}

interface RatingDistributionChartProps {
  ratingDistribution: RatingDistribution[]
}

export function RatingDistributionChart({ ratingDistribution }: RatingDistributionChartProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1d4ed8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}