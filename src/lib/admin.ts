import { role } from "@/constants/role"
import type { User } from "./auth"

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
