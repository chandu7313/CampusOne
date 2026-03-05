import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const DepartmentDistribution = ({ data = [] }) => {
    return (
        <div className="glass rounded-[20px] h-[350px] p-5 mt-5">
            <h3 className="text-[1.1rem] font-semibold text-text-main">Departmental Distribution</h3>
            <div className="w-full h-[280px]" style={{ position: 'relative', overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
                {(!data || data.length === 0) ? (
                    <div className="w-full h-full flex items-center justify-center text-text-muted opacity-40">
                        No departmental data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="department"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-main)'
                                }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default DepartmentDistribution;
