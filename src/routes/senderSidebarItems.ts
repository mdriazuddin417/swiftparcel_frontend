import { ISidebarItem } from "@/types";
import { lazy } from "react";

const CreateParcelPage = lazy(() => import("@/pages/Sender/CreateParcelPage"));
const ManageParcelsPage = lazy(() => import("@/pages/Sender/ManageParcelsPage"));
const SenderDashboard = lazy(() => import("@/pages/Sender/SenderDashboard"));

export const senderSidebarItems: ISidebarItem[] = [
  {
    title: "Sender Dashboard",
    items: [
      {
        title: "Overview",
        url: "/sender/overview",
        component: SenderDashboard,
      },
      {
        title: "Create Parcel",
        url: "/sender/create",
        component: CreateParcelPage,
      },
      {
        title: "My Parcels",
        url: "/sender/parcels",
        component: ManageParcelsPage,
      },
    ],
  },
];
