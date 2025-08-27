import { ISidebarItem } from "@/types";
import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/pages/Admin/AdminDashboard"));
const AdminAnalytics = lazy(() => import("@/pages/Admin/AdminAnalytics"));
const AdminAllUser = lazy(() => import("@/pages/Admin/AdminAllUser"));
const AdminParcels = lazy(() => import("@/pages/Admin/AdminParcels"));
const AdminDeliveryPersonnel = lazy(() => import("@/pages/Admin/AdminDeliveryPersonnel"));

export const adminSidebarItems: ISidebarItem[] = [
  
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Overview",
        url: "/admin/overview",
        component: AdminDashboard,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: AdminAnalytics,
      },
      {
        title: "Users",
        url: "/admin/users",
        component: AdminAllUser,
      },
      {
        title: "Parcels",
        url: "/admin/parcels",
        component: AdminParcels,
      },
      {
        title: "Delivery Personnel",
        url: "/admin/personnel",
        component: AdminDeliveryPersonnel,
      },
    ],
  },

];


// const senderMenuItems = [
//   { title: "Overview", url: "/sender", icon: LayoutDashboard },
//   { title: "Create Parcel", url: "/sender/create", icon: Plus },
//   { title: "My Parcels", url: "/sender/parcels", icon: Package },
//   { title: "Analytics", url: "/sender/analytics", icon: BarChart3 },
// ]

// const receiverMenuItems = [
//   { title: "Overview", url: "/receiver", icon: LayoutDashboard },
//   { title: "Incoming Parcels", url: "/receiver/incoming", icon: PackageCheck },
//   { title: "Delivery History", url: "/receiver/history", icon: History },
//   { title: "Track Parcel", url: "/track", icon: Search },
// ]

// const adminMenuItems = [
//   { title: "Overview", url: "/admin", icon: LayoutDashboard },
//   { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
//   { title: "Users", url: "/admin/users", icon: Users },
//   { title: "Parcels", url: "/admin/parcels", icon: Package },
//   { title: "Delivery Personnel", url: "/admin/personnel", icon: Truck },
//   { title: "Settings", url: "/admin/settings", icon: Settings },
// ]