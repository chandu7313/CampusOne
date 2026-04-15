import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, Mail, MessageSquare, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import apiClient from '../../../../api/apiClient';

export default function DefaultersTab({ fmt }) {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/finance-admin/reports/defaulters');
      setDefaulters(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Risk Alert Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 glass-card border-rose-500/20 bg-rose-500/5 p-6 flex items-start gap-4">
            <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20 pulse-slow">
                <ShieldAlert size={28} />
            </div>
            <div>
                <h3 className="text-xl font-black text-rose-500 uppercase tracking-tighter italic">Defaulter Risk Alert</h3>
                <p className="text-text-muted text-sm font-medium mt-1">
                    System has flagged <span className="text-rose-400 font-bold">{defaulters.length}</span> students with overdue standing balances. High-priority collection efforts required.
                </p>
            </div>
        </div>
        <div className="glass-card flex items-center justify-between p-6">
            <div className="text-center w-full">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Total Overdue Value</p>
                <p className="text-3xl font-black text-rose-500 tabular-nums">
                    {fmt(defaulters.reduce((s, r) => s + (Number(r.finalAmount) - Number(r.paidAmount)), 0))}
                </p>
            </div>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border-custom overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rose-500/5 border-b border-rose-500/10 text-rose-500 text-[10px] uppercase font-black tracking-[0.2em]">
              <th className="text-left px-6 py-4">Student</th>
              <th className="text-left px-6 py-4">Academic Session</th>
              <th className="text-right px-6 py-4">Outstanding Bal.</th>
              <th className="text-left px-6 py-4">Days Overdue</th>
              <th className="text-center px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-20 text-text-muted">Analyzing records...</td></tr>
            ) : defaulters.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-24 text-text-muted">
                    <p className="font-bold tracking-tight uppercase opacity-30">All accounts cleared – zero defaults</p>
                </td>
              </tr>
            ) : (
                defaulters.map((d) => {
                    const balance = Number(d.finalAmount) - Number(d.paidAmount);
                    const days = Math.floor((new Date() - new Date(d.dueDate)) / (1000 * 60 * 60 * 24));
                    return (
                        <tr key={d.id} className="border-b border-border-custom/40 hover:bg-rose-500/5 transition-all group">
                            <td className="px-6 py-4">
                                <p className="font-bold text-text-main">{d.student?.user?.name || '—'}</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{d.student?.registrationNumber}</p>
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-medium text-xs">{d.feeStructure?.academicYear} • Sem {d.feeStructure?.semester}</p>
                                <p className="text-[10px] text-text-muted">Due: {new Date(d.dueDate).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="font-mono font-black text-rose-500">{fmt(balance)}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 transition-all duration-1000" style={{width: `${Math.min(days, 100)}%`}}></div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-rose-400">{days} Days</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 rounded-xl bg-bg-main border border-border-custom hover:border-primary text-text-muted hover:text-primary transition-all">
                                        <Mail size={16} />
                                    </button>
                                    <button className="p-2 rounded-xl bg-bg-main border border-border-custom hover:border-primary text-text-muted hover:text-primary transition-all">
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
