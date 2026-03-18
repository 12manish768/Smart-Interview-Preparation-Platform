import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, Sun, Moon, UserCircle2, Sparkles } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500); // Give user time to see the "Thanks!" animation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden">
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:shadow-lg hover:ring-2 ring-indigo-500 transition-all duration-300 overflow-hidden group z-50 animate-fade-in"
        aria-label="Toggle Dark Mode"
      >
        <div className="relative w-6 h-6">
          <Sun className={`absolute inset-0 h-6 w-6 transform transition-transform duration-500 ${isDarkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          <Moon className={`absolute inset-0 h-6 w-6 transform transition-transform duration-500 ${isDarkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
        </div>
      </button>

      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-colors relative z-10 custom-drop-shadow">
        
        {/* Left Side: Animated Mascot & Banner */}
        <div className="md:w-5/12 bg-indigo-600 dark:bg-indigo-900 p-10 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Mascot Container */}
          <div className="relative z-10 flex flex-col items-center animate-bounce-in">
            {/* The Speech Bubble / Banner */}
            <div className={`relative bg-white text-indigo-700 font-extrabold px-6 py-4 rounded-2xl shadow-xl transition-all duration-500 ${isSuccess ? 'scale-110 bg-green-400 text-white' : 'hover:-translate-y-2'} mb-6`}>
              <div className="text-center text-lg whitespace-nowrap">
                {isSuccess ? "🎉 Thanks for joining!" : loading ? "Connecting..." : "🚀 Ready to level up?"}
              </div>
              <div className="text-center text-xs opacity-80 mt-1">
                {isSuccess ? "Let's start your prep!" : "Create your account."}
              </div>
              {/* Bubble Tail */}
              <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 rotate-45 transition-colors duration-500 ${isSuccess ? 'bg-green-400' : 'bg-white'}`}></div>
            </div>

            {/* The Mascot Icon */}
            <div className={`p-4 rounded-full border-4 shadow-2xl transition-all duration-500 ${isSuccess ? 'border-green-400 bg-green-500' : 'border-white bg-indigo-500'}`}>
              <UserCircle2 className="w-20 h-20 text-white" />
            </div>
            
            <h3 className="mt-8 text-white font-bold text-xl tracking-wider uppercase opacity-90">SmartPrep AI</h3>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-10 sm:p-14 flex items-center bg-white dark:bg-gray-800 transition-colors">
          <div className="w-full space-y-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 border-b-2 border-transparent hover:border-indigo-500 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/30 p-4 animate-scale-in border border-red-100 dark:border-red-800">
                  <div className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {error}
                  </div>
                </div>
              )}
              <div className="space-y-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm shadow-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm shadow-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm shadow-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || isSuccess}
                  className={`group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all duration-300 shadow-xl overflow-hidden ${isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-2xl'}`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading && !isSuccess ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : isSuccess ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <UserPlus className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                    )}
                    <span>{isSuccess ? 'Success!' : loading ? 'Creating...' : 'Sign Up Securely'}</span>
                  </span>
                  {!isSuccess && <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
