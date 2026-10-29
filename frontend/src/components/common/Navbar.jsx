import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Moon, Sun, Menu, X, MessageCircle, ChevronDown,
  LogOut, User, Sparkles, ShieldCheck, Briefcase, LayoutDashboard
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { getInitials } from '../../utils/helpers';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(s => s.auth);
  const { darkMode } = useSelector(s => s.ui);
  const { unread: notifUnread } = useSelector(s => s.notifications);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = user?.role === 'customer'
    ? [
        { to: '/customer/dashboard', label: 'Dashboard' },
        { to: '/search', label: 'Find Verified Help', badge: 'AI Match' },
        { to: '/customer/bookings', label: 'My Bookings' }
      ]
    : user?.role === 'worker'
    ? [
        { to: '/worker/dashboard', label: 'Dashboard' },
        { to: '/worker/bookings', label: 'My Assignments' }
      ]
    : user?.role === 'admin'
    ? [
        { to: '/admin', label: 'Overview' },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/bookings', label: 'Bookings' },
        { to: '/admin/verifications', label: 'Verifications' }
      ]
    : [
        { to: '/#services', label: 'Services' },
        { to: '/#how-it-works', label: 'How It Works' },
        { to: '/#why-us', label: 'Why KaamConnect' },
        { to: '/#testimonials', label: 'Reviews' }
      ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="page-container">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold"
            >
              <span className="text-xl tracking-tighter">KC</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-stone-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Kaam<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-stone-600 dark:text-stone-300 -mt-1 hidden sm:block">
                Your Home. Your Help.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-stone-100/70 dark:bg-stone-800/60 p-1.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleDarkMode())}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {darkMode ? <Sun size={19} className="text-amber-400" /> : <Moon size={19} />}
            </motion.button>

            {user ? (
              <>
                {/* Chat shortcut */}
                <Link
                  to="/chat"
                  aria-label="Messages"
                  className="p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative"
                >
                  <MessageCircle size={19} />
                </Link>

                {/* Notifications */}
                <button
                  aria-label="Notifications"
                  className="p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative"
                >
                  <Bell size={19} />
                  {notifUnread > 0 && (
                    <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                      {notifUnread > 9 ? '9+' : notifUnread}
                    </span>
                  )}
                </button>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl border border-stone-200/80 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-inner">
                      {user.profilePhoto?.url ? (
                        <img src={user.profilePhoto.url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-stone-900 dark:text-white max-w-[110px] truncate leading-tight">
                        {user.name.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-semibold leading-tight">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-stone-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-14 w-56 card shadow-xl py-2 z-50 divide-y divide-stone-100 dark:divide-stone-800"
                      >
                        <div className="px-4 py-2.5">
                          <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {user.role} Account
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to={user.role === 'worker' ? '/worker/dashboard' : user.role === 'admin' ? '/admin' : '/customer/dashboard'}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium"
                          >
                            <LayoutDashboard size={15} className="text-emerald-600" /> Dashboard
                          </Link>
                          {user.role === 'worker' && (
                            <Link
                              to="/worker/onboarding"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium"
                            >
                              <ShieldCheck size={15} className="text-emerald-600" /> Edit KYC / Profile
                            </Link>
                          )}
                          <Link
                            to="/chat"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 font-medium"
                          >
                            <MessageCircle size={15} className="text-emerald-600" /> Chat Messages
                          </Link>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium text-left"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm shadow-emerald-600/20 shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Open mobile menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-stone-200 dark:border-stone-800 py-4 space-y-2"
            >
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {!user && (
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2 px-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl font-semibold text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-emerald-600 shadow-md shadow-emerald-600/20"
                  >
                    Join KaamConnect
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
