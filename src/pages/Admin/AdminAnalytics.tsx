import { DeliveryTrendsChart } from "@/components/modules/Charts/DeliveryTrendsChart"
import { PerformanceMetricsChart } from "@/components/modules/Charts/PerformanceMetricsChart"
import { RevenueChart } from "@/components/modules/Charts/RevenueChart"
import { StatusDistributionChart } from "@/components/modules/Charts/StatusDistributionChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAllStatsQuery } from "@/redux/features/parcel/parcel.api"
import { Activity, BarChart3, PieChart, TrendingUp } from "lucide-react"

export default function AdminAnalytics() {
  const { data: statsData, isLoading } = useGetAllStatsQuery(undefined)
  const stats = statsData?.data

  // ✅ Generate chart data from backend stats (instead of random)
  const generateChartData = () => {
    // Example months – ideally backend should give monthly stats
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    // Delivery Trends → derive from backend if available
    const deliveryTrends = months.map((month, index) => ({
      month,
      delivered: stats?.deliveredParcels || 0,
      pending: stats?.pendingParcels || 0,
      cancelled: stats?.cancelledParcels || 0,
    }))

    // Revenue Trends
    const revenueData = months.map((month) => ({
      month,
      revenue: stats?.totalRevenue || 0,
      parcels: stats?.totalParcels || 0,
    }))

    // Parcel Status Distribution
    const statusData = [
      { name: "Delivered", value: stats?.deliveredParcels || 0, color: "#10b981" },
      { name: "In Transit", value: stats?.inTransitParcels || 0, color: "#3b82f6" },
      { name: "Pending", value: stats?.pendingParcels || 0, color: "#f59e0b" },
      { name: "Cancelled", value: stats?.cancelledParcels || 0, color: "#ef4444" },
    ]

    // Performance Metrics → avg delivery time, success rate, etc.
    const performanceData = months.map((date) => ({
      date,
      deliveryTime: stats?.averageDeliveryTime || 0,
      successRate: stats?.deliverySuccessRate || 0,
      customerSatisfaction: 90, // mock until backend provides
    }))

    return { deliveryTrends, revenueData, statusData, performanceData }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const chartData = generateChartData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive analytics and insights for system performance and business metrics.
        </p>
      </div>

      {/* Overview Cards (dynamic values) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active: {stats?.activeUsers} / Blocked: {stats?.blockedUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalParcels}</div>
            <p className="text-xs text-muted-foreground">Delivered: {stats?.deliveredParcels}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Success</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.deliverySuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Based on completed parcels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageDeliveryTime} Days</div>
            <p className="text-xs text-muted-foreground">Average parcel delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryTrendsChart data={chartData.deliveryTrends} />
        <RevenueChart data={chartData.revenueData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart data={chartData.statusData} />
        <PerformanceMetricsChart data={chartData.performanceData} />
      </div>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Important metrics for business performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats?.deliverySuccessRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats?.averageDeliveryTime}</div>
              <div className="text-sm text-muted-foreground">Avg Delivery Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">${stats?.totalRevenue?.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
