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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CreateParcelSchema } from "@/lib/parcels";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useCreateParcelMutation } from "@/redux/features/parcel/parcel.api";
import { Calculator, Package } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const createParcelSchema = z.object({
  receiverName: z
    .string()
    .min(2, "Receiver name must be at least 2 characters"),
  receiverEmail: z.string().email("Please enter a valid email address"),
  receiverPhone: z.string().min(10, "Please enter a valid phone number"),

  receiverAddress: z.object({
    street: z.string().min(5, "Please enter a valid street address"),
    city: z.string().min(2, "Please enter a valid city"),
    state: z.string().min(2, "Please enter a valid state"),
    zip: z.string().min(4, "Please enter a valid zip code"),
  }),
  parcelType: z.string().min(1, "Please select a parcel type"),
  weight: z.number().min(0.1, "Weight must be at least 0.1 kg"),
  dimensions: z.object({
    length: z.number().min(1, "Length must be at least 1 cm"),
    width: z.number().min(1, "Width must be at least 1 cm"),
    height: z.number().min(1, "Height must be at least 1 cm"),
  }),
  value: z.number().min(0.01, "Parcel value must be at least $0.01"),
  deliveryType: z.enum(["standard", "express", "same-day"]),
  notes: z.string().optional(),
  pickupAddress: z.object({
    street: z.string().min(5, "Please enter a valid street address"),
    city: z.string().min(2, "Please enter a valid city"),
    state: z.string().min(2, "Please enter a valid state"),
    zip: z.string().min(4, "Please enter a valid zip code"),
  }),
});

type CreateParcelFormValues = z.infer<typeof createParcelSchema>;

export function CreateParcelForm() {
  const navigate = useNavigate();
  const { data: userData } = useUserInfoQuery(undefined);
  const [createParcel] = useCreateParcelMutation();
  const form = useForm<CreateParcelFormValues>({
    resolver: zodResolver(createParcelSchema),
    defaultValues: {
      receiverName: "",
      receiverEmail: "",
      receiverPhone: "",
      receiverAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      pickupAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      parcelType: "",
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      value: 0,
      deliveryType: "standard",
      notes: "",
    },
  });

  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  const calculateCost = () => {
    const values = form.getValues();

    if (
      !values.weight ||
      !values.dimensions.length ||
      !values.dimensions.width ||
      !values.dimensions.height
    ) {
      toast.error("Missing information", {
        description: `Please fill in weight and dimensions to calculate cost`,
      });
      return;
    }

    const baseRate = 5.99;
    const weightRate = values.weight * 2.5;
    const volumeRate =
      ((values.dimensions.length *
        values.dimensions.width *
        values.dimensions.height) /
        1000) *
      0.5;

    let deliveryMultiplier = 1;
    switch (values.deliveryType) {
      case "express":
        deliveryMultiplier = 2;
        break;
      case "same-day":
        deliveryMultiplier = 3;
        break;
    }

    const cost =
      Math.round(
        (baseRate + weightRate + volumeRate) * deliveryMultiplier * 100
      ) / 100;
    setEstimatedCost(cost);
  };

  const onSubmit = async (values: CreateParcelFormValues) => {
    if (!userData) return;
    try {
      const parcelData: CreateParcelSchema = {
        weight: values.weight,
        parcelType: values.parcelType,
        dimensions: {
          length: values.dimensions.length,
          width: values.dimensions.width,
          height: values.dimensions.height,
        },
        deliveryType: values.deliveryType,
        value: values.value,
        cost: estimatedCost || 0,
        receiver: {
          name: values.receiverName,
          email: values.receiverEmail,
          phone: values.receiverPhone,
          address: {
            street: values.receiverAddress.street,
            city: values.receiverAddress.city,
            state: values.receiverAddress.state,
            zip: values.receiverAddress.zip,
          },
        },

        pickupAddress: {
          street: values.pickupAddress.street,
          city: values.pickupAddress.city,
          state: values.pickupAddress.state,
          zip: values.pickupAddress.zip,
        },
        statusHistory:[
          {
            status: "PENDING",
            timestamp: new Date().toISOString(),
            location: Object.values(values.pickupAddress).join(", "),
            updatedBy: userData?.data._id,
            note: "Parcel created and ready for pickup",
          }
        ],
        notes: values.notes || "",
        sender: userData?.data._id,
        status: "PENDING",
      };

      const newParcel = await createParcel(parcelData);

      if (newParcel?.data?.trackingId) {
        toast.success("Parcel created successfully!", {
          description: `Tracking ID: ${newParcel?.data?.trackingId as string}`,
        });

        navigate("/sender/parcels");
      }

      setEstimatedCost(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to create parcel", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Create New Parcel
        </CardTitle>
        <CardDescription>
          Fill in the details below to create a new parcel delivery request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Receiver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Receiver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receiverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiverEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receiverPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Receiver Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Receiver Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="receiverAddress.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiverAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="receiverAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receiverAddress.zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pickup Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pickup Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupAddress.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupAddress.zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Parcel Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Parcel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="parcelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcel Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select parcel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Documents">Documents</SelectItem>
                          <SelectItem value="Electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Food">Food Items</SelectItem>
                          <SelectItem value="Fragile">Fragile Items</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Dimensions (cm) *</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Length
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Width
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">
                          Height
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcel Value ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">
                            Standard (5-7 days)
                          </SelectItem>
                          <SelectItem value="express">
                            Express (2-3 days)
                          </SelectItem>
                          <SelectItem value="same-day">Same Day</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Any special handling instructions..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cost Calculation */}
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" onClick={calculateCost}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Cost
              </Button>
              {estimatedCost && (
                <div className="text-lg font-semibold text-primary">
                  Estimated Cost: ${estimatedCost}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Creating Parcel..."
                : "Create Parcel"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
