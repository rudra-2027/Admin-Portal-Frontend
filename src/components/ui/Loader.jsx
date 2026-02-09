import React from 'react';

const Loader = ({ size = 'md', fullScreen = false, label }) => {
    const sizes = {
        sm: 'h-6 w-6 border-2',
        md: 'h-10 w-10 border-2',
        lg: 'h-16 w-16 border-4'
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`
          animate-spin rounded-full
          border-accent/30 border-t-accent
          ${sizes[size]}
        `}
            />
            {label && (
                <span className="text-sm text-base-content-300 animate-pulse">
                    {label}
                </span>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/70 backdrop-blur-md">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export const SkeletonCard = () => {
    return (
        <div className="glass rounded-xl p-6 animate-pulse space-y-4">
            <div className="h-44 rounded-lg bg-base-300/60" />

            <div className="h-5 w-3/4 rounded bg-base-300/60" />
            <div className="h-4 w-full rounded bg-base-300/50" />
            <div className="h-4 w-5/6 rounded bg-base-300/40" />

            <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 rounded-full bg-base-300/40" />
                <div className="h-6 w-20 rounded-full bg-base-300/40" />
            </div>
        </div>
    );
};

export default Loader;
