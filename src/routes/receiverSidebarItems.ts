import { ISidebarItem } from "@/types";
import { lazy } from "react";

const ReceiverDashboard = lazy(() => import("@/pages/Receiver/ReceiverDashboard"));
const ReceiverDeliveryHistory = lazy(() => import("@/pages/Receiver/ReceiverDeliveryHistory"));
const ReceiverIncomingParcel = lazy(() => import("@/pages/Receiver/ReceiverIncomingParcel"));
const Track = lazy(() => import("@/pages/Track"));

export const receiverSidebarItems: ISidebarItem[] = [
  {
    title: "Receiver Dashboard",
    items: [
      {
        title: "Overview",
        url: "/receiver/overview",
        component: ReceiverDashboard,
      },
      {
        title: "Incoming Parcels",
        url: "/receiver/incoming",
        component: ReceiverIncomingParcel,
      },
      {
        title: "Delivery History",
        url: "/receiver/history",
        component: ReceiverDeliveryHistory,
      },
      {
        title: "Track Parcel",
        url: "/receiver/track",
        component: Track,
      },
    ],
  },
];

