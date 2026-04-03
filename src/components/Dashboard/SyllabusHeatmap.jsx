import React, { useMemo } from 'react';
import Card from '../UI/Card';
import { progressCalculator } from '../../services/progressCalculator';
import { Target } from 'lucide-react';

export default function SyllabusHeatmap({ planProgress }) {
    const heatmapData = useMemo(() => {
        return progressCalculator.getHeatmapData(planProgress);
    }, [planProgress]);

    // Grouping by weeks for the grid
    const weeks = [];
    let currentWeek = [];
    
    // Fill leading empty days to align to Sunday (0)
    if (heatmapData.length > 0) {
        const firstDay = new Date(heatmapData[0].date).getDay();
        for (let i = 0; i < firstDay; i++) {
            currentWeek.push(null);
        }
    }

    heatmapData.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Ensure we fill out the remaining days of the current week to keep the grid even
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    const getIntensityColor = (count) => {
        if (count === 0) return 'bg-slate-200 dark:bg-slate-700/60';
        if (count <= 1) return 'bg-brand-200 dark:bg-brand-900/60';
        if (count <= 3) return 'bg-brand-400 dark:bg-brand-700/80';
        if (count <= 5) return 'bg-brand-500 dark:bg-brand-500';
        return 'bg-brand-700 dark:bg-brand-400';
    };

    return (
        <Card>
            <div className="flex items-center gap-2 mb-6">
                <Target size={20} className="text-brand-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Heatmap</h3>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="w-full flex flex-col gap-1.5 min-w-max">
                    <div className="flex gap-1.5 text-[10px] text-slate-400 font-medium ml-6 mb-1">
                        {/* Optionally labels for months could go here */}
                    </div>
                    
                    <div className="flex gap-1.5 w-full justify-between">
                        <div className="flex flex-col gap-1.5 text-[10px] text-slate-400 font-medium justify-between pr-2 py-1">
                            <span>Mon</span>
                            <span>Wed</span>
                            <span>Fri</span>
                        </div>
                        
                        {weeks.map((week, wIdx) => (
                            <div key={`w-${wIdx}`} className="flex flex-col gap-1.5">
                                {week.map((day, dIdx) => {
                                    if (!day) return <div key={`empty-${wIdx}-${dIdx}`} className="w-3.5 h-3.5 rounded-sm bg-transparent" />; // Hide outside grid days
                                    
                                    return (
                                        <div 
                                            key={day.date} 
                                            className={`w-3.5 h-3.5 rounded-sm transition-colors ${getIntensityColor(day.count)} hover:ring-2 hover:ring-brand-500 hover:ring-offset-1 dark:hover:ring-offset-slate-900 cursor-help relative group`}
                                            title={`Day ${day.dayDiff} (${day.date}): ${day.count} sessions completed`}
                                        >
                                            {/* Tooltip hint text specifically showing day number */}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700/60" />
                    <div className="w-3 h-3 rounded-sm bg-brand-200 dark:bg-brand-900/60" />
                    <div className="w-3 h-3 rounded-sm bg-brand-400 dark:bg-brand-700/80" />
                    <div className="w-3 h-3 rounded-sm bg-brand-500 dark:bg-brand-500" />
                    <div className="w-3 h-3 rounded-sm bg-brand-700 dark:bg-brand-400" />
                </div>
                <span>More</span>
            </div>
        </Card>
    );
}
