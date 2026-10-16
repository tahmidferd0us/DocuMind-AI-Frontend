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
    evaluateSummary: builder.mutation({
      query: ({ documentId, reference, candidateType }) => ({
        url: `/summaries/${documentId}/evaluate`,
        method: 'POST',
        data: { reference, candidateType },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetSummaryQuery, useGenerateSummaryMutation, useEvaluateSummaryMutation } = summariesApi;
