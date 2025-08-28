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

