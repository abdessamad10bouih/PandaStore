import { cva } from "class-variance-authority"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { cn } from "../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const colorVariants = cva("", {
  variants: {
    color: {
      blue: "bg-blue-50 text-blue-700 border-blue-100",
      green: "bg-green-50 text-green-700 border-green-100",
      red: "bg-red-50 text-red-700 border-red-100",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
      purple: "bg-purple-50 text-purple-700 border-purple-100",
      gray: "bg-gray-50 text-gray-700 border-gray-100",
    },
  },
  defaultVariants: {
    color: "gray",
  },
})

const iconColorVariants = cva("p-2 rounded-md", {
  variants: {
    color: {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700",
      yellow: "bg-yellow-100 text-yellow-700",
      purple: "bg-purple-100 text-purple-700",
      gray: "bg-gray-100 text-gray-700",
    },
  },
  defaultVariants: {
    color: "gray",
  },
})

export default function DashboardCard({ title, value, icon, color = "gray", percentageChange, className }) {
  const isPositiveChange = percentageChange !== undefined && percentageChange >= 0
  const formattedPercentage = percentageChange !== undefined ? Math.abs(percentageChange).toFixed(1) : null

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(iconColorVariants({ color }))}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentageChange !== undefined && (
          <p className="mt-2 flex items-center text-xs">
            {isPositiveChange ? (
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
            )}
            <span className={isPositiveChange ? "text-green-600" : "text-red-600"}>{formattedPercentage}%</span>
            <span className="ml-1 text-muted-foreground">par rapport au mois dernier</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
