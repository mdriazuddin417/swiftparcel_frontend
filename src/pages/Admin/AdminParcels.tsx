
import { ParcelsManagement } from "@/components/modules/Admin/ParcelsManagement";
import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";

export default function AdminParcels() {
    const { data: parcels ,isLoading} = useGetAllParcelsQuery(undefined);


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
        <h1 className="text-3xl font-bold text-foreground">Parcel Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor all parcels, update delivery status, and manage the delivery process.
        </p>
      </div>

      <ParcelsManagement parcels={parcels ?? []} />
    </div>
  )
}
