import { role } from "@/constants/role"
import type { User } from "./auth"
import type { Parcel } from "./parcels"

export interface AdminStats {
  totalUsers: number
  totalParcels: number
  activeUsers: number
  blockedUsers: number
  pendingParcels: number
  inTransitParcels: number
  deliveredParcels: number
  cancelledParcels: number
  totalRevenue: number
  averageDeliveryTime: number
  deliverySuccessRate: number
  monthlyGrowth: number
}

export interface UserWithStatus extends User {
  isBlocked: boolean
  parcelCount: number
  lastActivity: string
}

// Mock users database with admin functionality
const mockUsersWithStatus: UserWithStatus[] = [
  {
    id: "1",
    email: "admin@swiftparcel.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    isBlocked: false,
    totalParcels: 0,
    lastActivity: "2024-12-25T10:00:00Z",
  },
  {
    id: "2",
    email: "sender@example.com",
    firstName: "John",
    lastName: "Sender",
    role: "sender",
    createdAt: "2024-01-02T00:00:00Z",
    isBlocked: false,
    totalParcels: 2,
    lastActivity: "2024-12-24T15:30:00Z",
  },
  {
    id: "3",
    email: "receiver@example.com",
    firstName: "Jane",
    lastName: "Receiver",
    role: "receiver",
    createdAt: "2024-01-03T00:00:00Z",
    isBlocked: false,
    totalParcels: 4,
    lastActivity: "2024-12-25T09:15:00Z",
  },
  {
    id: "4",
    email: "alice@example.com",
    firstName: "Alice",
    lastName: "Smith",
    role: "sender",
    createdAt: "2024-02-15T00:00:00Z",
    isBlocked: false,
    totalParcels: 1,
    lastActivity: "2024-12-23T14:20:00Z",
  },
  {
    id: "5",
    email: "bob.johnson@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    role: "sender",
    createdAt: "2024-03-10T00:00:00Z",
    isBlocked: true,
    totalParcels: 1,
    lastActivity: "2024-12-20T11:45:00Z",
  },
]

// Mock delivery personnel
export const deliveryPersonnel = [
  { id: "dp1", name: "Driver John", location: "New York, NY", status: "available" },
  { id: "dp2", name: "Driver Mike", location: "Los Angeles, CA", status: "busy" },
  { id: "dp3", name: "Driver Sarah", location: "Miami, FL", status: "available" },
  { id: "dp4", name: "Driver Tom", location: "Boston, MA", status: "available" },
  { id: "dp5", name: "Driver Lisa", location: "Chicago, IL", status: "busy" },
  { id: "dp6", name: "Driver Mark", location: "Seattle, WA", status: "available" },
]

// Admin API functions
export async function getAllUsers(): Promise<UserWithStatus[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockUsersWithStatus
}

export async function toggleUserBlock(userId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = mockUsersWithStatus.find((u) => u.id === userId)
  if (!user) {
    throw new Error("User not found")
  }

  user.isBlocked = !user.isBlocked
}

export async function getAllParcels(): Promise<Parcel[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Import parcels from the parcels module (we'll need to access the mock data)
  // For now, we'll return a mock array that represents all parcels in the system
  return [
    {
      id: "1",
      trackingId: "SP123456789",
      senderId: "2",
      senderName: "John Sender",
      senderEmail: "sender@example.com",
      senderPhone: "+1234567890",
      senderAddress: "123 Sender St, New York, NY 10001",
      receiverName: "Jane Receiver",
      receiverEmail: "jane@example.com",
      receiverPhone: "+1987654321",
      receiverAddress: "456 Receiver Ave, Los Angeles, CA 90001",
      parcelType: "Electronics",
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      value: 500,
      deliveryType: "express",
      status: "in-transit",
      createdAt: "2024-12-20T10:00:00Z",
      updatedAt: "2024-12-22T14:30:00Z",
      estimatedDelivery: "2024-12-25T17:00:00Z",
      cost: 25.99,
      notes: "Handle with care - fragile electronics",
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
    {
      id: "2",
      trackingId: "SP987654321",
      senderId: "2",
      senderName: "John Sender",
      senderEmail: "sender@example.com",
      senderPhone: "+1234567890",
      senderAddress: "123 Sender St, New York, NY 10001",
      receiverName: "Bob Wilson",
      receiverEmail: "bob@example.com",
      receiverPhone: "+1555666777",
      receiverAddress: "789 Wilson Rd, Miami, FL 33101",
      parcelType: "Documents",
      weight: 0.5,
      dimensions: { length: 25, width: 18, height: 2 },
      value: 50,
      deliveryType: "standard",
      status: "delivered",
      createdAt: "2024-12-15T14:00:00Z",
      updatedAt: "2024-12-18T16:45:00Z",
      estimatedDelivery: "2024-12-18T17:00:00Z",
      actualDelivery: "2024-12-18T16:45:00Z",
      cost: 12.99,
      statusHistory: [
        {
          status: "pending",
          timestamp: "2024-12-15T14:00:00Z",
          location: "New York, NY",
          updatedBy: "System",
          note: "Parcel created",
        },
        {
          status: "confirmed",
          timestamp: "2024-12-15T15:00:00Z",
          location: "New York, NY",
          updatedBy: "Admin",
          note: "Parcel confirmed",
        },
        {
          status: "picked-up",
          timestamp: "2024-12-16T10:00:00Z",
          location: "New York, NY",
          updatedBy: "Driver Mike",
          note: "Parcel picked up",
        },
        {
          status: "in-transit",
          timestamp: "2024-12-17T08:00:00Z",
          location: "Atlanta, GA",
          updatedBy: "System",
          note: "In transit",
        },
        {
          status: "out-for-delivery",
          timestamp: "2024-12-18T09:00:00Z",
          location: "Miami, FL",
          updatedBy: "Driver Sarah",
          note: "Out for delivery",
        },
        {
          status: "delivered",
          timestamp: "2024-12-18T16:45:00Z",
          location: "Miami, FL",
          updatedBy: "Driver Sarah",
          note: "Delivered successfully",
        },
      ],
    },
    {
      id: "3",
      trackingId: "SP456789123",
      senderId: "4",
      senderName: "Alice Smith",
      senderEmail: "alice@example.com",
      senderPhone: "+1111222333",
      senderAddress: "789 Alice St, Boston, MA 02101",
      receiverName: "Jane Receiver",
      receiverEmail: "receiver@example.com",
      receiverPhone: "+1987654321",
      receiverAddress: "456 Receiver Ave, Los Angeles, CA 90001",
      parcelType: "Books",
      weight: 1.2,
      dimensions: { length: 25, width: 20, height: 8 },
      value: 75,
      deliveryType: "standard",
      status: "out-for-delivery",
      createdAt: "2024-12-23T08:00:00Z",
      updatedAt: "2024-12-25T10:00:00Z",
      estimatedDelivery: "2024-12-25T17:00:00Z",
      cost: 15.99,
      notes: "Educational books - handle with care",
      statusHistory: [
        {
          status: "pending",
          timestamp: "2024-12-23T08:00:00Z",
          location: "Boston, MA",
          updatedBy: "System",
          note: "Parcel created",
        },
        {
          status: "confirmed",
          timestamp: "2024-12-23T09:00:00Z",
          location: "Boston, MA",
          updatedBy: "Admin",
          note: "Parcel confirmed",
        },
        {
          status: "picked-up",
          timestamp: "2024-12-24T11:00:00Z",
          location: "Boston, MA",
          updatedBy: "Driver Tom",
          note: "Parcel picked up",
        },
        {
          status: "in-transit",
          timestamp: "2024-12-24T20:00:00Z",
          location: "Phoenix, AZ",
          updatedBy: "System",
          note: "In transit",
        },
        {
          status: "out-for-delivery",
          timestamp: "2024-12-25T10:00:00Z",
          location: "Los Angeles, CA",
          updatedBy: "Driver Lisa",
          note: "Out for delivery - ready for confirmation",
        },
      ],
    },
    {
      _id: "4",
      trackingId: "SP789123456",
      sender: "5",
      senderName: "Bob Johnson",
      senderEmail: "bob.johnson@example.com",
      senderPhone: "+1444555666",
      senderAddress: "321 Bob Ave, Seattle, WA 98101",
      receiverName: "Jane Receiver",
      receiverEmail: "receiver@example.com",
      receiverPhone: "+1987654321",
      receiverAddress: "456 Receiver Ave, Los Angeles, CA 90001",
      parcelType: "Clothing",
      weight: 0.8,
      dimensions: { length: 30, width: 25, height: 5 },
      value: 120,
      deliveryType: "express",
      status: "PENDING",
      createdAt: "2024-12-24T14:00:00Z",
      updatedAt: "2024-12-24T14:00:00Z",
      estimatedDelivery: "2024-12-26T17:00:00Z",
      cost: 22.99,
      notes: "Winter jacket - fragile packaging",
      statusHistory: [
        {
          status: "pending",
          timestamp: "2024-12-24T14:00:00Z",
          location: "Seattle, WA",
          updatedBy: "System",
          note: "Parcel created - awaiting admin confirmation",
        },
      ],
    },
  ]
}

export async function updateParcelStatus(
  parcelId: string,
  newStatus: string,
  location: string,
  note?: string,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real implementation, this would update the parcel in the database
  console.log(`Updating parcel ${parcelId} to status ${newStatus} at ${location}`)
}

export async function assignDeliveryPersonnel(parcelId: string, personnelId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const personnel = deliveryPersonnel.find((p) => p.id === personnelId)
  if (!personnel) {
    throw new Error("Delivery personnel not found")
  }

  console.log(`Assigned ${personnel.name} to parcel ${parcelId}`)
}

export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const users = mockUsersWithStatus
  const parcels = await getAllParcels()

  return {
    totalUsers: users.length,
    totalParcels: parcels.length,
    activeUsers: users.filter((u) => !u.isBlocked).length,
    blockedUsers: users.filter((u) => u.isBlocked).length,
    pendingParcels: parcels.filter((p) => p.status === "PENDING").length,
    inTransitParcels: parcels.filter((p) => p.status === "IN_TRANSIT" || p.status === "OUT_FOR_DELIVERY").length,
    deliveredParcels: parcels.filter((p) => p.status === "DELIVERED").length,
    cancelledParcels: parcels.filter((p) => p.status === "CANCELLED").length,
    totalRevenue: parcels.reduce((sum, p) => sum + p.cost, 0),
    averageDeliveryTime: 2.5, // Mock calculation
    deliverySuccessRate: 95.2, // Mock calculation
    monthlyGrowth: 12.5, // Mock calculation
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case "DELIVERED":
      return "bg-green-500"
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "bg-blue-500"
    case "PICKED_UP":
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

export function getRoleBadgeColor(roles: string): string {
  switch (roles) {
    case role.admin:
      return "bg-red-500"
    case role.sender:
      return "bg-blue-500"
    case role.receiver:
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}
