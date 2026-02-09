import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`glass rounded-2xl p-6 relative overflow-hidden group ${hover ? 'card-hover' : ''
                } ${className}`}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">{children}</div>

            {/* Hover Glow Effect */}
            {hover && (
                <div className="absolute -inset-px bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
            )}
        </motion.div>
    );
};

export default GlassCard;
