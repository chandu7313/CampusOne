import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function AssignFeeModal({ onClose, onSuccess }) {
  const [structures, setStructures] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentProfileId: '', feeStructureId: '', totalAmount: '',
    dueDate: '', discountAmount: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get('/finance-admin/fee-structures'),
      apiClient.get('/students?limit=200'),
    ]).then(([fsRes, stRes]) => {
      setStructures(fsRes.data.data || []);
      setStudents(stRes.data.data || []);
    }).catch(() => {});
  }, []);

  // Auto-fill totalAmount from fee structure
  const handleStructureChange = (id) => {
    const fs = structures.find(s => s.id === id);
    if (fs) {
      const total = [fs.tuitionFee, fs.libraryFee, fs.labFee, fs.otherFees]
        .reduce((a, b) => a + Number(b || 0), 0);
      setForm(f => ({ ...f, feeStructureId: id, totalAmount: total.toFixed(2) }));
    } else {
      setForm(f => ({ ...f, feeStructureId: id }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await apiClient.post('/finance-admin/fees/assign', form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign fee');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', extra = {}) => (
    <div>
      <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
        {...extra}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass rounded-2xl border border-border-custom w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom">
          <h2 className="font-bold text-lg">Assign Fee to Student</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 transition-all"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Student</label>
            <select
              value={form.studentProfileId}
              onChange={e => setForm(f => ({ ...f, studentProfileId: e.target.value }))}
              className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">Select student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.user?.name} — {s.rollNumber || s.id.slice(0, 8)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Fee Structure</label>
            <select
              value={form.feeStructureId}
              onChange={e => handleStructureChange(e.target.value)}
              className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">Select fee structure...</option>
              {structures.map(s => (
                <option key={s.id} value={s.id}>{s.academicYear} — Sem {s.semester}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('Total Amount (₹)', 'totalAmount', 'number', { min: 0, step: '0.01', required: true })}
            {field('Discount Amount (₹)', 'discountAmount', 'number', { min: 0, step: '0.01' })}
          </div>
          {field('Due Date', 'dueDate', 'date', { required: true })}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all resize-none"
            />
          </div>
          {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border-custom text-sm hover:bg-primary/5 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all disabled:opacity-60">
              {loading ? 'Assigning...' : 'Assign Fee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
