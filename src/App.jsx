import { Provider } from 'react-redux';
import { store } from '@app/store';
import { ThemeProvider } from '@lib/theme';
import ToastViewport from '@features/toast/ToastViewport';
import { UpgradeModal } from '@features/subscriptions/components/UpgradeModal';
import { useSessionBootstrap } from '@features/auth/useAuth';
import AppRouter from '@routes/AppRouter';

const AppShell = () => {
  useSessionBootstrap();

  return (
    <>
      <AppRouter />
      <ToastViewport />
      <UpgradeModal />
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  </Provider>
);

export default App;
