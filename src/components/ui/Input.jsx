import React from 'react';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full space-y-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-xs font-semibold text-slate-600"
                >
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        {icon}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
            w-full h-11 rounded-lg
            ${icon ? 'pl-10 pr-3' : 'px-3'}
            bg-white
            border border-slate-200
            text-sm text-slate-800
            placeholder-slate-400
            transition-colors
            focus:outline-none
            focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-500/20
            hover:border-slate-300
            disabled:bg-slate-100
            disabled:text-slate-400
            disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
                    {...props}
                />
            </div>

            {error ? (
                <p className="text-xs text-red-500">{error}</p>
            ) : (
                helperText && (
                    <p className="text-xs text-slate-400">{helperText}</p>
                )
            )}
        </div>
    );
};

export default Input;
