

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface Auth {
  provider: string
  providerId: string
}

export interface User {
  _id?: string
  email: string
  name: string
  role: "SENDER" | "RECEIVER" | "ADMIN"
  createdAt?: string
  isActive?: IsActive
  isDeleted: boolean
  isVerified: boolean
  auths: Auth[]
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}




// Role-based redirect paths
export function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "sender":
      return "/sender"
    case "receiver":
      return "/receiver"
    default:
      return "/"
  }
}
