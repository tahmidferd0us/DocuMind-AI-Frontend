import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { UpgradeModal } from '@features/subscriptions/components/UpgradeModal';

const PublicLayout = () => (
  <div className="flex min-h-dvh flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <UpgradeModal />
    <Footer />
  </div>
);

export default PublicLayout;
