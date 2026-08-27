import { api } from '@lib/api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', data: credentials }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation({
      query: (payload) => ({ url: '/auth/register', method: 'POST', data: payload }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query({
      query: () => ({ url: '/auth/me' }),
      transformResponse: (response) => response.data,
      providesTags: ['Auth'],
    }),
    changePassword: builder.mutation({
      query: (payload) => ({ url: '/auth/password', method: 'PATCH', data: payload }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery, useLazyGetMeQuery, useChangePasswordMutation } = authApi;
