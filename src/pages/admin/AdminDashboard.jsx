import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import Loader from '../../components/ui/Loader';
import { FiUsers, FiGrid, FiClock, FiActivity, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQueue, setShowQueue] = useState(true);

  useEffect(() => {
    adminService.getStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <main className="pb-12">
      <div className="max-w-[1400px] mx-auto px-8 pt-10 space-y-10">

        {/* HEADER */}
        <header className="space-y-1.5 pt-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Platform overview & moderation
          </p>
        </header>

        {/* STATS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<FiUsers />}
          />
          <StatCard
            label="Total Components"
            value={stats.totalComponents.toLocaleString()}
            icon={<FiGrid />}
          />
          <StatCard
            label="Pending Components"
            value={stats.pendingComponents}
            icon={<FiClock />}
            accent={stats.pendingComponents > 0}
          />
        </section>

        {/* MAIN CONTENT LAYOUT */}
        <section className="grid grid-cols-12 gap-8 items-start">

          {/* OPERATIONAL QUEUE (LEFT - 8 Cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Operational Queue
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tasks requiring immediate attention
                </p>
              </div>

              <button
                onClick={() => setShowQueue(!showQueue)}
                className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
              >
                {showQueue ? 'Hide Queue' : 'Show Queue'}
              </button>
            </div>

            {showQueue && (
              <div className="p-8">
                {stats.pendingComponents === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiActivity className="text-slate-300 text-2xl" />
                    </div>
                    <p className="text-slate-400 font-medium">No pending actions at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ActionRow
                      title="Review Pending Components"
                      subtitle="Maintain library quality standards"
                      type="High Priority"
                      count={stats.pendingComponents}
                    />
                    <ActionRow
                      title="Manage User Permissions"
                      subtitle="Audit system access levels"
                      type="System"
                      count={stats.totalUsers}
                    />
                    <ActionRow
                      title="Audit Component Integrity"
                      subtitle="Automated checks and validation"
                      type="Maintenance"
                      count={stats.totalComponents}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PLATFORM HEALTH (RIGHT - 4 Cols) */}
          <aside className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-slate-100/80 rounded-2xl p-8 border border-slate-200 ring-1 ring-white/50 backdrop-blur-sm">
              <header className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Platform Health
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  System performance metrics
                </p>
              </header>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Library Success Rate</span>
                    <span className="text-indigo-600">
                      {stats.totalComponents
                        ? Math.round((stats.publishedComponents / stats.totalComponents) * 100)
                        : 0}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-white rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.totalComponents ? (stats.publishedComponents / stats.totalComponents) * 100 : 0}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MiniStat label="Drafts" value={stats.draftComponents} />
                  <MiniStat label="Rejected" value={stats.rejectedComponents} danger />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FiActivity />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">System Logs</p>
                  <p className="text-xs text-slate-500">View real-time events</p>
                </div>
              </div>
              <FiArrowRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
          </aside>

        </section>
      </div>
    </main>
  );
};

/* ========================================================================== */
/* REUSABLE UI COMPONENTS */
/* ========================================================================== */

const StatCard = ({ label, value, icon, accent }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200 flex items-center justify-between"
  >
    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl text-2xl ${accent ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400'}`}>
      {icon}
    </div>
  </motion.div>
);

const ActionRow = ({ title, subtitle, type, count }) => (
  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
        <FiActivity />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
          {type}
        </span>
        <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {count}
        </span>
      </div>
      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-white transition-all">
        <FiArrowRight />
      </button>
    </div>
  </div>
);

const MiniStat = ({ label, value, danger }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
    <p className={`text-xl font-black ${danger ? 'text-rose-500' : 'text-slate-800'}`}>
      {value}
    </p>
    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
      {label}
    </p>
  </div>
);

export default AdminDashboard;


