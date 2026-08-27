import { httpClient } from './httpClient';

export const axiosBaseQuery = () => async ({ url, method = 'GET', data, params, headers, responseType }) => {
  try {
    const response = await httpClient({ url, method, data, params, headers, responseType });
    return { data: response.data };
  } catch (error) {
    const response = error.response;
    return {
      error: {
        status: response?.status ?? 0,
        code: response?.data?.error?.code ?? 'NETWORK_ERROR',
        message: response?.data?.message ?? error.message ?? 'Unable to reach the server',
        details: response?.data?.error?.details ?? null,
      },
    };
  }
};
