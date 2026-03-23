import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function InstallmentModal({ fee, onClose, onSuccess }) {
  const [installments, setInstallments] = useState([
    { dueDate: '', amount: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finalAmount = Number(fee?.finalAmount || fee?.totalAmount || 0);
  const allocatedTotal = installments.reduce((s, i) => s + Number(i.amount || 0), 0);
  const remaining = finalAmount - allocatedTotal;

  const updateRow = (idx, key, val) => {
    setInstallments(prev => prev.map((row, i) => i === idx ? { ...row, [key]: val } : row));
  };
  const addRow = () => setInstallments(prev => [...prev, { dueDate: '', amount: '' }]);
  const removeRow = (idx) => setInstallments(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await apiClient.post(`/finance-admin/fees/${fee.id}/installments`, { installments });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create installment plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl border border-border-custom w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
          <div>
            <h2 className="font-bold text-lg">Installment Plan</h2>
            <p className="text-text-muted text-xs mt-0.5">Total: ₹{finalAmount.toLocaleString('en-IN')}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Allocation bar */}
          <div className="bg-bg-main/50 rounded-xl p-3 flex justify-between text-xs">
            <span className="text-emerald-400">Allocated: ₹{allocatedTotal.toLocaleString('en-IN')}</span>
            <span className={remaining < 0 ? 'text-rose-400' : 'text-text-muted'}>
              {remaining < 0 ? `Over by ₹${Math.abs(remaining).toLocaleString('en-IN')}` : `Remaining: ₹${remaining.toLocaleString('en-IN')}`}
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {installments.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-5 text-center">{idx + 1}</span>
                <input
                  type="date"
                  value={row.dueDate}
                  onChange={e => updateRow(idx, 'dueDate', e.target.value)}
                  required
                  className="flex-1 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-all"
                />
                <input
                  type="number"
                  value={row.amount}
                  onChange={e => updateRow(idx, 'amount', e.target.value)}
                  placeholder="₹ Amount"
                  min={1}
                  step="0.01"
                  required
                  className="w-32 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-all"
                />
                {installments.length > 1 && (
                  <button type="button" onClick={() => removeRow(idx)} className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={addRow} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border-custom text-text-muted text-sm hover:border-primary hover:text-primary transition-all">
            <Plus size={14} /> Add Installment
          </button>

          {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border-custom text-sm hover:bg-primary/5 transition-all">Cancel</button>
            <button type="submit" disabled={loading || remaining < 0} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
