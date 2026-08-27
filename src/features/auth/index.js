import { PATHS } from '@routes/paths';
import authReducer from './authSlice';
import LoginPage from './pages/LoginPage';

export default { name: 'auth', reducer: authReducer, routes: [{ path: PATHS.login, Component: LoginPage, layout: 'guest' }] };
