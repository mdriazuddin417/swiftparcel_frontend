
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface PerformanceMetricsChartProps {
  data: Array<{
    date: string
    deliveryTime: number
    successRate: number
    customerSatisfaction: number
  }>
}

export function PerformanceMetricsChart({ data }: PerformanceMetricsChartProps) {
  const chartConfig = {
    deliveryTime: {
      label: "Avg Delivery Time (days)",
      color: "hsl(var(--chart-1))",
    },
    successRate: {
      label: "Success Rate (%)",
      color: "hsl(var(--chart-2))",
    },
    customerSatisfaction: {
      label: "Customer Satisfaction (%)",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key performance indicators over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="successRate"
                stackId="1"
                stroke="var(--color-successRate)"
                fill="var(--color-successRate)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="customerSatisfaction"
                stackId="2"
                stroke="var(--color-customerSatisfaction)"
                fill="var(--color-customerSatisfaction)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
