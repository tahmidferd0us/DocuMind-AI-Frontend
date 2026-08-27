import { Provider } from 'react-redux';
import { store } from '@app/store';
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
    <AppShell />
  </Provider>
);

export default App;
