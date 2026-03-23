import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function ScholarshipModal({ fee, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', amount: '', type: 'Merit' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await apiClient.post(`/finance-admin/fees/${fee.id}/scholarships`, form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply scholarship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl border border-border-custom w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
          <h2 className="font-bold text-lg">Apply Scholarship / Discount</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Scholarship Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Merit Scholarship 2025"
              className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                required
                min={1}
                step="0.01"
                className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option>Merit</option>
                <option>Need-Based</option>
                <option>Sports</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border-custom text-sm hover:bg-primary/5 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all disabled:opacity-60">
              {loading ? 'Applying...' : 'Apply Scholarship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
