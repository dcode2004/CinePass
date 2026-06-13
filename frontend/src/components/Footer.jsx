import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎬</span>
          <span className="font-bold text-white">Cine<span className="text-red-500">Pass</span></span>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/theaters" className="hover:text-white transition-colors">Theaters</Link>
          <Link to="/bookings" className="hover:text-white transition-colors">Bookings</Link>
        </div>
        <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} CinePass. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
