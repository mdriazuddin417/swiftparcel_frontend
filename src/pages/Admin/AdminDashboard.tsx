"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  useGetAllParcelsQuery,
  useGetAllStatsQuery,
} from "@/redux/features/parcel/parcel.api";
import {
  Activity,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Shield,
  TrendingUp,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: parcels } = useGetAllParcelsQuery();
  const { data: statsData ,isLoading: isLoadingStats } = useGetAllStatsQuery(undefined);

  const stats = statsData?.data;

  // if (!stats?.data) return null;

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-1 py-8 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Overview
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {userData?.data?.name}! Here's your system overview.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeUsers} active, {stats?.blockedUsers} blocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Parcels
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalParcels}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.inTransitParcels} in transit, {stats?.pendingParcels}{" "}
                  pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Success Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.deliverySuccessRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg delivery: {stats?.averageDeliveryTime} days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Parcel Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Parcel Status Overview</CardTitle>
              <CardDescription>
                Current status distribution of all parcels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stats.pendingParcels}</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (stats.pendingParcels / stats.totalParcels) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>In Transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {stats.inTransitParcels}
                    </span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (stats.inTransitParcels / stats.totalParcels) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {stats.deliveredParcels}
                    </span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (stats.deliveredParcels / stats.totalParcels) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Cancelled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {stats.cancelledParcels}
                    </span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (stats.cancelledParcels / stats.totalParcels) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                User engagement and system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span>Active Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stats.activeUsers}</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (stats.activeUsers / stats.totalUsers) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>Blocked Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stats.blockedUsers}</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (stats.blockedUsers / stats.totalUsers) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    System Health
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">All systems operational</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest system events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parcels?.slice(0, 5).map((parcel) => (
                  <div
                    key={parcel._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{parcel.trackingId}</div>
                        <div className="text-sm text-muted-foreground">
                          {parcel.sender?.name} → {parcel.receiver?.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium capitalize">
                        {parcel.status.replace("-", " ")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(parcel.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
