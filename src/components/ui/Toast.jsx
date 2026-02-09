import React, {
    createContext,
    useContext,
    useState,
    useCallback
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------------------------------- */
/* Context */
/* ---------------------------------- */

const ToastContext = createContext(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx;
};

/* ---------------------------------- */
/* Provider */
/* ---------------------------------- */

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        (message, type = 'info', options = {}) => {
            const id = crypto.randomUUID();

            // ⏳ Slower default duration (5s)
            const duration = options.duration ?? 5000;

            setToasts((prev) => [
                ...prev,
                { id, message, type, action: options.action }
            ]);

            if (duration !== Infinity) {
                setTimeout(() => removeToast(id), duration);
            }
        },
        [removeToast]
    );

    const api = {
        success: (msg, opts) => addToast(msg, 'success', opts),
        error: (msg, opts) => addToast(msg, 'error', opts),
        warning: (msg, opts) => addToast(msg, 'warning', opts),
        info: (msg, opts) => addToast(msg, 'info', opts)
    };

    return (
        <ToastContext.Provider value={api}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[100] space-y-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

/* ---------------------------------- */
/* Toast Component */
/* ---------------------------------- */

const Toast = ({ message, type, onClose, action }) => {
    const styles = {
        success: {
            bg: 'from-emerald-500 to-green-600',
            ring: 'ring-emerald-400/40'
        },
        error: {
            bg: 'from-red-500 to-rose-600',
            ring: 'ring-red-400/40'
        },
        warning: {
            bg: 'from-amber-400 to-orange-500',
            ring: 'ring-amber-300/40'
        },
        info: {
            bg: 'from-blue-500 to-indigo-600',
            ring: 'ring-blue-400/40'
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`
        glass bg-gradient-to-r ${styles[type].bg}
        ring-1 ${styles[type].ring}
        text-white px-6 py-4 rounded-2xl shadow-2xl
        flex items-start gap-4 min-w-[380px] text-base
      `}
        >
            <ToastIcon type={type} />

            <div className="flex-1">
                <p className="font-semibold leading-snug">{message}</p>

                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-2 text-sm underline opacity-90 hover:opacity-100"
                    >
                        {action.label}
                    </button>
                )}
            </div>

            <button
                onClick={onClose}
                className="text-lg opacity-70 hover:opacity-100 transition"
            >
                ✕
            </button>
        </motion.div>
    );
};

/* ---------------------------------- */
/* Icon */
/* ---------------------------------- */

const ToastIcon = ({ type }) => {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i'
    };

    return (
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/20 font-bold text-lg">
            {icons[type]}
        </div>
    );
};
