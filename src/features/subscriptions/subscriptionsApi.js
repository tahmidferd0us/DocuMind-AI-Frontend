import { api } from '@lib/api';

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query({
      query: () => ({ url: '/subscriptions/me' }),
      transformResponse: (response) => response.data,
      providesTags: ['Subscription'],
    }),
    createCheckout: builder.mutation({
      query: (data) => ({ url: '/subscriptions/checkout', method: 'POST', data }),
      invalidatesTags: ['Subscription'],
    }),
    createPortal: builder.mutation({
      query: (data) => ({ url: '/subscriptions/portal', method: 'POST', data }),
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useCreateCheckoutMutation,
  useCreatePortalMutation,
} = subscriptionsApi;
