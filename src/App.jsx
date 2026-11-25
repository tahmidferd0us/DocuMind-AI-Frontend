import { Provider } from 'react-redux';
import { store } from '@app/store';
import { ThemeProvider } from '@lib/theme';
import { MotionConfig } from 'motion/react';
import ToastViewport from '@features/toast/ToastViewport';
import { useSessionBootstrap } from '@features/auth/useAuth';
import AppRouter from '@routes/AppRouter';

const AppShell = () => {
  useSessionBootstrap();

  return (
    <>
      <AppRouter />
      <ToastViewport />
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <AppShell />
      </MotionConfig>
    </ThemeProvider>
  </Provider>
);

export default App;
