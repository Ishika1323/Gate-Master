import React, { useMemo } from 'react';
import Card from '../UI/Card';
import { progressCalculator } from '../../services/progressCalculator';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

export default function ScheduleProjectionChart({ currentDay, planProgress, totalDays = 150 }) {
    
    const chartData = useMemo(() => {
        return progressCalculator.getProjectionData(totalDays, planProgress, currentDay);
    }, [totalDays, planProgress, currentDay]);

    const isBehindSchedule = useMemo(() => {
        if (currentDay && currentDay > 0 && chartData[currentDay-1]) {
            const today = chartData[currentDay-1];
            if (today.projected - today.actual > 10) return true;
        }
        return false;
    }, [chartData, currentDay]);

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Completion Projection</h3>
                    <p className="text-sm text-slate-500">Actual vs Expected Syllabus Completion</p>
                </div>
                {isBehindSchedule && (
                    <div className="mt-2 sm:mt-0 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/50 text-sm font-medium">
                        <AlertTriangle size={16} />
                        &gt; 10% Behind Schedule
                    </div>
                )}
            </div>

            <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            tickMargin={10}
                            minTickGap={20}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: 'none', 
                                borderRadius: '8px',
                                color: '#fff' 
                            }} 
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`${value}%`, 'Completion']}
                            labelFormatter={(label) => `Day ${label}`}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                        
                        {/* Expected IDEAL line */}
                        <Line 
                            type="monotone" 
                            dataKey="projected" 
                            name="Projected"
                            stroke="#94a3b8" 
                            strokeWidth={2} 
                            dot={false}
                            strokeDasharray="5 5" 
                            activeDot={false}
                        />

                        {/* ACTUAL progress line */}
                        <Line 
                            type="monotone" 
                            dataKey="actual" 
                            name="Actual"
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            dot={false}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                        />
                        
                        <ReferenceLine x={currentDay} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#f43f5e', fontSize: 12 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
