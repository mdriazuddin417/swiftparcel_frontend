


import { ParcelsTable } from "@/components/modules/sender/ParcelsTable";
import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";

export default function ManageParcelsPage() {
  const { data: parcels ,isLoading} = useGetAllParcelsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Parcels</h1>
          <p className="text-muted-foreground">Manage and track all your parcel deliveries.</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading parcels...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Parcels</h1>
        <p className="text-muted-foreground">Manage and track all your parcel deliveries.</p>
      </div>

      <ParcelsTable parcels={parcels ?? []} onParcelUpdated={() => {}} />
    </div>
  )
}
