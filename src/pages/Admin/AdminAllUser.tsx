"use client"


import { UsersManagement } from "@/components/modules/Admin/UsersManagement";
import { useAllUsersQuery } from "@/redux/features/user/user.api";

export default function AdminAllUser() {
  const {data:user,isLoading}= useAllUsersQuery(undefined)


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all users, view their activity, and control access permissions.
        </p>
      </div>

      <UsersManagement users={user?.data} />
    </div>
  )
}
