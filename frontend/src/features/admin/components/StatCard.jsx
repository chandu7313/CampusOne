import React from 'react';

const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
    amber: 'bg-amber-500/10 text-amber-500'
};

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    return (
        <div className="glass bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 min-w-[240px] hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl group">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colorStyles[color] || colorStyles.blue}`}>
                <Icon size={24} />
            </div>
            <div className="flex flex-col">
                <p className="text-white/60 text-sm font-medium m-0">{title}</p>
                <h3 className="text-white text-[28px] font-bold my-1 leading-tight">{value?.toLocaleString() || '0'}</h3>
                {trend && (
                    <p className={`text-xs font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend > 0 ? '+' : ''}{trend}% from last month
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
