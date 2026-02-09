import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // danger, warning, info
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    const typeStyles = {
        danger: {
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-500',
            buttonBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-100',
        },
        warning: {
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
            buttonBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100',
        },
        info: {
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-500',
            buttonBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100',
        }
    };

    const style = typeStyles[type] || typeStyles.danger;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Wrapper */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Content */}
                            <div className="p-8">
                                <div className="flex items-start gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                                        <FiAlertTriangle size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-slate-300 hover:text-slate-500 transition-colors"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-8 py-6 bg-slate-50 flex gap-3 justify-end mt-2">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all ${style.buttonBg}`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
