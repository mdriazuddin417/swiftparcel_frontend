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

