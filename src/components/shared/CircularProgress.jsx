import React from 'react';

export default function CircularProgress({
    value,
    size = 60,
    strokeWidth = 6,
    color = '#3b82f6',
    background = '#f1f5f9',
    showLabel = true,
    labelFormatter = (v) => `${Math.round(v)}%`,
    labelClassName,
    trackClassName,
    progressClassName,
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className={trackClassName || 'transition-all duration-300 ease-in-out'}
                    stroke={trackClassName ? 'currentColor' : background}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={progressClassName || 'transition-all duration-500 ease-out'}
                    stroke={progressClassName ? 'currentColor' : color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {showLabel && (
                <div
                    className={`absolute inset-0 flex items-center justify-center font-bold text-xs ${labelClassName || ''}`}
                    style={labelClassName ? undefined : { color }}
                >
                    {labelFormatter(value)}
                </div>
            )}
        </div>
    );
}
