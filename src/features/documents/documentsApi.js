import { api } from '@lib/api';

export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listDocuments: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({ url: '/documents', params: { page, limit } }),
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
  }),
});

export const {
  useListDocumentsQuery,
  useGetDocumentQuery,
  useGetDocumentTextQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;
