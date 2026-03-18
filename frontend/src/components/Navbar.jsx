import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BrainCircuit, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goHome = (e) => {
    e?.preventDefault();
    if (window.location.pathname === '/dashboard') {
      window.location.reload(); // Refresh if already on dashboard
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={goHome} className="flex items-center space-x-2 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
              <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">SmartPrep AI</span>
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:ring-2 ring-indigo-500 transition-all duration-300 overflow-hidden group"
              aria-label="Toggle Dark Mode"
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 h-5 w-5 transform transition-transform duration-500 ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
                <Moon className={`absolute inset-0 h-5 w-5 transform transition-transform duration-500 ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
              </div>
            </button>
            <div className="relative group cursor-pointer">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold uppercase overflow-hidden shadow-inner">
                  {user?.username?.charAt(0) || <User className="h-4 w-4" />}
                </div>
                <span className="hidden sm:inline-block">{user?.username}</span>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:scale-100 scale-95 z-50">
                <div className="p-2 space-y-1">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'Logged in'}</p>
                  </div>
                  <button 
                    onClick={goHome} 
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors text-left"
                  >
                    <BrainCircuit className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout Securely</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
