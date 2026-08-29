import { api } from '@lib/api';

export const qaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversation: builder.query({
      query: (documentId) => ({ url: `/qa/${documentId}` }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, documentId) => [{ type: 'Conversation', id: documentId }],
    }),
    askQuestion: builder.mutation({
      query: ({ documentId, question, topK }) => ({ url: `/qa/${documentId}`, method: 'POST', data: { question, topK } }),
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { documentId }) => [{ type: 'Conversation', id: documentId }],
    }),
    clearConversation: builder.mutation({
      query: (documentId) => ({ url: `/qa/${documentId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, documentId) => [{ type: 'Conversation', id: documentId }],
    }),
  }),
});

export const { useGetConversationQuery, useAskQuestionMutation, useClearConversationMutation } = qaApi;
