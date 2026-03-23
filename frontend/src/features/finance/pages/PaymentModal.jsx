import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function PaymentModal({ fee, installment, onClose, onSuccess }) {
  const finalAmount = Number(fee?.finalAmount || fee?.totalAmount || 0);
  const remaining = Math.max(0, finalAmount - Number(fee?.paidAmount || 0));

  const [form, setForm] = useState({
    studentFeeId: fee.id,
    amount: installment?.amount || remaining,
    paymentMethod: 'Online',
    notes: '',
    installmentId: installment?.id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await apiClient.post('/finance-admin/fees/pay', form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl border border-border-custom w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            <h2 className="font-bold text-lg">Pay Fee</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Balance summary */}
          <div className="bg-bg-main/50 border border-border-custom rounded-xl p-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Total Fee</span><span>₹{finalAmount.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Paid</span><span className="text-emerald-400">₹{Number(fee.paidAmount).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-bold"><span>Outstanding</span><span className="text-amber-400">₹{remaining.toLocaleString('en-IN')}</span></div>
          </div>

          {installment && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm">
              <span className="text-text-muted">Installment {installment.installmentNumber}:</span>
              <span className="font-semibold ml-2">₹{Number(installment.amount).toLocaleString('en-IN')}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              max={remaining}
              min={1}
              step="0.01"
              required
              className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
              className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option>Online</option>
              <option>UPI</option>
              <option>NEFT</option>
              <option>Cash</option>
              <option>Cheque</option>
              <option>DD</option>
            </select>
          </div>

          {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border-custom text-sm hover:bg-primary/5 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all disabled:opacity-60">
              {loading ? 'Processing...' : `Pay ₹${Number(form.amount || 0).toLocaleString('en-IN')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
