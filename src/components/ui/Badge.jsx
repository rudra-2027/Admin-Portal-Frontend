import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const Badge = ({
  children,
  variant = 'default',
  status,
  className = '',
}) => {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';

  const variants = {
    default:
      'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',

    success:
      'bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800',

    warning:
      'bg-yellow-50 text-yellow-800 ring-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-800',

    error:
      'bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-800',

    info:
      'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-800',

    accent:
      'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800',
  };

  const statusVariant =
    status && STATUS_COLORS?.[status]?.variant
      ? variants[STATUS_COLORS[status].variant]
      : variants[variant];

  return (
    <span className={`${base} ${statusVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
