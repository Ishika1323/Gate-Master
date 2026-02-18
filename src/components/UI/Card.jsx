import React from 'react';

const Card = ({ children, className = '', hover = false, compact = false, ...props }) => {
    return (
        <div
            className={`card ${compact ? 'card-compact' : ''} ${hover ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
