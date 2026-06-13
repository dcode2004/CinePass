import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-950">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
