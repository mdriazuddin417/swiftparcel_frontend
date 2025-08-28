
import { CreateParcelSchema, Parcel } from "@/lib/parcels";
import { baseApi } from "@/redux/baseApi";




export interface ParcelResponse {
  statusCode: number
  success: boolean
  message: string
  data: Partial<Parcel>
}

export interface ParcelsResponse {
  statusCode: number
  success: boolean
  message: string
  data: Partial<Parcel>[]
}

export interface AdminStats{
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  totalParcels: number
  inTransitParcels: number
  pendingParcels: number
  deliveredParcels: number
  cancelledParcels: number
  totalRevenue: number
  monthlyGrowth: number
  deliverySuccessRate: number
  averageDeliveryTime: number
}


export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation<Partial<Parcel>, CreateParcelSchema>({
      query: (parcelData) => ({
        url: "/parcel",
        method: "POST",
        data: parcelData,
      }),
      invalidatesTags: ["PARCEL"],
      transformResponse: (response: ParcelResponse) => response.data,
    }),
    updateParcel: builder.mutation<ParcelResponse, { id: string; parcelData: Partial<Parcel> }>({
      query: ({ id, parcelData }) => ({
        url: `/parcel/${id}`,
        method: "PUT",
        data: parcelData,
      }),
      invalidatesTags: ["PARCEL"],
    }),
    deleteParcel: builder.mutation<null, string>({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "DELETE",
        data: {},
      }),
      invalidatesTags: ["PARCEL"],
    }),
    getAllParcels: builder.query<Parcel[], {sender?: string,receiverEmail?: string}>({
      query: () => ({
        url: "/parcel",
        method: "GET",
      }),
      providesTags: ["PARCEL"],
       transformResponse: (response: ParcelsResponse) => response.data as Parcel[],
    }),
    getSingleUserParcels: builder.query<Parcel[], {sender?: string,receiverEmail?: string}>({
      query: ({sender,receiverEmail}) => ({
        url: "/parcel/my-parcels",
        method: "GET",
        params: { sender,receiverEmail },
      }),
      providesTags: ["PARCEL"],
       transformResponse: (response: ParcelsResponse) => response.data as Parcel[],
    }),
    getParcelById: builder.query<Parcel, string>({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "GET",
      }),
    }),
    trackParcel: builder.mutation<Partial<Parcel>, string>({
      query: (trackId) => ({
        url: "/parcel/track",
        method: "POST",
        data: { trackingId: trackId },
      }),
      transformResponse: (response: ParcelResponse) => response.data,
    }),
     getAllStats: builder.query({
      query: () => ({
        url: `/admin/stats`,
        method: "GET",
      })
    }),
  }),
});

export const { useCreateParcelMutation, useGetAllParcelsQuery, useGetParcelByIdQuery, useUpdateParcelMutation, useDeleteParcelMutation ,useTrackParcelMutation,useGetAllStatsQuery,useGetSingleUserParcelsQuery} = parcelApi;
