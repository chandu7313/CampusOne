import React, { useState, useEffect, useCallback } from 'react';
import { Receipt, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Eye, RotateCcw, Download } from 'lucide-react';
import apiClient from '../../../../api/apiClient';
import ReceiptView from '../../pages/ReceiptView';

const METHOD_BADGE = {
  Online: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  UPI: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  NEFT: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Cash: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Cheque: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  DD: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

export default function TransactionsTab({ fmt }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ from: '', to: '', method: '', search: '' });
  const [receiptPayment, setReceiptPayment] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      if (filters.method) params.set('method', filters.method);
      if (filters.search) params.set('studentId', filters.search); // Assuming search is by student for now

      const res = await apiClient.get(`/finance-admin/payments?${params}`);
      setPayments(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleReverse = async (payment) => {
    const reason = window.prompt(`Are you sure you want to REVERSE the payment of ${fmt(payment.amountPaid)} for ${payment.student?.user?.name || 'this student'}?\n\nEnter reason for reversal:`);
    if (!reason) return;
    
    try {
      await apiClient.post(`/finance-admin/payments/${payment.id}/reverse`, { reason });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Reversal failed');
    }
  };

  const handleDownload = (id, receiptNo) => {
    window.open(`${apiClient.defaults.baseURL}/finance-admin/fees/payments/${id}/receipt`, '_blank');
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="glass rounded-2xl border border-border-custom p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom px-3 py-2 rounded-xl flex-1 min-w-[200px]">
          <Search size={14} className="text-text-muted" />
          <input 
            placeholder="Search transaction..." 
            className="bg-transparent text-sm outline-none flex-1 text-text-main"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>
        <div className="flex gap-2">
            <input 
                type="date" 
                className="bg-bg-main/50 border border-border-custom px-3 py-2 rounded-xl text-xs outline-none"
                value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
            />
            <input 
                type="date" 
                className="bg-bg-main/50 border border-border-custom px-3 py-2 rounded-xl text-xs outline-none"
                value={filters.to}
                onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
            />
        </div>
        <select 
            className="bg-bg-main/50 border border-border-custom px-3 py-2 rounded-xl text-xs outline-none"
            value={filters.method}
            onChange={e => setFilters(f => ({ ...f, method: e.target.value }))}
        >
          <option value="">All Methods</option>
          {['Online', 'UPI', 'NEFT', 'Cash', 'Cheque', 'DD'].map(m => <option key={m}>{m}</option>)}
        </select>
        <button onClick={fetchData} className="p-2.5 rounded-xl border border-border-custom hover:border-primary/50 transition-all">
          <RefreshCw size={14} className="text-text-muted" />
        </button>
      </div>

      <div className="glass rounded-2xl border border-border-custom overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-main/30 border-b border-border-custom text-text-muted text-[10px] uppercase font-black tracking-[0.15em]">
                <th className="text-left px-6 py-4">Student</th>
                <th className="text-left px-6 py-4">Ref / Receipt</th>
                <th className="text-right px-6 py-4">Amount</th>
                <th className="text-center px-6 py-4">Method</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-center px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-20 text-text-muted">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-20 text-text-muted font-bold tracking-tight uppercase opacity-30">No transactions recorded</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-border-custom/40 hover:bg-white/5 transition-all group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main leading-tight">{p.student?.user?.name || '—'}</p>
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">{p.student?.registrationNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] font-mono font-bold text-text-muted mb-0.5">{p.transactionId}</p>
                      <p className="text-xs font-bold text-primary">{p.receiptNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-black text-base ${p.isReversed ? 'text-text-muted line-through opacity-50' : 'text-emerald-400'}`}>
                            {fmt(p.amountPaid)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${METHOD_BADGE[p.paymentMethod] || ''}`}>
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-medium text-xs">
                        {new Date(p.paymentDate).toLocaleDateString('en-IN')}<br/>
                        <span className="opacity-50">{new Date(p.paymentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${p.isReversed ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {p.isReversed ? 'Reversed' : 'Success'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setReceiptPayment(p)} title="Quick View" className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-400 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDownload(p.id, p.receiptNumber)} title="Download PDF" className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors">
                          <Download size={16} />
                        </button>
                        {!p.isReversed && (
                          <button onClick={() => handleReverse(p)} title="Reverse Transaction" className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-bg-main/20 border-t border-border-custom text-[10px] font-black uppercase tracking-widest text-text-muted">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl bg-bg-main border border-border-custom disabled:opacity-30 hover:border-primary transition-all"><ChevronLeft size={16} /></button>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl bg-bg-main border border-border-custom disabled:opacity-30 hover:border-primary transition-all"><ChevronRight size={16} /></button>
                </div>
            </div>
        )}
      </div>

      {receiptPayment && <ReceiptView payment={receiptPayment} onClose={() => setReceiptPayment(null)} />}
    </div>
  );
}
