import { PATHS } from '@routes/paths';
import authReducer from './authSlice';
import LoginPage from './pages/LoginPage';
import AccountRecoveryPage from './pages/AccountRecoveryPage';

export default { name: 'auth', reducer: authReducer, routes: [
  { path: PATHS.login, Component: LoginPage, layout: 'guest' },
  { path: PATHS.forgotPassword, Component: AccountRecoveryPage, layout: 'guest' },
  { path: PATHS.resetPassword, Component: AccountRecoveryPage, layout: 'guest' },
  { path: PATHS.verifyEmail, Component: AccountRecoveryPage, layout: 'guest' },
] };
