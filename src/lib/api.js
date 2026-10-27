import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'Document', 'Summary', 'Conversation', 'Entity', 'Export', 'Analytics', 'AdminAnalytics', 'AdminUsers', 'AdminDocuments', 'Subscription'],
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
