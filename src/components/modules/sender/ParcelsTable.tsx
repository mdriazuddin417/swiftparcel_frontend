

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { getStatusColor, getStatusLabel, type Parcel, } from "@/lib/parcels"
import { useDeleteParcelMutation } from "@/redux/features/parcel/parcel.api"
import { Clock, DollarSign, Eye, MapPin, Package, Search, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import WarningDialog from "../Shared/WarningDialog"

interface ParcelsTableProps {
  parcels: Parcel[]
  onParcelUpdated: () => void
}

export function ParcelsTable({ parcels, onParcelUpdated }: ParcelsTableProps) {
  const [cancelParcel] = useDeleteParcelMutation()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const filteredParcels = parcels && parcels.filter((parcel) => {
    const matchesSearch =
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiver?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || parcel.status === statusFilter

    return matchesSearch && matchesStatus || []
  })



  const handleCancelParcel = async (parcelId: string) => {
    setIsCancelling(true)
    try {
      await cancelParcel(parcelId)
      toast.error("Parcel cancelled", {
        description: "The parcel has been successfully cancelled",
      })
      onParcelUpdated()
    } catch (error) {
      toast.error("Failed to cancel parcel", {
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setIsCancelling(false)
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Parcels</CardTitle>
        <CardDescription>View and manage all your parcel delivery requests</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking ID, receiver name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="picked-up">Picked Up</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParcels?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== "all" ? "No parcels match your filters" : "No parcels found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredParcels?.map((parcel) => (
                  <TableRow key={parcel._id}>
                    <TableCell className="font-mono text-sm">{parcel.trackingId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{parcel.receiver?.name}</div>
                        <div className="text-sm text-muted-foreground">{parcel.receiver?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{parcel.parcelType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(parcel.status)}>{getStatusLabel(parcel.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(parcel.createdAt)}</TableCell>
                    <TableCell className="font-medium">${parcel.cost}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedParcel(parcel)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Parcel Details</DialogTitle>
                              <DialogDescription>Tracking ID: {selectedParcel?.trackingId}</DialogDescription>
                            </DialogHeader>
                            {selectedParcel && (
                              <div className="space-y-6">
                                {/* Status and Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Package className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Status</span>
                                    </div>
                                    <Badge className={getStatusColor(selectedParcel.status)}>
                                      {getStatusLabel(selectedParcel.status)}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Cost</span>
                                    </div>
                                    <span className="text-lg font-semibold">${selectedParcel.cost}</span>
                                  </div>
                                </div>

                                {/* Receiver Info */}
                                <div>
                                  <h3 className="font-semibold mb-2">Receiver Information</h3>
                                  <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div>
                                      <strong>Name:</strong> {selectedParcel.receiver?.name}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {selectedParcel.receiver?.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong> {selectedParcel.receiver?.phone}
                                    </div>
                                    <div>
                                      <strong>Address:</strong> {Object.values(selectedParcel.receiver?.address ?? {}).join(', ')}
                                    </div>
                                  </div>
                                </div>

                                {/* Parcel Details */}
                                <div>
                                  <h3 className="font-semibold mb-2">Parcel Details</h3>
                                  <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div>
                                      <strong>Type:</strong> {selectedParcel.parcelType}
                                    </div>
                                    <div>
                                      <strong>Weight:</strong> {selectedParcel.weight} kg
                                    </div>
                                   { selectedParcel?.dimensions&&<div>
                                      <strong>Dimensions:</strong> {selectedParcel?.dimensions?.length} ×{" "}
                                      {selectedParcel?.dimensions?.width} × {selectedParcel?.dimensions?.height} cm
                                    </div>}
                                    <div>
                                      <strong>Value:</strong> ${selectedParcel.cost}
                                    </div>
                                    {selectedParcel.notes && (
                                      <div>
                                        <strong>Notes:</strong> {selectedParcel.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                  <h3 className="font-semibold mb-2">Status Timeline</h3>
                                  <div className="space-y-4">
                                    {selectedParcel.statusHistory.map((update, index) => (
                                      <div key={index} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                          <div className="w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{getStatusLabel(update?.status ||"")}</h4>
                                            <span className="text-sm text-muted-foreground">
                                              {formatDate(update.timestamp ?? "")}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            <span>{update.location}</span>
                                            <span>•</span>
                                            <span>by {update.updatedBy}</span>
                                          </div>
                                          {update.note && (
                                            <p className="text-sm text-muted-foreground mt-1">{update.note}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Estimated Delivery</span>
                                    </div>
                                    <span>{formatDate(selectedParcel.createdAt)}</span>
                                  </div>
                                  {selectedParcel.actualDelivery && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Actual Delivery</span>
                                      </div>
                                      <span>{formatDate(selectedParcel.actualDelivery)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* {canCancelParcel(parcel) && ( */}
                          <WarningDialog
                            handleContinue={() => handleCancelParcel(parcel._id)}
                            title="Cancel Parcel"
                            description="Are you sure you want to cancel this parcel?"
                          >
                            <Button variant="outline" size="sm" disabled={isCancelling}>
                              <X className="h-4 w-4" />
                            </Button>
                          </WarningDialog>
                        {/* )} */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination placeholder */}
        {filteredParcels.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredParcels.length} of {parcels.length} parcels
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
