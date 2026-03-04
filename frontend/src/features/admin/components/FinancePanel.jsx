import React from 'react';
import { useFinanceOverview } from '../hooks/useFinance';
import { Wallet, TrendingUp, CreditCard, PieChart as PieIcon, DollarSign, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 8000 },
];

const FinancePanel = () => {
    const { data: overview, isLoading } = useFinanceOverview();

    if (isLoading) return <div className="text-center p-16 text-text-muted opacity-40">Loading Financial Data...</div>;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold m-0 text-text-main">Finance Control Panel</h2>
                <button className="flex items-center gap-2 bg-bg-card/50 border border-border-custom text-text-main px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-bg-card hover:border-primary cursor-pointer">
                    <Download size={18} /> Export Report
                </button>
            </header>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
                <div className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-[20px] p-6 flex items-center gap-5">
                    <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-[0.85rem] text-text-muted opacity-60 m-0">Total Collected</p>
                        <p className="text-2xl font-bold m-0 mt-1 text-text-main">${overview?.totalRevenue?.toLocaleString() || '0'}</p>
                    </div>
                </div>
                <div className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-[20px] p-6 flex items-center gap-5">
                    <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center bg-orange-500/10 text-orange-500">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[0.85rem] text-text-muted opacity-60 m-0">Pending Dues</p>
                        <p className="text-2xl font-bold m-0 mt-1 text-text-main">${overview?.pendingRevenue?.toLocaleString() || '0'}</p>
                    </div>
                </div>
                <div className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-[20px] p-6 flex items-center gap-5">
                    <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-[0.85rem] text-text-muted opacity-60 m-0">Net Projection</p>
                        <p className="text-2xl font-bold m-0 mt-1 text-text-main">${( (overview?.totalRevenue || 0) + (overview?.pendingRevenue || 0) ).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-3xl p-6">
                <div className="mb-6">
                    <h3 className="text-[1.1rem] font-semibold m-0 text-text-main">Revenue Trend (6 Months)</h3>
                </div>
                <div className="w-full h-[300px]" style={{ position: 'relative', overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-main)' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default FinancePanel;
