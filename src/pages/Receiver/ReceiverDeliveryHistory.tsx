


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetSingleUserParcelsQuery } from "@/redux/features/parcel/parcel.api";
import { Calendar, CheckCircle } from "lucide-react";

export default function ReceiverDeliveryHistory() {
  const {data:userData} = useUserInfoQuery(undefined);
  const {data:parcels} = useGetSingleUserParcelsQuery({
    receiverEmail: userData?.data?.email
  },{
    skip:userData?.data?.email
  })

  const deliveredParcels = parcels?.filter((p) => p.status === "DELIVERED")


  return (
    <div>
      <div className="min-h-screen flex flex-col">

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
        
              <Card>
                <CardHeader>
                  <CardTitle>Delivery History</CardTitle>
                  <CardDescription>All your previously delivered parcels</CardDescription>
                </CardHeader>
                <CardContent>
                  {deliveredParcels?.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No delivery history</h3>
                      <p className="text-muted-foreground">Your completed deliveries will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deliveredParcels?.map((parcel) => (
                        <div key={parcel._id} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <CheckCircle className="h-10 w-10 text-green-600" />
                              <div>
                                <h3 className="font-semibold text-lg">{parcel.trackingId}</h3>
                                <p className="text-muted-foreground">From: {parcel.sender?.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">Delivered</div>
                              <div className="text-sm text-muted-foreground">
                                {parcel.actualDelivery &&
                                  new Date(parcel.actualDelivery).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Type:</span> {parcel.parcelType}
                            </div>
                            <div>
                              <span className="font-medium">Weight:</span> {parcel.weight} kg
                            </div>
                            <div>
                              <span className="font-medium">Value:</span> ${parcel.cost}
                            </div>
                          </div>
                          {parcel.notes && (
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                              <span className="font-medium">Notes:</span> {parcel.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
         
          </div>
        </main>
      </div>
    </div>
  )
}
