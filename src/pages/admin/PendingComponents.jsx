import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/ui/Toast';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/formatters';
import {
    FiCheck,
    FiX,
    FiExternalLink,
    FiClock,
    FiLayers,
    FiCode,
    FiCalendar,
    FiUser,
    FiShield
} from 'react-icons/fi';

const PendingComponents = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadPendingComponents();
    }, []);

    const loadPendingComponents = async () => {
        try {
            const data = await adminService.getPendingComponents();
            setComponents(data);
        } catch (error) {
            toast.error('Failed to load pending components');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminService.updateComponentStatus(id, 'published');
            toast.success('Component approved');
            loadPendingComponents();
        } catch (error) {
            toast.error('Failed to approve component');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Are you sure you want to reject this component?')) return;

        try {
            await adminService.updateComponentStatus(id, 'rejected');
            toast.success('Component rejected');
            loadPendingComponents();
        } catch (error) {
            toast.error('Failed to reject component');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <main className="min-h-screen pb-20">
            <div className="max-w-[1400px] mx-auto px-8 pt-10 space-y-10">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                            Quality Assurance
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Review Queue
                        </h1>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <FiClock className="text-indigo-500" />
                            {components.length} items awaiting moderation
                        </p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <div className="px-4 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 rounded-lg">
                            Priority View
                        </div>
                        <div className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
                            Chronological
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {components.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-slate-200 border-dashed py-32 text-center"
                        >
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiShield className="text-3xl text-indigo-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Queue is empty</h2>
                            <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">
                                All submissions have been processed. New items will appear here automatically.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {components.map((component, index) => (
                                <motion.div
                                    key={component._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row"
                                >
                                    {/* Preview Side */}
                                    <div className="lg:w-80 group relative overflow-hidden bg-slate-100 flex-shrink-0">
                                        {component.previewImages?.[0] ? (
                                            <img
                                                src={component.previewImages[0]}
                                                alt={component.title}
                                                className="w-full h-full object-cover aspect-video lg:aspect-square transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full min-h-[200px] flex items-center justify-center text-slate-300">
                                                <FiLayers size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    {/* Content Side */}
                                    <div className="flex-1 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                                                            {component.title}
                                                        </h3>
                                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                                                            {component.category}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <span className="flex items-center gap-1.5">
                                                            <FiCalendar className="text-slate-300" /> {formatDate(component.updatedAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <FiUser className="text-slate-300" /> {component.author?.name || 'Community Member'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(component._id)}
                                                        className="h-10 px-6 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all flex items-center gap-2"
                                                    >
                                                        <FiCheck /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(component._id)}
                                                        className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-3xl">
                                                {component.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {component.techStack?.map((tech, i) => (
                                                    <span key={i} className="text-[10px] font-black bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {component.tags?.map((tag, i) => (
                                                    <span key={i} className="text-[10px] font-bold text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/50">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {component.sourceUrl && (
                                                <a
                                                    href={component.sourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors group"
                                                >
                                                    <FiCode className="group-hover:translate-x-0.5 transition-transform" />
                                                    Audit Source Code
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default PendingComponents;


