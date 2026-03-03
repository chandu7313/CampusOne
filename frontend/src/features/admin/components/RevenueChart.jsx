import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data }) => {
    return (
        <div className="glass rounded-[20px] h-[350px] p-5">
            <h3 className="text-[1.1rem] font-semibold text-text-main">Revenue Trends</h3>
            <div className="w-full h-[280px] mt-2.5">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data || []}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                        <XAxis 
                            dataKey="month" 
                            stroke="var(--text-muted)" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="var(--text-muted)" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value/1000}k`}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--bg-card)', 
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--text-main)'
                            }}
                            itemStyle={{ color: 'var(--text-main)' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
