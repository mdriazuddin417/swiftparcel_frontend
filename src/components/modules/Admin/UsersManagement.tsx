
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

import { role } from "@/constants/role"
import { type UserWithStatus, getRoleBadgeColor } from "@/lib/admin"
import { IsActive } from "@/lib/auth"
import { useUpdateUserMutation } from "@/redux/features/user/user.api"
import { Calendar, Mail, Search, Shield, ShieldOff, User } from "lucide-react"
import { toast } from "sonner"

interface UsersManagementProps {
  users: UserWithStatus[]
}

export function UsersManagement({ users }: UsersManagementProps) {
  const [updateUser] = useUpdateUserMutation();
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")



  const filteredUsers =users&& users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || statusFilter === user.isActive

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleToggleBlock = async (userId: string | undefined, isCurrentlyBlocked: string) => {
    if (!userId) {
      toast.error("Invalid user ID")
      return
    }
    try {
      await updateUser({ id: userId, userData: { isActive: isCurrentlyBlocked} })
      toast.success(`User has been ${isCurrentlyBlocked} successfully`)
    } catch (error) {
      toast.error(`Failed to update user: ${error instanceof Error ? error.message : "An error occurred"}`)
    } 
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return formatDate(dateString)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SENDER">Sender</SelectItem>
              <SelectItem value="RECEIVER">Receiver</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parcels</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                      ? "No users match your filters"
                      : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive=='BLOCKED' ? "destructive" : "default"}>
                        {user.isActive}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{user.parcelCount || 0}</div>
                        <div className="text-xs text-muted-foreground">parcels</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user?.createdAt ?? '')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{formatLastActivity(user.updatedAt)}</div>
                    </TableCell>
                    <TableCell>
                      {(user.role == role.receiver || user.role == role.sender) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {user.isActive === IsActive.ACTIVE ? (
                                <>
                                  <Shield className="h-4 w-4 mr-1" />
                                  {user.isActive}
                                </>
                              ) : (
                                <>
                                  <ShieldOff className="h-4 w-4 mr-1" />
                                  {user.isActive}
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{user.isActive} User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to {user.isActive !== IsActive.ACTIVE ? "Unblock" : "Block"}{" "}
                                <strong>
                                  {user.name}
                                </strong>
                                ?{" "}
                                {user.isBlocked
                                  ? "They will regain access to the system."
                                  : "They will lose access to the system."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleToggleBlock(user?._id, user.isActive !== IsActive.ACTIVE ? IsActive.ACTIVE : IsActive.BLOCKED)}
                                className={user.isActive !== IsActive.ACTIVE ? "" : "bg-destructive hover:bg-destructive/90"}
                              >
                                {user.isActive !== IsActive.ACTIVE ? "Unblock" : "Block"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        {filteredUsers?.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers?.length} of {users.length} users
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Active: {filteredUsers?.filter((u) => u.isActive === IsActive.ACTIVE).length}</span>
              <span>Blocked: {filteredUsers?.filter((u) => u.isActive === IsActive.BLOCKED).length}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
