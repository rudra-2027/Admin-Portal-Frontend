import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicService } from '../../services/publicService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import ComponentCard from '../../components/ComponentCard';
import { SkeletonCard } from '../../components/ui/Loader';
import { COMPONENT_STATUS } from '../../utils/constants';
import { FiFilter, FiSearch, FiTrash2, FiStar, FiChevronRight } from 'react-icons/fi';

const AllComponents = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadComponents();
    }, [statusFilter]);

    const loadComponents = async () => {
        setLoading(true);
        try {
            const params = statusFilter ? { status: statusFilter } : {};
            const data = await publicService.getComponents(params);
            setComponents(data.components || data);
        } catch (error) {
            toast.error('Failed to load components');
        } finally {
            setLoading(false);
        }
    };

    const handleFeatureToggle = async (id, currentStatus) => {
        try {
            await adminService.featureComponent(id, !currentStatus);
            toast.success(`Component ${!currentStatus ? 'featured' : 'unfeatured'}`);
            loadComponents();
        } catch (error) {
            toast.error('Failed to update component');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this component?')) return;

        try {
            await adminService.deleteComponent(id);
            toast.success('Component deleted');
            loadComponents();
        } catch (error) {
            toast.error('Failed to delete component');
        }
    };

    return (
        <main className="min-h-screen pb-16">
            <div className="max-w-[1400px] mx-auto px-8 pt-10 space-y-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                            Portal Assets
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Asset Library
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Centralized moderation and quality control
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all font-medium"
                            />
                        </div>
                    </div>
                </header>

                {/* FILTERS BAR */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <FilterButton
                            active={statusFilter === ''}
                            onClick={() => setStatusFilter('')}
                        >
                            All Assets
                        </FilterButton>
                        {Object.values(COMPONENT_STATUS).map((status) => (
                            <FilterButton
                                key={status}
                                active={statusFilter === status}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </FilterButton>
                        ))}
                    </div>

                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
                        Total Assets: {components.length}
                    </div>
                </div>

                {/* COMPONENTS GRID */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {[...Array(8)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </motion.div>
                    ) : components.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {components.map((component) => (
                                <div key={component._id} className="relative group">
                                    <ComponentCard component={component} />

                                    {/* Action Shortcuts Overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={() => handleFeatureToggle(component._id, component.isFeatured)}
                                            className={`p-2.5 rounded-xl border shadow-xl transition-all ${component.isFeatured
                                                ? 'bg-amber-500 border-amber-600 text-white'
                                                : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200'
                                                }`}
                                            title={component.isFeatured ? 'Unfeature' : 'Feature'}
                                        >
                                            <FiStar className={component.isFeatured ? 'fill-current' : ''} size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(component._id)}
                                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 shadow-xl transition-all"
                                            title="Delete Asset"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-32 text-center bg-white rounded-3xl border border-slate-200 shadow-sm border-dashed"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiFilter className="text-3xl text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No assets found</h3>
                            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                                We couldn't find any components matching your criteria.
                            </p>
                            <button
                                className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                onClick={() => setStatusFilter('')}
                            >
                                Reset Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

const FilterButton = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-tighter ${active
            ? 'bg-slate-900 text-white shadow-md'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
    >
        {children}
    </button>
);

export default AllComponents;


