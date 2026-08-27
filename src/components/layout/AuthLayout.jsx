import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const AuthLayout = () => (
  <div className="flex min-h-dvh flex-col bg-surface-muted">
    <Navbar />
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AuthLayout;
