import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiEye,
    FiDownload,
    FiExternalLink,
    FiGrid
} from 'react-icons/fi';
import Badge from './ui/Badge';
import { formatNumber } from '../utils/formatters';

const ComponentCard = ({ component }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden flex flex-col"
        >
            <Link to={`/components/${component.slug}`} className="flex flex-col h-full">
                {/* Preview Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                    {component.previewImages?.[0] ? (
                        <img
                            src={component.previewImages[0]}
                            alt={component.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <FiGrid size={40} />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        {component.isFeatured && (
                            <div className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                Featured
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                            {component.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {component.description}
                        </p>
                    </div>

                    <div className="mt-auto space-y-4">
                        {/* Tags */}
                        {component.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {component.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 uppercase tracking-tighter">
                                        {tag}
                                    </span>
                                ))}
                                {component.tags.length > 2 && (
                                    <span className="text-[10px] text-slate-300 font-bold">
                                        +{component.tags.length - 2}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Stats & Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-4 text-slate-400">
                                <div className="flex items-center gap-1.5 font-bold text-[10px]">
                                    <FiEye size={12} className="text-indigo-400" />
                                    {formatNumber(component.views || 0)}
                                </div>
                                <div className="flex items-center gap-1.5 font-bold text-[10px]">
                                    <FiDownload size={12} className="text-purple-400" />
                                    {formatNumber(component.downloads || 0)}
                                </div>
                            </div>

                            <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-indigo-100/50">
                                {component.category}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>

    );
};


export default ComponentCard;


