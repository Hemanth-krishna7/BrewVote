import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee, Menu, X, User, LogOut, LayoutDashboard, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-brand-500 border-b-2 border-brand-500'
        : 'text-slate-300 hover:text-slate-100 hover:border-slate-300 border-b-2 border-transparent'
    }`;

  const mobileLinkClass = (path) =>
    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'bg-slate-800 border-brand-500 text-brand-500'
        : 'border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-300 hover:text-slate-100'
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-xl font-bold text-slate-100">
              <Coffee className="h-6 w-6 text-brand-500" />
              <span>Brew<span className="text-brand-500">Vote</span></span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link to="/" className={linkClass('/')}>
                <Home className="h-4 w-4 mr-1.5" />
                Home
              </Link>
              
              {/* Only show Admin Dashboard link to logged-in admins */}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className={linkClass('/admin')}>
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400 flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {user?.email}
                </span>
                {user?.role === 'admin' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 tracking-wider">
                    ADMIN
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 text-sm font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors duration-200 ml-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>
              Home
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin')}>
                Admin Dashboard
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-slate-800 px-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-slate-400 mr-2" />
                    <span className="text-sm font-medium text-slate-300">{user?.email}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 tracking-wider">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-700 text-base font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-slate-700 text-base font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
