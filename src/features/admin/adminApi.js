import { api } from '@lib/api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query({
      query: () => ({ url: '/admin/analytics' }),
      transformResponse: (response) => response.data,
      providesTags: ['AdminAnalytics'],
    }),
    listAdminUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', role = '', status = '' } = {}) => {
        const params = { page, limit };
        if (search) params.search = search;
        if (role) params.role = role;
        if (status) params.status = status;
        return { url: '/admin/users', params };
      },
      transformResponse: (response) => ({ items: response.data, meta: response.meta }),
      providesTags: ['AdminUsers'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        data: { isActive },
      }),
      invalidatesTags: ['AdminUsers', 'AdminAnalytics'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        data: { role },
      }),
      invalidatesTags: ['AdminUsers', 'AdminAnalytics'],
    }),
    listAdminDocuments: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => {
        const params = { page, limit };
        if (search) params.search = search;
        if (status) params.status = status;
        return { url: '/admin/documents', params };
      },
      transformResponse: (response) => ({ items: response.data, meta: response.meta }),
      providesTags: ['AdminDocuments'],
    }),
    deleteAdminDocument: builder.mutation({
      query: (id) => ({
        url: `/admin/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminDocuments', 'AdminAnalytics', 'Document'],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useListAdminUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useListAdminDocumentsQuery,
  useDeleteAdminDocumentMutation,
} = adminApi;
