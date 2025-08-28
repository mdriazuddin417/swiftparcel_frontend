import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { getStatusBadgeColor } from "@/lib/admin";
import type { IParcelStatus, Parcel } from "@/lib/parcels";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllDeliveryManQuery } from "@/redux/features/deliveryMan/deliveryMan.api";
import { useUpdateParcelMutation } from "@/redux/features/parcel/parcel.api";
import { DeliveryStatus } from "@/types/delivery_man.type";
import { Edit, Search, Truck, User } from "lucide-react";
import { toast } from "sonner";

interface ParcelsManagementProps {
  parcels: Parcel[];
}

export function ParcelsManagement({ parcels }: ParcelsManagementProps) {
  const [updateParcel] = useUpdateParcelMutation();
  const { data: deliveryPersonnel, } =
    useGetAllDeliveryManQuery(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const {data:userData} = useUserInfoQuery(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<
    IParcelStatus[keyof IParcelStatus] | ""
  >("");

  const [updateNote, setUpdateNote] = useState("");
  const [updateLocation, setUpdateLocation] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");

  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.sender?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || parcel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async () => {
    if (!selectedParcel || !newStatus) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const body = {
        status: newStatus as IParcelStatus,
        note: updateNote,
        location: updateLocation,
        updatedBy: userData?.data?._id,
      };
      const response = await updateParcel({
        id: selectedParcel._id,
        parcelData: {
           status: newStatus as IParcelStatus,
          statusHistory: [...selectedParcel.statusHistory, body],
        },
      });

      if (response.data) {
        toast.success("Status updated", {
        description: `Parcel ${selectedParcel.trackingId} status updated to ${newStatus}`,
      });
      setShowUpdateDialog(false);
      setNewStatus("");
      setUpdateNote("");
      }

     
    } catch (error) {
      toast.error("Failed to update status", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleAssignPersonnel = async () => {
    if (!selectedParcel || !selectedPersonnel) {
      toast.error("Missing information", {
        description: "Please select delivery personnel",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateParcel({
        id: selectedParcel._id,
        parcelData: {
          deliveryManId: selectedPersonnel,
        },
      });

      console.log("response", response);

      toast.success("Personnel assigned");
      setShowAssignDialog(false);
      setSelectedPersonnel("");
    } catch (error) {
      toast.error("Failed to assign personnel", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  console.log('selectedPersonnel',selectedPersonnel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parcel Management</CardTitle>
        <CardDescription>Manage all parcels in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking ID, sender, or receiver..."
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">APPROVED</SelectItem>
              <SelectItem value="PICKED_UP">Picked Up</SelectItem>
              <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParcels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm || statusFilter !== "all"
                      ? "No parcels match your filters"
                      : "No parcels found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredParcels.map((parcel) => (
                  <TableRow key={parcel._id}>
                    <TableCell className="font-mono text-sm">
                      {parcel.trackingId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{parcel.sender?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {parcel.sender?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {parcel.receiver?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {parcel.receiver?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{parcel.parcelType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(parcel.status)}>
                        {getStatusLabel(parcel.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(parcel.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${parcel.cost}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Update Status Dialog */}
                        <Dialog
                          open={showUpdateDialog}
                          onOpenChange={setShowUpdateDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setNewStatus(parcel.status);
                                setUpdateNote("");
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Parcel Status</DialogTitle>
                              <DialogDescription>
                                Update the status of parcel{" "}
                                {selectedParcel?.trackingId}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="status">New Status</Label>
                                <Select
                                  value={typeof newStatus === "string" ? newStatus : String(newStatus)}
                                  onValueChange={(value) =>
                                    setNewStatus(
                                      value as
                                        | IParcelStatus[keyof IParcelStatus]
                                        | ""
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select new status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">
                                      Pending
                                    </SelectItem>
                                    <SelectItem value="APPROVED">
                                      Approved
                                    </SelectItem>
                                    <SelectItem value="PICKED_UP">
                                      Picked Up
                                    </SelectItem>
                                    <SelectItem value="IN_TRANSIT">
                                      In Transit
                                    </SelectItem>
                                    <SelectItem value="OUT_FOR_DELIVERY">
                                      {" "}
                                      Out for Delivery
                                    </SelectItem>
                                    <SelectItem value="DELIVERED">
                                      Delivered
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                      Cancelled
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="location">
                                  Current Location
                                </Label>
                                <Input
                                  id="location"
                                  placeholder="Current Location update"
                                  value={updateLocation}
                                  onChange={(e) =>
                                    setUpdateLocation(e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="note">
                                  Update Note (Optional)
                                </Label>
                                <Input
                                  id="note"
                                  placeholder="Additional information..."
                                  value={updateNote}
                                  onChange={(e) =>
                                    setUpdateNote(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowUpdateDialog(false);
                                    setNewStatus("");
                                    setUpdateNote("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleUpdateStatus}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? "Updating..." : "Update Status"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Assign Personnel Dialog */}
                        <Dialog
                          open={showAssignDialog}
                          onOpenChange={setShowAssignDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedParcel(parcel);
                                setSelectedPersonnel(
                                  parcel.deliveryManId as string
                                );
                              }}
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Assign Delivery Personnel
                              </DialogTitle>
                              <DialogDescription>
                                Assign delivery personnel to parcel{" "}
                                {selectedParcel?.trackingId}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="personnel">
                                  Select Personnel
                                </Label>
                                <Select
                                  value={selectedPersonnel}
                                  onValueChange={setSelectedPersonnel}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose delivery personnel" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {deliveryPersonnel
                                      ?.filter(
                                        (p) =>
                                          p.status === DeliveryStatus.AVAILABLE
                                      )
                                      .map((personnel) => (
                                        <SelectItem
                                          key={personnel?._id}
                                          value={personnel?._id ?? ""}
                                        >
                                          <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>
                                              {personnel.name} -{" "}
                                              {personnel.location}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowAssignDialog(false);
                                    setSelectedPersonnel("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleAssignPersonnel}
                                  disabled={isUpdating}
                                >
                                  {isUpdating
                                    ? "Assigning..."
                                    : "Assign Personnel"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        {filteredParcels.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredParcels.length} of {parcels.length} parcels
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Pending:{" "}
                {filteredParcels.filter((p) => p.status === "PENDING").length}
              </span>
              <span>
                In Transit:{" "}
                {
                  filteredParcels.filter((p) => p.status === "IN_TRANSIT")
                    .length
                }
              </span>
              <span>
                Delivered:{" "}
                {filteredParcels.filter((p) => p.status === "DELIVERED").length}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
