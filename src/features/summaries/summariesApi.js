import { api } from '@lib/api';

export const summariesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (documentId) => ({ url: `/summaries/${documentId}` }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, documentId) => [{ type: 'Summary', id: documentId }],
    }),
    generateSummary: builder.mutation({
      query: ({ documentId, ...options }) => ({ url: `/summaries/${documentId}`, method: 'POST', data: options }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { documentId }) => [{ type: 'Summary', id: documentId }],
    }),
  }),
});

export const { useGetSummaryQuery, useGenerateSummaryMutation } = summariesApi;
