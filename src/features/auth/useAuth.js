import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSessionExpiredHandler } from '@lib/httpClient';
import { hasSessionHint } from '@lib/storage';
import { useGetMeQuery, useLogoutMutation } from './authApi';
import { bootstrapFinished, selectAuthUser, selectIsAuthenticated, selectIsBootstrapped, sessionExpired } from './authSlice';

export const useAuth = () => {
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isBootstrapped = useSelector(selectIsBootstrapped);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  return { user, isAuthenticated, isBootstrapped, isAdmin: user?.role === 'ADMIN', logout, isLoggingOut };
};

export const useSessionBootstrap = () => {
  const dispatch = useDispatch();
  const shouldProbe = hasSessionHint();
  const { isSuccess, isError } = useGetMeQuery(undefined, { skip: !shouldProbe });

  useEffect(() => setSessionExpiredHandler(() => dispatch(sessionExpired())), [dispatch]);

  useEffect(() => {
    if (!shouldProbe || isSuccess || isError) dispatch(bootstrapFinished());
  }, [shouldProbe, isSuccess, isError, dispatch]);

  return useSelector(selectIsBootstrapped);
};
