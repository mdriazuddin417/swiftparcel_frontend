export enum IParcelStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PICKED_UP = 'PICKED_UP',
  DISPATCHED = 'DISPATCHED',
  PICKED = 'PICKED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  HELD = 'HELD',
  BLOCKED = 'BLOCKED',
}

export interface Parcel {
  _id: string
  trackingId: string
  sender: {
    id: string
    name: string
    email: string
    phone: string
    address: string
  }
  receiver: {
    name: string
    email: string
    phone: string
    address: string
  }
  parcelType: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  value: number
  deliveryType: "standard" | "express" | "same-day"
  status: IParcelStatus,
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
  actualDelivery?: string
  deliveryManId?: string
  cost: number
  notes?: string
  statusHistory: ParcelStatusUpdate[]
  pickupAddress?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  deliveryAddress?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  note?: string
}

export interface ParcelStatusUpdate {
  status?: string
  timestamp?: string
  location?: string
  updatedBy?: string
  note?: string
}

export interface CreateParcelSchema {
  sender: string
  receiver: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
  }
  statusHistory: ParcelStatusUpdate[]
  pickupAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  parcelType: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  cost?: number
  value: number
  deliveryType: "standard" | "express" | "same-day"
  notes?: string,
  status: "PENDING" | "APPROVED" | "DISPATCHED" | "PICKED" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "RETURNED" | "HELD" | "BLOCKED",
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "DELIVERED":
      return "bg-green-500"
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "bg-blue-500"
    case "PICKED":
      return "bg-purple-500"
    case "APPROVED":
      return "bg-yellow-500"
    case "PENDING":
      return "bg-orange-500"
    case "CANCELLED":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function getStatusLabel(status: string): string {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const mockParcels: Parcel[] = [
  {
    _id: "1",
    trackingId: "SP123456789",
    sender: {
      id: "2",
      name: "John Sender",
      email: "sender@example.com",
      phone: "+1234567890",
      address: "123 Sender St, New York, NY 10001",
    },
    receiver: {
      name: "Jane Receiver",
      email: "jane@example.com",
      phone: "+1987654321",
      address: "456 Receiver Ave, Los Angeles, CA 90001",
    },
    parcelType: "Electronics",
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 15 },
    value: 500,
    deliveryType: "express",
    status: "IN_TRANSIT",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-22T14:30:00Z",
    estimatedDelivery: "2024-12-25T17:00:00Z",
    cost: 25.99,
    notes: "Handle with care - fragile electronics",
    pickupAddress: {
      street: "123 Sender St",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    statusHistory: [
      {
        status: "pending",
        timestamp: "2024-12-20T10:00:00Z",
        location: "New York, NY",
        updatedBy: "System",
        note: "Parcel created",
      },
      {
        status: "confirmed",
        timestamp: "2024-12-20T11:00:00Z",
        location: "New York, NY",
        updatedBy: "Admin",
        note: "Parcel confirmed and ready for pickup",
      },
      {
        status: "picked-up",
        timestamp: "2024-12-21T09:00:00Z",
        location: "New York, NY",
        updatedBy: "Driver John",
        note: "Parcel picked up from sender",
      },
      {
        status: "in-transit",
        timestamp: "2024-12-22T14:30:00Z",
        location: "Chicago, IL",
        updatedBy: "System",
        note: "Parcel in transit to destination",
      },
    ],
  },

]

export const calculateDeliveryCost = (data: CreateParcelSchema): number => {
  const baseRate = 5.99
  const weightRate = data.weight * 2.5
  const volumeRate = ((data.dimensions.length * data.dimensions.width * data.dimensions.height) / 1000) * 0.5

  let deliveryMultiplier = 1
  switch (data.deliveryType) {
    case "express":
      deliveryMultiplier = 2
      break
    case "same-day":
      deliveryMultiplier = 3
      break
  }

  return Math.round((baseRate + weightRate + volumeRate) * deliveryMultiplier * 100) / 100
}

export const generateTrackingId = (): string => {
  return "SP" + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export const confirmDelivery = async (parcelId: string, confirmationNote?: string): Promise<void> => {
  const parcel = mockParcels.find((p) => p._id === parcelId)
  if (!parcel) {
    throw new Error("Parcel not found")
  }

  if (parcel.status !== "OUT_FOR_DELIVERY") {
    throw new Error("Parcel is not ready for delivery confirmation")
  }

  parcel.updatedAt = new Date().toISOString()
  parcel.actualDelivery = new Date().toISOString()
  parcel.statusHistory.push({
    status: "DELIVERED",
    timestamp: new Date().toISOString(),
    location: "Delivery Address",
    updatedBy: "Receiver",
    note: confirmationNote || "Delivery confirmed by receiver",
  })
}

export function getParcelByTrackingId(trackingId: string): Parcel | null {
  return mockParcels.find((parcel) => parcel.trackingId === trackingId) || null
}
// Mock API functions for receivers
export async function getReceiverParcels(receiverEmail: string): Promise<Parcel[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockParcels.filter((parcel) => parcel.receiver.email.toLowerCase() === receiverEmail.toLowerCase())
}