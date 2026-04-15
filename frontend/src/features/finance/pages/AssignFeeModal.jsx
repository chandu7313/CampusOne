import { useState, useEffect } from 'react';
import { X, Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function AssignFeeModal({ onClose, onSuccess }) {
  const [structures, setStructures] = useState([]);
  const [students, setStudents] = useState([]);
  const [showOverride, setShowOverride] = useState(false);
  const [form, setForm] = useState({
    studentProfileId: '',
    feeStructureId: '',
    academicYear: '2025-26',
    semester: 1,
    totalAmount: 0,
    dueDate: '',
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
    discountAmount: 0,
    discountReason: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const components = [
    { label: 'Tuition', key: 'tuitionFee' },
    { label: 'Library', key: 'libraryFee' },
    { label: 'Lab', key: 'labFee' },
    { label: 'Exam', key: 'examinationFee' },
    { label: 'Sports', key: 'sportsFee' },
    { label: 'Hostel', key: 'hostelFee' },
    { label: 'Transport', key: 'transportFee' },
    { label: 'Development', key: 'developmentFee' },
    { label: 'Medical', key: 'medicalFee' },
    { label: 'Misc', key: 'miscellaneous' },
  ];

  useEffect(() => {
    Promise.all([
      apiClient.get('/finance-admin/fee-structures'),
      apiClient.get('/students?limit=500'),
    ]).then(([fsRes, stRes]) => {
      setStructures(fsRes.data.data || []);
      setStudents(stRes.data.data || []);
    }).catch(() => {});
  }, []);

  // Update total whenever components or discount change
  useEffect(() => {
    const sum = components.reduce((acc, c) => acc + Number(form[c.key] || 0), 0);
    setForm(f => ({ ...f, totalAmount: Math.max(0, sum - Number(f.discountAmount || 0)) }));
  }, [form.tuitionFee, form.libraryFee, form.labFee, form.examinationFee, form.sportsFee, form.hostelFee, form.transportFee, form.developmentFee, form.medicalFee, form.miscellaneous, form.discountAmount]);

  const handleStructureChange = (id) => {
    const fs = structures.find(s => s.id === id);
    if (fs) {
      setForm(f => ({
        ...f,
        feeStructureId: id,
        academicYear: fs.academicYear,
        semester: fs.semester,
        tuitionFee: fs.tuitionFee,
        libraryFee: fs.libraryFee,
        labFee: fs.labFee,
        examinationFee: fs.examinationFee,
        sportsFee: fs.sportsFee,
        hostelFee: fs.hostelFee,
        transportFee: fs.transportFee,
        developmentFee: fs.developmentFee,
        medicalFee: fs.medicalFee,
        miscellaneous: fs.miscellaneous,
      }));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass rounded-3xl border border-border-custom w-full max-w-xl shadow-2xl my-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-custom">
            <div>
                <h2 className="font-black text-xl text-text-main uppercase tracking-tight">Assign Student Fee</h2>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Individual Enrollment</p>
            </div>
          <button onClick={onClose} className="p-2 rounded-xl border border-border-custom hover:bg-rose-500/10 transition-all"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Select Student</label>
                <select
                    value={form.studentProfileId}
                    onChange={e => setForm(f => ({ ...f, studentProfileId: e.target.value }))}
                    className="w-full bg-bg-main/50 border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                >
                    <option value="">Choose a student...</option>
                    {students.map(s => (
                        <option key={s.id} value={s.id}>{s.user?.name} — {s.registrationNumber}</option>
                    ))}
                </select>
            </div>

            <div className="md:col-span-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Fee Template (Structure)</label>
                <select
                    value={form.feeStructureId}
                    onChange={e => handleStructureChange(e.target.value)}
                    className="w-full bg-bg-main/50 border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                >
                    <option value="">Select a template...</option>
                    {structures.map(s => (
                        <option key={s.id} value={s.id}>{s.academicYear} — Semester {s.semester}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Due Date</label>
                <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full bg-bg-main/50 border border-border-custom rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary"
                    required
                />
            </div>

            <div className="flex items-end">
                <button 
                    type="button" 
                    onClick={() => setShowOverride(!showOverride)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border-custom text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                    {showOverride ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {showOverride ? 'Hide' : 'Manual'} Overrides
                </button>
            </div>
          </div>

          {showOverride && (
            <div className="p-4 rounded-2xl bg-black/20 border border-border-custom/50 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                    <Calculator size={12} /> Component Adjustment
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {components.map(comp => (
                        <div key={comp.key} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-text-muted uppercase">{comp.label}</span>
                            <input 
                                type="number"
                                value={form[comp.key]}
                                onChange={e => setForm(f => ({ ...f, [comp.key]: Number(e.target.value) }))}
                                className="w-20 bg-transparent border-b border-border-custom/30 text-right text-xs font-black outline-none focus:border-primary"
                            />
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div className="glass-card bg-primary/5 border-primary/20 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Final Calculated Fee</p>
                    <p className="text-3xl font-black text-text-main tabular-nums tracking-tighter">₹{form.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Recalculated</p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-tighter italic">Precision OK</span>
                </div>
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs font-bold bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{error}</p>}

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl border border-border-custom font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-2 py-4 rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary-hover transition-all disabled:opacity-50">
              {loading ? 'Processing...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
