import { api } from '@lib/api';

export const exportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportContents: builder.query({
      query: (documentId) => ({ url: `/exports/${documentId}` }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, documentId) => [{ type: 'Export', id: documentId }],
    }),
  }),
});

export const { useGetReportContentsQuery } = exportsApi;
