
import { Parcel } from "@/lib/parcels";
import { baseApi } from "@/redux/baseApi";
import { IDeliveryPerson } from "@/types/delivery_man.type";




export interface SingleDeliveryManResponse {
  statusCode: number
  success: boolean
  message: string
  data: Partial<IDeliveryPerson>
}

export interface DeliveryManResponse {
  statusCode: number
  success: boolean
  message: string
  data: Partial<IDeliveryPerson>[]
}

export const deliveryManApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDeliveryMan: builder.mutation<Partial<SingleDeliveryManResponse>, IDeliveryPerson>({
      query: (deliveryMan) => ({
        url: "/delivery-man",
        method: "POST",
        data: deliveryMan,
      }),
      invalidatesTags: ["DELIVERY_MAN"],
    }),
    updateDeliveryMan: builder.mutation<SingleDeliveryManResponse, { id: string; deliveryManData: Partial<IDeliveryPerson> }>({
      query: ({ id, deliveryManData }) => ({
        url: `/delivery-man/${id}`,
        method: "PATCH",
        data: deliveryManData,
      }),
      invalidatesTags: ["DELIVERY_MAN"],
    }),
    deleteDeliveryMan: builder.mutation<null, string>({
      query: (id) => ({
        url: `/delivery-man/${id}`,
        method: "DELETE",
        data: {},
      }),
      invalidatesTags: ["DELIVERY_MAN"],
    }),
    getAllDeliveryMan: builder.query<IDeliveryPerson[], void>({
      query: () => ({
        url: "/delivery-man",
        method: "GET",
      }),
      providesTags: ["DELIVERY_MAN"],
      transformResponse: (response: DeliveryManResponse) => response.data as IDeliveryPerson[],
    }),
    getDeliveryManById: builder.query<Parcel, string>({
      query: (id) => ({
        url: `/delivery-man/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateDeliveryManMutation, useGetAllDeliveryManQuery, useGetDeliveryManByIdQuery, useUpdateDeliveryManMutation, useDeleteDeliveryManMutation } = deliveryManApi;
