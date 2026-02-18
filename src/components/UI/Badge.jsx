import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
    const baseClasses = 'badge';

    const variantClasses = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: '',
    };

    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
