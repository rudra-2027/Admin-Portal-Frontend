import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    FiGrid,
    FiUsers,
    FiCheckCircle,
    FiPlus,
    FiList,
    FiBarChart2,
    FiLayers,
    FiLogOut,
    FiSettings
} from 'react-icons/fi';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 240;

const Sidebar = ({ expanded, setExpanded }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const links = user?.role === 'ADMIN'
        ? [
            { path: '/admin/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
            { path: '/admin/pending', label: 'Review Queue', icon: <FiCheckCircle /> },
            { path: '/admin/components', label: 'Asset Library', icon: <FiGrid /> },
            { path: '/admin/users', label: 'User Management', icon: <FiUsers /> }
        ]
        : [
            { path: '/dashboard', label: 'Overview', icon: <FiLayers /> },
            { path: '/my-components', label: 'My Assets', icon: <FiList /> },
            { path: '/components/new', icon: <FiPlus />, label: 'New Submission' }
        ];

    return (
        <aside
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            className="fixed left-0 top-0 z-[40] h-screen bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out flex flex-col group"
            style={{ width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
        >
            {/* LOGO SECTION */}
            <div className="h-20 flex items-center px-6 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 flex-shrink-0">
                        <FiGrid size={20} />
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-slate-900 text-lg whitespace-nowrap"
                            >
                                Admin<span className="text-indigo-600">Portal</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="flex-1 px-3 space-y-1">
                {links.map((link) => {
                    const active = isActive(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center h-12 rounded-xl transition-all duration-200 relative group/link
                                ${active
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }
                            `}
                        >
                            <div className="w-[72px] flex-shrink-0 flex items-center justify-center text-xl">
                                {link.icon}
                            </div>

                            <AnimatePresence>
                                {expanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="text-sm font-bold whitespace-nowrap"
                                    >
                                        {link.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {active && !expanded && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* FOOTER SECTION */}
            <div className="p-3 border-t border-slate-100 space-y-1">
                <button
                    onClick={logout}
                    className="w-full flex items-center h-12 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
                >
                    <div className="w-[72px] flex-shrink-0 flex items-center justify-center text-xl">
                        <FiLogOut />
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-sm font-bold whitespace-nowrap"
                            >
                                Sign Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                <div className="flex items-center h-12 px-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`}
                            alt="Avatar"
                        />
                    </div>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="ml-3 overflow-hidden"
                            >
                                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] font-medium text-slate-400 truncate">{user?.email || 'admin@v2.portal'}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

