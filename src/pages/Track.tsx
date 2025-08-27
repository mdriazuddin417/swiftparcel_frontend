import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IParcelStatus } from "@/lib/parcels";
import { useTrackParcelMutation } from "@/redux/features/parcel/parcel.api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Search,
  Truck
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const trackingSchema = z.object({
  trackingId: z
    .string()
    .min(3, "Tracking ID must be at least 3 characters")
    .max(20, "Tracking ID is too long"),
});

type TrackingFormValues = z.infer<typeof trackingSchema>;

export default function Track() {

  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingId: "",
    },
  });

  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [trackParcel] = useTrackParcelMutation();

  const onSubmit = async (values: TrackingFormValues) => {
    setError(null);
    setTrackingResult(null);

    try {
      const parcel = await trackParcel(values.trackingId.trim()).unwrap();

      if (!parcel) {
        setError(
          "Parcel not found. Please check your tracking ID and try again."
        );
        return;
      }
    

      const trackingData = {
        id: parcel.trackingId,
        status: parcel.status,
        sender: parcel.sender?.name,
        receiver: parcel.receiver?.name,
        origin: `${parcel.pickupAddress?.city ?? ""}, ${
          parcel.pickupAddress?.state ?? ""
        }`,
        destination: `${parcel.receiver?.address?.city ?? ""}, ${
          parcel.receiver?.address?.state ?? ""
        }`,
        estimatedDelivery:parcel.createdAt&&new Date(new Date(parcel.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString() ||"",
        // estimatedDelivery: parcel.createdAt
        //   ? new Date(new Date(parcel.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000)
        //   : null,
        cost: parcel.cost,
        weight: parcel.weight,
        dimensions: parcel.dimensions,
        deliveryType: parcel.parcelType,
        createdAt: parcel.createdAt,
        deliveredAt: parcel.updatedAt,
        timeline: parcel?.statusHistory?.map((log: any, index: number) => ({
          status: log?.status,
          location:
            log?.location ||
            (index === 0
              ? `${parcel.pickupAddress?.city ?? ""}, ${
                  parcel.pickupAddress?.state ?? ""
                }`
              : `${parcel.deliveryAddress?.city ?? ""}, ${
                  parcel.deliveryAddress?.state ?? ""
                }`),
          timestamp: log?.timestamp,
          completed: true,
          description: log?.note || getStatusDescription(log?.status),
        })) ?? [],
      };
      if (parcel.status !== IParcelStatus.DELIVERED && parcel.status !== IParcelStatus.CANCELLED) {
        const futureSteps = getFutureSteps(parcel.status ?? "");
        trackingData.timeline.push(...futureSteps);
      }

      setTrackingResult(trackingData);
    } catch (err) {
      setError(
        "An error occurred while tracking your parcel. Please try again."
      );
    }
  };



  const getStatusDescription = (status: string) => {
    switch (status) {
      case IParcelStatus.PENDING:
        return "Parcel request created and awaiting pickup";
      case IParcelStatus.PICKED_UP:
        return "Parcel collected from sender";
      case IParcelStatus.IN_TRANSIT:
        return "Parcel is on its way to destination";
      case IParcelStatus.OUT_FOR_DELIVERY:
        return "Parcel is out for final delivery";
      case IParcelStatus.DELIVERED:
        return "Parcel successfully delivered";
      case IParcelStatus.CANCELLED:
        return "Parcel delivery cancelled";
      default:
        return "Status update";
    }
  };

  const getFutureSteps = (currentStatus: string) => {
    const allSteps = [
      { status: IParcelStatus.PENDING, description: "Parcel request created" },
      { status: IParcelStatus.PICKED_UP, description: "Parcel collected from sender" },
      { status: IParcelStatus.IN_TRANSIT, description: "Parcel is on its way" },
      { status: IParcelStatus.OUT_FOR_DELIVERY, description: "Parcel out for delivery" },
      { status: IParcelStatus.DELIVERED, description: "Parcel delivered successfully" },
    ];

    const currentIndex = allSteps.findIndex(
      (step) => step.status === currentStatus
    );
    return allSteps.slice(currentIndex + 1).map((step) => ({
      status: step.status,
      location: "Estimated",
      timestamp: "Pending",
      completed: false,
      description: step.description,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "in transit":
      case "out for delivery":
        return "bg-blue-500";
      case "pending":
      case "picked up":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  console.log('tra',trackingResult);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Track Your Parcel
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Enter your tracking ID to get real-time updates on your parcel's
            location and status.
          </p>

          {/* Search Form */}
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tracking ID (e.g., SP123456789)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {form.formState.isSubmitting
                      ? "Searching..."
                      : "Track Parcel"}
                  </Button>
                </form>
              </Form>

              {error && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Tracking ID: {trackingResult.id}
                    </CardTitle>
                    <CardDescription>
                      From {trackingResult.sender} to {trackingResult.receiver}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(trackingResult.status)}>
                    {trackingResult.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Origin</p>
                      <p className="text-sm text-muted-foreground">
                        {trackingResult.origin}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-sm text-muted-foreground">
                        {trackingResult.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Est. Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {trackingResult.estimatedDelivery}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Delivery Type</p>
                      <p className="text-sm text-muted-foreground">
                        {trackingResult?.deliveryType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">
                      {trackingResult?.weight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dimensions</p>
                    <p className="text-sm text-muted-foreground">
                      {trackingResult?.dimensions
                        ? `${trackingResult.dimensions.length} x ${trackingResult.dimensions.width} x ${trackingResult.dimensions.height} cm`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cost</p>
                    <p className="text-sm text-muted-foreground">
                      ${trackingResult?.cost}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
                <CardDescription>
                  Follow your parcel's journey from pickup to delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingResult.timeline.map((event:any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            event.completed
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        {index < trackingResult.timeline.length - 1 && (
                          <div
                            className={`w-px h-8 mt-2 ${
                              event.completed ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`font-medium ${
                              event.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {event.status}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {event.timestamp && new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

    </div>
  );
}
