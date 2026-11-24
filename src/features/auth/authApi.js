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
    updateProfile: builder.mutation({
      query: (payload) => ({ url: '/auth/profile', method: 'PATCH', data: payload }),
      invalidatesTags: ['Auth'],
    }),
    changePassword: builder.mutation({
      query: (payload) => ({ url: '/auth/password', method: 'PATCH', data: payload }),
    }),
    forgotPassword: builder.mutation({ query: (payload) => ({ url: '/auth/forgot-password', method: 'POST', data: payload }) }),
    resetPassword: builder.mutation({ query: (payload) => ({ url: '/auth/reset-password', method: 'POST', data: payload }) }),
    verifyEmail: builder.mutation({ query: (payload) => ({ url: '/auth/verify-email', method: 'POST', data: payload }) }),
    resendVerification: builder.mutation({ query: (payload) => ({ url: '/auth/resend-verification', method: 'POST', data: payload }) }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery, useLazyGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation, useForgotPasswordMutation, useResetPasswordMutation, useVerifyEmailMutation, useResendVerificationMutation } = authApi;

