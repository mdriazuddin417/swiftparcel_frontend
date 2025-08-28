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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import {
  IParcelStatus,
  type Parcel,
  confirmDelivery,
  getStatusColor,
  getStatusLabel,
} from "@/lib/parcels";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Package,
  Search,
} from "lucide-react";
import { useState } from "react";

interface IncomingParcelsProps {
  parcels: Parcel[];
}

export function IncomingParcels({ parcels }: IncomingParcelsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationNote, setConfirmationNote] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.parcelType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || parcel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConfirmDelivery = async (parcelId: string) => {
    setIsConfirming(true);
    try {
      await confirmDelivery(parcelId, confirmationNote);
      toast({
        title: "Delivery confirmed!",
        description: "Thank you for confirming the delivery",
      });
      setConfirmationNote("");
      setShowConfirmDialog(false);
    } catch (error) {
      toast({
        title: "Failed to confirm delivery",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const canConfirmDelivery = (parcel: Parcel) => {
    return parcel.status === IParcelStatus.OUT_FOR_DELIVERY;
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
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Parcels</CardTitle>
        <CardDescription>
          View and manage parcels being delivered to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tracking ID, sender name, or parcel type..."
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
            {
              Object.values(IParcelStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))
            }
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParcels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm || statusFilter !== "all"
                      ? "No parcels match your filters"
                      : "No incoming parcels"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredParcels?.map((parcel) => (
                  <TableRow key={parcel._id}>
                    <TableCell className="font-mono text-sm">
                      {parcel.trackingId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{parcel?.sender?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {parcel?.sender?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{parcel.parcelType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(parcel?.status)}>
                        {getStatusLabel(parcel?.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(
                                        parcel.estimatedDelivery ||
                                          new Date(
                                            new Date(parcel.createdAt).setDate(
                                              new Date(parcel.createdAt).getDate() + 3
                                            )
                                          ).toISOString()
                                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedParcel(parcel)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Parcel Details</DialogTitle>
                              <DialogDescription>
                                Tracking ID: {selectedParcel?.trackingId}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedParcel && (
                              <div className="space-y-6">
                                {/* Status and Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Package className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        Status
                                      </span>
                                    </div>
                                    <Badge
                                      className={getStatusColor(
                                        selectedParcel.status
                                      )}
                                    >
                                      {getStatusLabel(selectedParcel.status)}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        Shipping Cost
                                      </span>
                                    </div>
                                    <span className="text-lg font-semibold">
                                      ${selectedParcel.cost}
                                    </span>
                                  </div>
                                </div>

                                {/* Sender Info */}
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Sender Information
                                  </h3>
                                  <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div>
                                      <strong>Name:</strong>{" "}
                                      {selectedParcel.sender.name}
                                    </div>
                                    <div>
                                      <strong>Email:</strong>{" "}
                                      {selectedParcel.sender.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong>{" "}
                                      {selectedParcel.sender.phone}
                                    </div>
                                    {selectedParcel.sender.address && (
                                      <div>
                                        <strong>Address:</strong>{" "}
                                        {selectedParcel.sender.address}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Parcel Details */}
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Parcel Details
                                  </h3>
                                  <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <div>
                                      <strong>Type:</strong>{" "}
                                      {selectedParcel.parcelType}
                                    </div>
                                    <div>
                                      <strong>Weight:</strong>{" "}
                                      {selectedParcel.weight} kg
                                    </div>
                                    {selectedParcel.dimensions && (
                                      <div>
                                        <strong>Dimensions:</strong>{" "}
                                        {selectedParcel.dimensions.length} ×{" "}
                                        {selectedParcel.dimensions.width} ×{" "}
                                        {selectedParcel.dimensions.height} cm
                                      </div>
                                    )}
                                    <div>
                                      <strong>Declared Value:</strong> $
                                      {selectedParcel.value}
                                    </div>
                                    <div>
                                      <strong>Delivery Type:</strong>{" "}
                                      {selectedParcel.deliveryType}
                                    </div>
                                    {selectedParcel.notes && (
                                      <div>
                                        <strong>Special Instructions:</strong>{" "}
                                        {selectedParcel.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Delivery Timeline
                                  </h3>
                                  <div className="space-y-4">
                                    {selectedParcel.statusHistory.map(
                                      (update, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start gap-4"
                                        >
                                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                              <h4 className="font-medium">
                                                {getStatusLabel(update.status as string)}
                                              </h4>
                                              <span className="text-sm text-muted-foreground">
                                                {formatDate(update.timestamp as string)}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <MapPin className="h-3 w-3" />
                                              <span>{update.location}</span>
                                              <span>•</span>
                                              <span>by {update.updatedBy}</span>
                                            </div>
                                            {update.note && (
                                              <p className="text-sm text-muted-foreground mt-1">
                                                {update.note}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">
                                        Estimated Delivery
                                      </span>
                                    </div>
                                    <span>
                                      {formatDate(
                                        selectedParcel.estimatedDelivery ||
                                          new Date(
                                            new Date(selectedParcel.createdAt).setDate(
                                              new Date(selectedParcel.createdAt).getDate() + 3
                                            )
                                          ).toISOString()
                                      )}
                                    </span>
                                  </div>
                                  {selectedParcel.actualDelivery && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                          Actual Delivery
                                        </span>
                                      </div>
                                      <span>
                                        {formatDate(
                                          selectedParcel.actualDelivery
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {canConfirmDelivery(parcel) && (
                          <Dialog
                            open={showConfirmDialog}
                            onOpenChange={setShowConfirmDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedParcel(parcel);
                                  setShowConfirmDialog(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Delivery</DialogTitle>
                                <DialogDescription>
                                  Please confirm that you have received parcel{" "}
                                  {selectedParcel?.trackingId}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="confirmationNote">
                                    Delivery Notes (Optional)
                                  </Label>
                                  <Textarea
                                    id="confirmationNote"
                                    placeholder="Any comments about the delivery condition..."
                                    value={confirmationNote}
                                    onChange={(e) =>
                                      setConfirmationNote(e.target.value)
                                    }
                                    rows={3}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setShowConfirmDialog(false);
                                      setConfirmationNote("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      selectedParcel &&
                                      handleConfirmDelivery(selectedParcel.id)
                                    }
                                    disabled={isConfirming}
                                  >
                                    {isConfirming
                                      ? "Confirming..."
                                      : "Confirm Delivery"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
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
  );
}
