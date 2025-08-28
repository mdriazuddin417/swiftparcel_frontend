import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetSingleUserParcelsQuery } from "@/redux/features/parcel/parcel.api";
import { CheckCircle, Clock, Package, TrendingUp } from "lucide-react";

export default function SenderDashboard() {


const {data: user} = useUserInfoQuery(undefined);
const {data: parcels , isLoading} = useGetSingleUserParcelsQuery({sender:user?.data?._id},{
  skip: !user?.data?._id
});
const safeParcels = parcels ?? [];

  const stats = {
    total: safeParcels.length,
    delivered: safeParcels.filter((p) => p.status === "DELIVERED").length,
    inTransit: safeParcels.filter((p) => p.status === "IN_TRANSIT" || p.status === "OUT_FOR_DELIVERY").length,
    pending: safeParcels.filter((p) => p.status === "PENDING" || p.status === "APPROVED").length,
    cancelled: safeParcels.filter((p) => p.status === "CANCELLED").length,
    totalCost: safeParcels.reduce((sum, p) => sum + p.cost, 0),
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Welcome back, {user?.data?.name}! Here's your parcel delivery summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time shipping costs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Parcels</CardTitle>
          <CardDescription>Your latest parcel delivery requests</CardDescription>
        </CardHeader>
         <CardContent>
          {safeParcels.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No parcels yet</h3>
              <p className="text-muted-foreground mb-4">Create your first parcel delivery request to get started.</p>
              <a href="/sender/create" className="text-primary hover:underline">
                Create your first parcel
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {safeParcels.slice(0, 5).map((parcel) => (
                <div key={parcel._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{parcel.trackingId}</div>
                      <div className="text-sm text-muted-foreground">To: {parcel.receiver?.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${parcel.cost}</div>
                    <div className="text-sm text-muted-foreground capitalize">{parcel.status.replace("-", " ")}</div>
                  </div>
                </div>
              ))}
              {safeParcels.length > 5 && (
                <a href="/sender/parcels" className="block w-full text-center py-2 text-primary hover:underline">
                  View all parcels ({safeParcels.length})
                </a>
              )}
            </div>
          )}
       
        </CardContent>
      </Card>
    </div>
  )
}
