import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiCommand,
  FiLogOut,
  FiSettings,
  FiUser
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Map paths to descriptive titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Platform Overview';
    if (path.includes('/admin/users')) return 'Access Management';
    if (path.includes('/admin/pending')) return 'Review Queue';
    if (path.includes('/admin/components')) return 'Asset Repository';
    if (path.includes('/dashboard')) return 'My Overview';
    if (path.includes('/my-components')) return 'My Assets';
    if (path.includes('/components/new')) return 'New Submission';
    return 'Dashboard';
  };

  return (
    <nav className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <motion.h2
          key={location.pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-slate-900 tracking-tight hidden md:block"
        >
          {getPageTitle()}
        </motion.h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar - SaaS Style */}
        <div className="relative hidden md:block group">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, users, assets..."
            className="pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/30 transition-all font-medium placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white shadow-sm pointer-events-none">
            <FiCommand className="text-[10px] text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400">K</span>
          </div>
        </div>

        <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
          <FiBell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-100 relative">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest leading-none">
                {user?.role}
              </p>
            </div>
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=6366f1&color=fff`}
                className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm transition-transform group-hover:scale-105"
                alt="user"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <FiChevronDown className={`text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* User Dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <>
                {/* Backdrop to close */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-20"
                >
                  <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                  </div>

                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
                      <FiUser size={16} /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 font-medium hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
                      <FiSettings size={16} /> Account Settings
                    </button>

                    <div className="h-px bg-slate-50 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
