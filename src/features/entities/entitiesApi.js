import { api } from '@lib/api';

export const entitiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query({
      query: (documentId) => ({ url: `/entities/${documentId}` }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, documentId) => [{ type: 'Entity', id: documentId }],
    }),
    extractEntities: builder.mutation({
      query: (documentId) => ({ url: `/entities/${documentId}`, method: 'POST' }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, documentId) => [{ type: 'Entity', id: documentId }, { type: 'Export', id: documentId }],
    }),
  }),
});

export const { useGetEntitiesQuery, useExtractEntitiesMutation } = entitiesApi;
