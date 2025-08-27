


import { IncomingParcels } from "@/components/modules/receiver/IncomingParcels";
import { IParcelStatus } from "@/lib/parcels";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";

export default function ReceiverIncomingParcel() {
const { data: parcels, isLoading } = useGetAllParcelsQuery();
   const { data:userData } = useUserInfoQuery(undefined);
  const safeParcels = parcels ?? [];

  const incomingParcels = safeParcels.filter((p) => p.status !== IParcelStatus.DELIVERED);

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
              <p className="text-muted-foreground mt-2">
                Welcome back, {userData?.data?.name}! Track your incoming parcels
              </p>
            </div>
           <IncomingParcels parcels={incomingParcels} />
          </div>
        </main>
      </div>
 
  )
}
