import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { componentService } from '../../services/componentService';
import { useToast } from '../../components/ui/Toast';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/formatters';
import {
    FiEdit,
    FiTrash2,
    FiSend,
    FiPlus,
    FiMoreVertical,
    FiEye,
    FiClock,
    FiCheckCircle,
    FiX,
    FiGrid
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const MyComponents = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadComponents();
    }, []);

    const loadComponents = async () => {
        try {
            const data = await componentService.getMyComponents();
            setComponents(data);
        } catch (error) {
            toast.error('Failed to load components');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this component?')) return;
        try {
            await componentService.delete(id);
            toast.success('Component deleted');
            loadComponents();
        } catch (error) {
            toast.error('Failed to delete component');
        }
    };

    const handleSubmit = async (id) => {
        try {
            await componentService.submit(id);
            toast.success('Component submitted for review');
            loadComponents();
        } catch (error) {
            toast.error('Failed to submit component');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="pb-24">
            <div className="max-w-[1400px] mx-auto px-12 pt-24 space-y-20">

                {/* HEADER */}
                <header className="flex items-end justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Personal Asset Library
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            You have {components.length} components in your repository
                        </p>
                    </div>
                    <Link to="/components/new">
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
                            <FiPlus />
                            New Component
                        </button>
                    </Link>
                </header>

                {/* ASSET TABLE */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {components.length === 0 ? (
                        <div className="py-32 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-8">
                                <FiPlus className="text-slate-300 text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No components found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-10">Ready to share your work? Create your first UI component.</p>
                            <Link to="/components/new">
                                <button className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Component Details</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Modified</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {components.map((component, index) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={component._id}
                                                className="group hover:bg-slate-50/50 transition-colors"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                            <FiGrid size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                                {component.title}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                                #{component._id.slice(-6)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                        {component.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <StatusBadge status={component.status} />
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-slate-600">{formatDate(component.updatedAt)}</p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {component.status === 'draft' && (
                                                            <button
                                                                onClick={() => handleSubmit(component._id)}
                                                                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                                title="Submit for review"
                                                            >
                                                                <FiSend size={18} />
                                                            </button>
                                                        )}
                                                        <Link to={`/admin/components`}> {/* Updated link if applicable or keep same */}
                                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                                <FiEye size={18} />
                                                            </button>
                                                        </Link>
                                                        <Link to={`/components/edit/${component._id}`}>
                                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                                <FiEdit size={18} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(component._id)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        published: { icon: <FiCheckCircle />, bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Published' },
        pending: { icon: <FiClock />, bg: 'bg-amber-50', text: 'text-amber-600', label: 'In Review' },
        draft: { icon: <FiEdit />, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Draft' },
        rejected: { icon: <FiX />, bg: 'bg-rose-50', text: 'text-rose-600', label: 'Rejected' },
    };

    const style = config[status] || config.draft;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${style.bg} ${style.text} rounded-full text-xs font-bold ring-1 ring-inset ${style.text === 'text-slate-600' ? 'ring-slate-200' : 'ring-current/10'}`}>
            <span className="text-sm">{style.icon}</span>
            {style.label}
        </span>
    );
};

export default MyComponents;
