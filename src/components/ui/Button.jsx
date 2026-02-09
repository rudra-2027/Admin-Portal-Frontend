import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    onClick,
    type = 'button',
    className = ''
}) => {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg ' +
        'transition-colors focus:outline-none ' +
        'focus:ring-2 focus:ring-indigo-500/30 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary:
            'bg-accent text-white hover:bg-accent-dark btn-glow shadow-glow',
        secondary:
            'glass text-base-content-100 hover:bg-white/[0.05]',
        danger:
            'bg-error text-white hover:opacity-90',
        ghost:
            'text-base-content-200 hover:bg-white/[0.05] hover:text-base-content-100'
    };

    const sizes = {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing…
                </>
            ) : (
                <>
                    {icon && <span className="text-lg">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
