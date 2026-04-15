import React, { useState } from 'react';
import { X, DollarSign, Calendar, Info } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function FeeStructureModal({ structure, onClose, onSuccess }) {
  const [form, setForm] = useState(structure ? { ...structure } : {
    academicYear: '2025-26',
    semester: 1,
    tuitionFee: 0,
    libraryFee: 0,
    labFee: 0,
    examinationFee: 0,
    sportsFee: 0,
    hostelFee: 0,
    transportFee: 0,
    developmentFee: 0,
    medicalFee: 0,
    miscellaneous: 0,
    description: '',
    dueDate: 15,
    lateFeePerDay: 50,
    lateFeeStartDate: 5
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const components = [
    { label: 'Tuition Fee', key: 'tuitionFee' },
    { label: 'Library Fee', key: 'libraryFee' },
    { label: 'Lab Fee', key: 'labFee' },
    { label: 'Exam Fee', key: 'examinationFee' },
    { label: 'Sports Fee', key: 'sportsFee' },
    { label: 'Hostel Fee', key: 'hostelFee' },
    { label: 'Transport Fee', key: 'transportFee' },
    { label: 'Development Fee', key: 'developmentFee' },
    { label: 'Medical Fee', key: 'medicalFee' },
    { label: 'Misc Fee', key: 'miscellaneous' },
  ];

  const total = components.reduce((sum, c) => sum + Number(form[c.key] || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (structure?.id) {
        await apiClient.put(`/finance-admin/fee-structures/${structure.id}`, form);
      } else {
        await apiClient.post('/finance-admin/fee-structures', form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save fee structure');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass rounded-3xl border border-border-custom w-full max-w-2xl shadow-2xl my-auto animate-in zoom-in duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-custom bg-white/5 rounded-t-3xl">
          <div>
            <h2 className="font-black text-xl text-text-main uppercase tracking-tight">{structure ? 'Edit' : 'New'} Fee Structure</h2>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mt-1">Template Configuration</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl border border-border-custom hover:bg-rose-500/10 hover:text-rose-400 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-black/10 border border-border-custom/50">
            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block px-1">Academic Year</label>
              <input
                value={form.academicYear}
                onChange={e => handleChange('academicYear', e.target.value)}
                required
                placeholder="2025-26"
                className="w-full bg-transparent border-b border-border-custom px-1 py-1 text-lg font-bold outline-none focus:border-primary transition-all text-text-main"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block px-1">Semester</label>
              <input
                type="number"
                value={form.semester}
                onChange={e => handleChange('semester', Number(e.target.value))}
                required
                min={1}
                className="w-full bg-transparent border-b border-border-custom px-1 py-1 text-lg font-bold outline-none focus:border-primary transition-all text-text-main"
              />
            </div>
          </div>

          {/* Fee Components Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
              <DollarSign size={14} /> Component Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {components.map(comp => (
                <div key={comp.key} className="flex items-center justify-between group">
                  <label className="text-sm font-medium text-text-muted group-hover:text-text-main transition-colors">{comp.label}</label>
                  <div className="flex items-center gap-2 w-32 border-b border-border-custom/30 group-focus-within:border-primary transition-all">
                    <span className="text-xs font-bold text-text-muted opacity-50">₹</span>
                    <input
                      type="number"
                      value={form[comp.key]}
                      onChange={e => handleChange(comp.key, Number(e.target.value))}
                      className="w-full bg-transparent py-1 text-sm font-bold outline-none text-right"
                      min={0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Rules */}
          <div className="flex flex-col md:flex-row gap-8 pt-4">
            <div className="flex-1 space-y-6">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                <Calendar size={14} /> Late Fee Policy
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1.5 block">Penalty / Day</label>
                  <input
                    type="number"
                    value={form.lateFeePerDay}
                    onChange={e => handleChange('lateFeePerDay', Number(e.target.value))}
                    className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1.5 block">Grace Period</label>
                  <input
                    type="number"
                    value={form.lateFeeStartDate}
                    onChange={e => handleChange('lateFeeStartDate', Number(e.target.value))}
                    className="w-full bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 glass-card bg-primary/5 border-primary/20 p-6 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Amount</span>
              <span className="text-3xl font-black text-text-main tabular-nums">₹{total.toLocaleString()}</span>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-text-muted font-bold">
                <Info size={12} className="text-primary" />
                Base structure amount
              </div>
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs font-bold bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 animate-shake">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border border-border-custom font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-3 py-4 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (structure ? 'Update Structure' : 'Create Structure')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
