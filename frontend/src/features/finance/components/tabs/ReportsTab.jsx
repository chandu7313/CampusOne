import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import apiClient from '../../../../api/apiClient';

export default function ReportsTab({ fmt }) {
  const [reportData, setReportData] = useState({ totalCollection: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/finance-admin/reports/collection')
      .then(res => setReportData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-blue-500/5">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary text-white rounded-2xl">
                    <TrendingUp size={24} />
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">+12% vs LY</span>
            </div>
            <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">MTD Collection</p>
            <p className="text-4xl font-black text-text-main tabular-nums tracking-tighter">{fmt(reportData.totalCollection)}</p>
        </div>

        <div className="glass-card p-8 border-amber-500/20 bg-amber-500/5">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-amber-500 text-white rounded-2xl">
                    <BarChart3 size={24} />
                </div>
            </div>
            <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Projected Revenue</p>
            <p className="text-4xl font-black text-text-main tabular-nums tracking-tighter">₹84.5L</p>
        </div>

        <div className="glass-card p-8 border-indigo-500/20 bg-indigo-500/5">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-500 text-white rounded-2xl">
                    <PieChart size={24} />
                </div>
            </div>
            <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Collection Efficiency</p>
            <p className="text-4xl font-black text-text-main tabular-nums tracking-tighter">92.4%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl border border-border-custom p-8 min-h-[400px] flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-black text-text-main uppercase tracking-tight mb-2">Collection Distribution</h3>
                <p className="text-text-muted text-xs font-medium mb-8">Breakdown of revenue across different fee heads.</p>
                
                <div className="space-y-6">
                    {[
                        { label: 'Tuition Fees', val: 75, color: 'bg-primary' },
                        { label: 'Hostel & Transport', val: 15, color: 'bg-indigo-500' },
                        { label: 'Lab & Examination', val: 8, color: 'bg-purple-500' },
                        { label: 'Miscellaneous', val: 2, color: 'bg-amber-500' },
                    ].map(item => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest px-1">
                                <span className="text-text-muted">{item.label}</span>
                                <span className="text-text-main">{item.val}%</span>
                            </div>
                            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{width: `${item.val}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="w-full py-4 mt-8 rounded-2xl border border-border-custom hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-main">
                <Download size={16} /> Download Full Summary
            </button>
        </div>

        <div className="glass rounded-3xl border border-border-custom p-8 bg-black/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-black text-text-main uppercase tracking-tight mb-2">Quarterly Projection</h3>
            <p className="text-text-muted text-sm font-medium max-w-sm mb-8 leading-relaxed">
                Aggregated collection data suggests a <span className="text-emerald-400 font-bold">5.8% increase</span> in realized revenue compared to Q1 2024.
            </p>
            <div className="flex gap-4">
                <div className="px-6 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary font-black text-xs uppercase tracking-widest">Q2 Forecast</div>
                <div className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-text-muted font-black text-xs uppercase tracking-widest italic">View Trend</div>
            </div>
        </div>
      </div>
    </div>
  );
}
