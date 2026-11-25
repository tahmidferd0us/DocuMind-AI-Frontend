import { api } from '@lib/api';

export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listDocuments: builder.query({
      query: ({ page = 1, limit = 10, search, status, tag, folder, sort } = {}) => ({
        url: '/documents',
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(tag ? { tag } : {}),
          ...(folder ? { folder } : {}),
          ...(sort ? { sort } : {}),
        },
      }),
      transformResponse: (response) => ({ items: response.data, meta: response.meta }),
      providesTags: ['Document'],
    }),
    getDocument: builder.query({
      query: (id) => ({ url: `/documents/${id}` }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),
    getDocumentText: builder.query({
      query: (id) => ({ url: `/documents/${id}/text` }),
      transformResponse: (response) => response.data,
    }),
    uploadDocument: builder.mutation({
      query: (file) => {
        const data = new FormData();
        data.append('file', file);
        return { url: '/documents', method: 'POST', data };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({ url: `/documents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation({ query: ({ id, ...data }) => ({ url: `/documents/${id}`, method: 'PATCH', data }), invalidatesTags: (result, error, { id }) => [{ type: 'Document', id }, 'Document'] }),
    bulkDocuments: builder.mutation({ query: (data) => ({ url: '/documents/bulk', method: 'PATCH', data }), invalidatesTags: ['Document'] }),
    retryDocument: builder.mutation({
      query: (id) => ({ url: `/documents/${id}/retry`, method: 'POST' }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, id) => [{ type: 'Document', id }, 'Document'],
    }),
  }),
});

export const {
  useListDocumentsQuery,
  useGetDocumentQuery,
  useGetDocumentTextQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
  useBulkDocumentsMutation,
  useRetryDocumentMutation,
} = documentsApi;
