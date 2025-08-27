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
  DialogFooter,
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
import {
  useCreateDeliveryManMutation,
  useGetAllDeliveryManQuery,
  useUpdateDeliveryManMutation,
} from "@/redux/features/deliveryMan/deliveryMan.api";
import { DeliveryStatus, IDeliveryPerson } from "@/types/delivery_man.type";
import { Edit, MapPin, Package, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminDeliveryPersonnel() {
  const { data: deliveryPersonnel, isLoading } =
    useGetAllDeliveryManQuery(undefined);
  const [createDeliveryMan] = useCreateDeliveryManMutation();
  const [updateDeliveryMan] = useUpdateDeliveryManMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<IDeliveryPerson | null>(
    null
  );

  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    phone: string;
    email: string;
    status: DeliveryStatus;
  }>({
    name: "",
    location: "",
    phone: "",
    email: "",
    status: DeliveryStatus.AVAILABLE,
  });

  // Filter personnel based on search and status
  const filteredPersonnel = deliveryPersonnel?.filter((person) => {
    const matchesSearch =
      person?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || person?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle form submission for adding new personnel
  const handleAddPersonnel = async () => {
    const toastId = toast.loading("Adding personnel...");
    try {
      const newPerson: IDeliveryPerson = {
        ...formData,
        assignedParcels: 0,
        totalDeliveries: 0,
        rating: 5.0,
      };
      const result = await createDeliveryMan(newPerson);
      if (result.data) {
        setIsAddDialogOpen(false);
        setFormData({
          name: "",
          location: "",
          phone: "",
          email: "",
          status: DeliveryStatus.AVAILABLE,
        });
        toast.success("Success", {
          description: "Delivery personnel added successfully",
          id: toastId
        });
      } else {
        toast.error("Error", {
          description: "Failed to add delivery personnel",
          id: toastId
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add delivery personnel",
        id: toastId
      });
    }
  };

  // Handle form submission for editing personnel
  const handleEditPersonnel = async () => {
    if (!selectedPerson) return;
    const toastId = toast.loading("Updating...");
    try {
      const res = await updateDeliveryMan({
        id: selectedPerson?._id as string,
        deliveryManData: formData,
      });

      if (res.data) {
        toast.success("Success", {
          description: "Updated successfully",
          id: toastId 
        });
      } else {
        toast.error("Error", {
          description: "Failed to update",
          id: toastId 
        });
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update ",
         id: toastId 
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (
    personId: string,
    newStatus: DeliveryStatus
  ) => {
    if (!personId || !newStatus) return;

    const toastId = toast.loading("Updating status...");
    try {
      const res = await updateDeliveryMan({
        id: personId,
        deliveryManData: { status: newStatus },
      });

      if (res.data) {
        toast.success("Success", {
          description: "Status updated successfully",
          id: toastId 
        });
      } else {
        toast.error("Error", {
          description: "Failed to update status",
          id: toastId 
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update status",
         id: toastId 
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (person: IDeliveryPerson) => {
    setSelectedPerson(person);
    setFormData({
      name: person.name || "",
      location: person.location || "",
      phone: person.phone || "",
      email: person.email || "",
      status: person.status || DeliveryStatus.AVAILABLE,
    });
    setIsEditDialogOpen(true);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case DeliveryStatus.AVAILABLE:
        return "bg-green-100 text-green-800";
      case DeliveryStatus.BUSY:
        return "bg-yellow-100 text-yellow-800";
      case DeliveryStatus.OFFLINE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate statistics
  const stats = {
    total: (deliveryPersonnel ?? []).length,
    available: (deliveryPersonnel ?? []).filter(
      (p) => p.status === DeliveryStatus.AVAILABLE
    ).length,
    busy: (deliveryPersonnel ?? []).filter(
      (p) => p.status === DeliveryStatus.BUSY
    ).length,
    offline: (deliveryPersonnel ?? []).filter(
      (p) => p.status === DeliveryStatus.OFFLINE
    ).length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Delivery Personnel</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Loading delivery personnel...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Personnel</h1>
          <p className="text-muted-foreground">
            Manage your delivery team and assignments
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={() => {
            setFormData({
              name: "",
              location: "",
              phone: "",
              email: "",
              status: DeliveryStatus.AVAILABLE,
            });
            setIsAddDialogOpen(!isAddDialogOpen);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Personnel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Delivery Personnel</DialogTitle>
              <DialogDescription>
                Add a new delivery person to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: DeliveryStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(DeliveryStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPersonnel}>Add Personnel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Personnel
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busy</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.busy}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.offline}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Personnel Management</CardTitle>
          <CardDescription>View and manage your delivery team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(DeliveryStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Personnel Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Total Deliveries</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredPersonnel ?? []).map((person) => (
                  <TableRow key={person._id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {person.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{person.phone}</div>
                        <div className="text-muted-foreground">
                          {person.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={person?.status}
                        onValueChange={(value: DeliveryStatus) =>
                          handleStatusChange(person._id!, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            <Badge
                              className={getStatusBadgeColor(
                                person?.status ?? ""
                              )}
                            >
                              {person?.status || ""}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DeliveryStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        {person.assignedParcels || 0}
                      </div>
                    </TableCell>
                    <TableCell>{person.totalDeliveries}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {person.rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(person)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {(filteredPersonnel ?? []).length === 0 && (
            <div className="text-center py-8">
              <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No personnel found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first delivery person."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delivery Personnel</DialogTitle>
            <DialogDescription>
              Update delivery person information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: DeliveryStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(DeliveryStatus).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditPersonnel}>Update Personnel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
