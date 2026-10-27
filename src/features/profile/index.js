import { PATHS } from '@routes/paths';
import ProfileActivityPage from './pages/ProfileActivityPage';
import ProfileBillingPage from './pages/ProfileBillingPage';
import ProfileGeneralPage from './pages/ProfileGeneralPage';
import ProfileLayout from './pages/ProfileLayout';
import ProfilePreferencesPage from './pages/ProfilePreferencesPage';
import ProfileSecurityPage from './pages/ProfileSecurityPage';
import profileReducer from './profileSlice';

export default {
  name: 'profile',
  reducer: profileReducer,
  routes: [
    {
      path: PATHS.profile,
      Component: ProfileLayout,
      layout: 'protected',
      children: [
        { index: true, Component: ProfileGeneralPage },
        { path: 'security', Component: ProfileSecurityPage },
        { path: 'preferences', Component: ProfilePreferencesPage },
        { path: 'activity', Component: ProfileActivityPage },
        { path: 'billing', Component: ProfileBillingPage },
      ],
    },
  ],
};
