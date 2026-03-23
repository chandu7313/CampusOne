import { useState, useEffect, useCallback } from 'react';
import { Download, Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Eye } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import ReceiptView from './ReceiptView';

const METHOD_BADGE = {
  Online: 'bg-blue-500/15 text-blue-400',
  UPI: 'bg-violet-500/15 text-violet-400',
  NEFT: 'bg-cyan-500/15 text-cyan-400',
  Cash: 'bg-emerald-500/15 text-emerald-400',
  Cheque: 'bg-amber-500/15 text-amber-400',
  DD: 'bg-orange-500/15 text-orange-400',
};

export default function AdminPaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ from: '', to: '', method: '' });
  const [receiptPayment, setReceiptPayment] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      if (filters.method) params.set('method', filters.method);

      const res = await apiClient.get(`/finance-admin/payments?${params}`);
      setPayments(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-text-muted text-sm mt-0.5">All student fee payment transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl border border-border-custom p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2">
          <span className="text-text-muted text-xs">From</span>
          <input type="date" value={filters.from} onChange={e => { setFilters(f => ({ ...f, from: e.target.value })); setPage(1); }}
            className="bg-transparent text-sm outline-none" />
        </div>
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2">
          <span className="text-text-muted text-xs">To</span>
          <input type="date" value={filters.to} onChange={e => { setFilters(f => ({ ...f, to: e.target.value })); setPage(1); }}
            className="bg-transparent text-sm outline-none" />
        </div>
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2">
          <Filter size={14} className="text-text-muted" />
          <select value={filters.method} onChange={e => { setFilters(f => ({ ...f, method: e.target.value })); setPage(1); }}
            className="bg-transparent text-sm outline-none cursor-pointer">
            <option value="">All Methods</option>
            {['Online', 'UPI', 'NEFT', 'Cash', 'Cheque', 'DD'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <button onClick={fetchPayments} className="p-2 rounded-xl border border-border-custom hover:bg-primary/10 transition-all">
          <RefreshCw size={15} className="text-text-muted" />
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-border-custom overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-custom text-text-muted text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3.5">Student</th>
                <th className="text-left px-5 py-3.5">Transaction ID</th>
                <th className="text-left px-5 py-3.5">Receipt No.</th>
                <th className="text-right px-5 py-3.5">Amount</th>
                <th className="text-left px-5 py-3.5">Method</th>
                <th className="text-left px-5 py-3.5">Date</th>
                <th className="text-center px-5 py-3.5">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16 text-text-muted">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-text-muted">No payments found</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} className="border-b border-border-custom/40 hover:bg-primary/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold">{p.student?.user?.name || '—'}</p>
                    <p className="text-text-muted text-xs">{p.student?.user?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-text-muted">{p.transactionId}</td>
                  <td className="px-5 py-3.5 font-mono text-xs">{p.receiptNumber}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-400">{fmt(p.amountPaid)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${METHOD_BADGE[p.paymentMethod] || 'bg-bg-main/50 text-text-muted'}`}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-muted text-xs">{new Date(p.paymentDate).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button onClick={() => setReceiptPayment(p)} className="p-1.5 rounded-lg hover:bg-blue-500/15 text-blue-400 transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border-custom text-sm text-text-muted">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-border-custom disabled:opacity-30 hover:bg-primary/10 transition-all"><ChevronLeft size={15} /></button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-border-custom disabled:opacity-30 hover:bg-primary/10 transition-all"><ChevronRight size={15} /></button>
            </div>
          </div>
        )}
      </div>

      {receiptPayment && <ReceiptView payment={receiptPayment} onClose={() => setReceiptPayment(null)} />}
    </div>
  );
}
