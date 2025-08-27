import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface DeliveryTrendsChartProps {
  data: Array<{
    month: string
    delivered: number
    pending: number
    cancelled: number
  }>
}

export function DeliveryTrendsChart({ data }: DeliveryTrendsChartProps) {
  const chartConfig = {
    delivered: {
      label: "Delivered",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Trends</CardTitle>
        <CardDescription>Monthly delivery performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="delivered"
                stroke="var(--color-delivered)"
                strokeWidth={2}
                dot={{ fill: "var(--color-delivered)" }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="var(--color-pending)"
                strokeWidth={2}
                dot={{ fill: "var(--color-pending)" }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="var(--color-cancelled)"
                strokeWidth={2}
                dot={{ fill: "var(--color-cancelled)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
