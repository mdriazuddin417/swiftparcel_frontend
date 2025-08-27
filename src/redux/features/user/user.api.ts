import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewUser: builder.mutation({
      query: (userInfo) => ({
        url: "/user/create",
        method: "POST",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: userData,
      }),
      invalidatesTags: ["USER"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
        data: {},
      }),
      invalidatesTags: ["USER"],
    }),
    allUsers: builder.query({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params,
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {useAllUsersQuery,useCreateNewUserMutation,useUpdateUserMutation,useDeleteUserMutation} = userApi;
