import { CreateParcelForm } from "@/components/modules/sender/CreateParcelForm";


export default function CreateParcelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Parcel</h1>
        <p className="text-muted-foreground">Send a new parcel with our reliable delivery service.</p>
      </div>

      <CreateParcelForm />
    </div>
  )
}
