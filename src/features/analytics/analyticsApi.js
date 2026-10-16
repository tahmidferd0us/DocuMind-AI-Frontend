import { api } from '@lib/api';

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentAnalytics: builder.query({
      query: (documentId) => ({ url: `/analytics/${documentId}` }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, documentId) => [{ type: 'Analytics', id: documentId }],
    }),
  }),
});

export const { useGetDocumentAnalyticsQuery } = analyticsApi;
