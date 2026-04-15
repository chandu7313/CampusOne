import React, { useState, useEffect, useCallback } from 'react';
import { Award, CheckCircle, Clock, Search, RefreshCw, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import apiClient from '../../../../api/apiClient';

export default function WaiversTab({ fmt }) {
  const [waivers, setWaivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note: Backend might not have a dedicated List Scholarships endpoint yet,
  // we might need to fetch from a generic endpoint or implement it.
  // For now, let's assume we fetch all Scholarships.
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming we implemented/will implement a GET /scholarships
      const res = await apiClient.get('/finance-admin/scholarships');
      setWaivers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id) => {
    try {
      await apiClient.patch(`/finance-admin/scholarships/${id}/approve`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="p-8 glass rounded-3xl border border-border-custom bg-gradient-to-br from-purple-500/10 to-blue-500/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 p-8 opacity-10">
            <Award size={120} />
        </div>
        <div className="relative z-10">
            <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase italic mb-2">Scholarship Portfolio</h3>
            <p className="text-text-muted text-sm font-medium max-w-lg">
                Manage all institutional waivers and merit-based discounts. Approved amounts are automatically deducted from students' standing balances.
            </p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-border-custom overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-main/30 border-b border-border-custom text-text-muted text-[10px] uppercase font-black tracking-[0.2em]">
              <th className="text-left px-6 py-4">Recipient Student</th>
              <th className="text-left px-6 py-4">Waiver Details</th>
              <th className="text-right px-6 py-4">Amount</th>
              <th className="text-center px-6 py-4">Status</th>
              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-20 text-text-muted">Loading waivers...</td></tr>
            ) : waivers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-24 text-text-muted">
                    <Award size={40} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold tracking-tight uppercase opacity-30">No scholarship records found</p>
                </td>
              </tr>
            ) : (
                waivers.map((w) => (
                    <tr key={w.id} className="border-b border-border-custom/40 hover:bg-white/5 transition-all">
                        <td className="px-6 py-4">
                            <p className="font-bold text-text-main">{w.student?.user?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{w.student?.registrationNumber}</p>
                        </td>
                        <td className="px-6 py-4">
                            <p className="font-bold text-text-main text-xs">{w.name}</p>
                            <span className="text-[9px] bg-bg-main px-1.5 py-0.5 rounded border border-border-custom text-text-muted font-bold uppercase tracking-tighter">{w.type}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <span className="font-mono font-black text-purple-400">{fmt(w.amount)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                                w.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5'
                            }`}>
                                {w.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                            {w.status === 'Pending' ? (
                                <button 
                                    onClick={() => handleApprove(w.id)}
                                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Approve
                                </button>
                            ) : (
                                <span className="text-emerald-500/50 flex items-center justify-center gap-1.5 text-[10px] font-bold italic">
                                    <CheckCircle size={14} /> Confirmed
                                </span>
                            )}
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
