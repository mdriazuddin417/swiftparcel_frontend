

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IParcelStatus } from "@/lib/parcels";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

import { useGetSingleUserParcelsQuery } from "@/redux/features/parcel/parcel.api";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";

export default function ReceiverDashboard() {
  const { data:userData } = useUserInfoQuery(undefined);

   const { data: parcels, isLoading } = useGetSingleUserParcelsQuery({receiverEmail:userData?.data?.email},{
    skip: !userData?.data?.email
   });
   const safeParcels = parcels ?? [];


  const stats = {
    total: safeParcels.length,
    delivered: safeParcels.filter((p) => p.status === IParcelStatus.DELIVERED).length,
    inTransit: safeParcels.filter((p) => p.status === IParcelStatus.IN_TRANSIT || p.status === IParcelStatus.OUT_FOR_DELIVERY).length,
    pending: safeParcels.filter((p) => p.status === IParcelStatus.PENDING || p.status === IParcelStatus.APPROVED || p.status === IParcelStatus.PICKED).length,
    awaitingConfirmation: safeParcels.filter((p) => p.status === IParcelStatus.OUT_FOR_DELIVERY).length,
    averageDeliveryTime: "2.5 days", // Mock calculation
  }

  const incomingParcels = safeParcels.filter((p) => p.status !== IParcelStatus.DELIVERED)
  const deliveredParcels = safeParcels.filter((p) => p.status === IParcelStatus.DELIVERED)


    if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
  
      <div className="min-h-screen flex flex-col">

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Receiver Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {userData?.data?.name}! Track your incoming parcels and delivery history.
              </p>
            </div>


       
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <p className="text-xs text-muted-foreground">All time received</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                      <p className="text-xs text-muted-foreground">Successfully received</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                      <Truck className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
                      <p className="text-xs text-muted-foreground">On the way</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Awaiting Confirmation</CardTitle>
                      <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">{stats.awaitingConfirmation}</div>
                      <p className="text-xs text-muted-foreground">Ready for pickup</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Incoming Parcels */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Incoming Parcels</CardTitle>
                      <CardDescription>Parcels currently being delivered to you</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {incomingParcels.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No incoming parcels</h3>
                          <p className="text-muted-foreground">You don't have any parcels on the way right now.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {incomingParcels.slice(0, 3).map((parcel) => (
                            <div key={parcel._id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{parcel.trackingId}</div>
                                  <div className="text-sm text-muted-foreground">From: {parcel.sender?.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium capitalize">{parcel.status.replace("-", " ")}</div>
                                <div className="text-sm text-muted-foreground">{parcel.parcelType}</div>
                              </div>
                            </div>
                          ))}
                          {incomingParcels.length > 3 && (
                            <button
                              // onClick={() => setActiveTab("incoming")}
                              className="w-full text-center py-2 text-primary hover:underline"
                            >
                              View all incoming parcels ({incomingParcels.length})
                            </button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

           
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Deliveries</CardTitle>
                      <CardDescription>Your recently delivered parcels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {deliveredParcels.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No deliveries yet</h3>
                          <p className="text-muted-foreground">Your delivery history will appear here.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {deliveredParcels.slice(0, 3).map((parcel) => (
                            <div key={parcel._id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                                <div>
                                  <div className="font-medium">{parcel.trackingId}</div>
                                  <div className="text-sm text-muted-foreground">From: {parcel.sender?.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-green-600">Delivered</div>
                                <div className="text-sm text-muted-foreground">
                                  {parcel.actualDelivery &&
                                    new Date(parcel.actualDelivery).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                </div>
                              </div>
                            </div>
                          ))}
                          {deliveredParcels.length > 3 && (
                            <button
                              // onClick={() => setActiveTab("history")}
                              className="w-full text-center py-2 text-primary hover:underline"
                            >
                              View delivery history ({deliveredParcels.length})
                            </button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            

          

          
          </div>
        </main>
      </div>
 
  )
}
