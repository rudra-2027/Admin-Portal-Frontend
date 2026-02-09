import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { componentService } from '../../services/componentService';
import Loader from '../../components/ui/Loader';
import { FiPlus, FiGrid, FiClock, FiCheckCircle, FiX, FiActivity, FiArrowRight, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ContributorDashboard = () => {
    const [stats, setStats] = useState({
        draft: 0,
        pending: 0,
        published: 0,
        rejected: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const components = await componentService.getMyComponents();
            const stats = {
                draft: components.filter(c => c.status === 'draft').length,
                pending: components.filter(c => c.status === 'pending').length,
                published: components.filter(c => c.status === 'published').length,
                rejected: components.filter(c => c.status === 'rejected').length
            };
            setStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="pb-24">
            <div className="max-w-[1440px] mx-auto px-12 pt-32 space-y-24">

                {/* HEADER - More breathing room */}
                <header className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Personal Workspace
                        </h1>
                        <p className="text-base font-medium text-slate-400">
                            Manage your contributions and track performance
                        </p>
                    </div>
                    <Link to="/components/new">
                        <button className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 hover:shadow-slate-200">
                            <FiPlus strokeWidth={3} />
                            Create Asset
                        </button>
                    </Link>
                </header>

                {/* STATS SECTION - Cleaner, no background tints for less noise */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <StatCard
                        label="Published"
                        value={stats.published}
                        icon={<FiCheckCircle />}
                        color="text-emerald-500"
                    />
                    <StatCard
                        label="Under Review"
                        value={stats.pending}
                        icon={<FiClock />}
                        color="text-amber-500"
                    />
                    <StatCard
                        label="Saved Drafts"
                        value={stats.draft}
                        icon={<FiGrid />}
                        color="text-indigo-500"
                    />
                    <StatCard
                        label="Needs Attention"
                        value={stats.rejected}
                        icon={<FiX />}
                        color="text-rose-500"
                    />
                </section>

                {/* MAIN CONTENT GRID - Larger gap */}
                <section className="grid grid-cols-12 gap-16 items-start">

                    {/* ACTIVITY SECTION (LEFT - 8 Cols) */}
                    <div className="col-span-12 lg:col-span-8 space-y-12">
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-12 border-b border-slate-50 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
                                    <p className="text-sm font-medium text-slate-400">Your latest repository updates</p>
                                </div>
                                <Link to="/my-components" className="px-5 py-2.5 rounded-xl border border-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 group">
                                    Full Library <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <div className="p-12">
                                {stats.published + stats.pending + stats.draft + stats.rejected === 0 ? (
                                    <div className="py-24 text-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-8">
                                            <FiActivity className="text-slate-200 text-4xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No activity recorded</h3>
                                        <p className="text-slate-400 max-w-sm mx-auto mb-10 text-sm leading-relaxed">Start contributing to the library by creating your first UI component.</p>
                                        <Link to="/components/new">
                                            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:scale-[1.02] transition-all">
                                                New Component
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <ActivityRow
                                            title="Unsubmitted Drafts"
                                            subtitle="Drafts remain private until you formally submit them for review."
                                            count={stats.draft}
                                            type="Action Needed"
                                            path="/my-components"
                                            color="bg-indigo-600"
                                        />
                                        <ActivityRow
                                            title="Peer Review Pipeline"
                                            subtitle="Your components are currently being verified by the QA team."
                                            count={stats.pending}
                                            type="Processing"
                                            path="/my-components"
                                            color="bg-amber-500"
                                        />
                                        <ActivityRow
                                            title="Ready for Production"
                                            subtitle="Components approved and live in the public component library."
                                            count={stats.published}
                                            type="Live"
                                            path="/my-components"
                                            color="bg-emerald-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR (RIGHT - 4 Cols) */}
                    <aside className="col-span-12 lg:col-span-4 space-y-16">
                        {/* More subtle tips card */}
                        <div className="bg-white rounded-xl p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 space-y-8">
                                <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                                    <FiInfo strokeWidth={2.5} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Submission Guidelines</h3>
                                    <p className="text-slate-400 text-base leading-relaxed">
                                        Speed up approval by providing high-quality previews and clear documentation for every asset.
                                    </p>
                                </div>
                                <button className="w-full py-5 border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-xl font-bold transition-all text-sm group-hover:scale-[1.02]">
                                    Browse Docs
                                </button>
                            </div>
                        </div>

                        {/* Leaner Legend */}
                        <div className="bg-white rounded-xl p-12 border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset States</h3>
                            <div className="space-y-8">
                                <StatusItem label="Draft" color="bg-slate-200" description="Local editing phase" />
                                <StatusItem label="In Review" color="bg-amber-400" description="Admin validation" />
                                <StatusItem label="Published" color="bg-emerald-500" description="Live on platform" />
                                <StatusItem label="Rejected" color="bg-rose-500" description="Adjustment required" />
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </div>
    );
};

/* REFINED SUB-COMPONENTS */

const StatCard = ({ label, value, icon, color }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}
        className="p-10 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 transition-all"
    >
        <div className={`text-3xl ${color} opacity-80 mb-2`}>
            {icon}
        </div>
        <div className="space-y-1">
            <h4 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{label}</p>
        </div>
    </motion.div>
);

const ActivityRow = ({ title, subtitle, count, type, path, color }) => (
    <Link to={path} className="flex items-center justify-between p-6 rounded-2xl hover:bg-slate-50/80 transition-all group">
        <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${count > 0 ? `${color} text-white shadow-lg shadow-indigo-100` : 'bg-slate-100 text-slate-300'}`}>
                {count}
            </div>
            <div className="space-y-0.5">
                <h5 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">{title}</h5>
                <p className="text-xs font-medium text-slate-400 max-w-md line-clamp-1">{subtitle}</p>
            </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-slate-900 border border-transparent group-hover:border-slate-100 rounded-xl transition-all">
            {type}
        </div>
    </Link>
);

const StatusItem = ({ label, color, description }) => (
    <div className="flex items-center gap-5">
        <div className={`w-2.5 h-2.5 rounded-full ${color} ring-4 ring-offset-2 ring-white shadow-sm flex-shrink-0`} />
        <div className="space-y-0.5">
            <span className="text-sm font-bold text-slate-900 block leading-none">{label}</span>
            <span className="text-[10px] font-medium text-slate-400">{description}</span>
        </div>
    </div>
);

export default ContributorDashboard;
