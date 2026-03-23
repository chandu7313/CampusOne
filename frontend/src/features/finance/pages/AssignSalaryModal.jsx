import { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';

export default function AssignSalaryModal({ employee, templates = [], onClose, onSuccess }) {
  const activeAssignment = employee?.salaries?.[0]; // Current active EmployeeSalary
  
  const [formData, setFormData] = useState({
    userId: employee?.id,
    salaryStructureId: activeAssignment?.salaryStructureId || '',
    basicPay: activeAssignment?.basicPay || 0,
    hra: activeAssignment?.hra || 0,
    da: activeAssignment?.da || 0,
    ta: activeAssignment?.ta || 0,
    medicalAllowance: activeAssignment?.medicalAllowance || 0,
    pfDeduction: activeAssignment?.pfDeduction || 0,
    taxDeduction: activeAssignment?.taxDeduction || 0,
    otherDeductions: activeAssignment?.otherDeductions || 0,
    bankAccount: activeAssignment?.bankAccount || '',
    bankName: activeAssignment?.bankName || '',
    ifscCode: activeAssignment?.ifscCode || '',
    effectiveFrom: activeAssignment?.effectiveFrom || new Date().toISOString().split('T')[0],
    remarks: '',
    revisionType: 'correction',
  });

  const [loading, setLoading] = useState(false);

  // When a template is selected, auto-calculate the flat values
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const t = templates.find((t) => t.id === templateId);

    if (t) {
      const basic = Number(t.basicPay || 0);
      setFormData((prev) => ({
        ...prev,
        salaryStructureId: templateId,
        basicPay: basic,
        hra: (Number(t.hraPercent || 0) / 100) * basic,
        da: (Number(t.daPercent || 0) / 100) * basic,
        ta: (Number(t.taPercent || 0) / 100) * basic,
        medicalAllowance: Number(t.medicalAllowance || 0),
        pfDeduction: (Number(t.pfDeductionPercent || 0) / 100) * basic,
        taxDeduction: Number(t.taxDeduction || 0),
        otherDeductions: Number(t.otherDeductions || 0),
      }));
    } else {
      setFormData((prev) => ({ ...prev, salaryStructureId: '' }));
    }
  };

  // Recalculate auto-percentages if someone manually edits base pay but keeps the same template
  const handleBasePayChange = (e) => {
    const basic = Number(e.target.value);
    setFormData((prev) => {
      let updates = { basicPay: basic };
      if (prev.salaryStructureId) {
        const t = templates.find(temp => temp.id === prev.salaryStructureId);
        if (t) {
          updates.hra = (Number(t.hraPercent || 0) / 100) * basic;
          updates.da = (Number(t.daPercent || 0) / 100) * basic;
          updates.ta = (Number(t.taPercent || 0) / 100) * basic;
          updates.pfDeduction = (Number(t.pfDeductionPercent || 0) / 100) * basic;
        }
      }
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.salaryStructureId) return alert('Please select a Grade Template');
    
    setLoading(true);
    try {
      await apiClient.post('/finance-admin/employee-salaries/assign', formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign salary');
    } finally {
      setLoading(false);
    }
  };

  const gross =
    Number(formData.basicPay || 0) +
    Number(formData.hra || 0) +
    Number(formData.da || 0) +
    Number(formData.ta || 0) +
    Number(formData.medicalAllowance || 0);

  const totalDed =
    Number(formData.pfDeduction || 0) +
    Number(formData.taxDeduction || 0) +
    Number(formData.otherDeductions || 0);

  const net = Math.max(0, gross - totalDed);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-bg-main border border-border-custom rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-border-custom flex justify-between items-center bg-black/5 dark:bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-text-main">
              {activeAssignment ? 'Override Employee Salary' : 'Assign Employee Salary'}
            </h2>
            <p className="text-sm font-medium text-text-muted">
              {employee?.name} • {employee?.role}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form id="assignForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Template Selection */}
            <div className="glass p-5 rounded-2xl border border-primary/20 bg-primary/5">
              <label className="block text-xs uppercase tracking-wider text-primary font-black mb-2">Select Grade Template</label>
              <select
                required
                value={formData.salaryStructureId}
                onChange={handleTemplateChange}
                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-bold shadow-inner"
              >
                <option value="">-- Choose a Grade Template --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.designation} (Grade {t.grade}) - Basic: {fmt(t.basicPay)}
                  </option>
                ))}
              </select>
              <p className="text-xs font-medium text-text-muted mt-2">
                Selecting a template will auto-calculate HRA, DA, TA, and PF based on the template percentages and Basic Pay.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Earnings */}
              <div className="space-y-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-main border-b border-border-custom pb-2">
                  Earnings
                </h3>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Basic Pay (₹)</label>
                  <input
                    required type="number"
                    value={formData.basicPay}
                    onChange={handleBasePayChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">HRA (₹)</label>
                    <input type="number" value={formData.hra} onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">DA (₹)</label>
                    <input type="number" value={formData.da} onChange={(e) => setFormData({ ...formData, da: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">TA (₹)</label>
                    <input type="number" value={formData.ta} onChange={(e) => setFormData({ ...formData, ta: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Medical (₹)</label>
                    <input type="number" value={formData.medicalAllowance} onChange={(e) => setFormData({ ...formData, medicalAllowance: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm font-mono" />
                  </div>
                </div>
              </div>

              {/* Right Column: Deductions & Bank */}
              <div className="space-y-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-main border-b border-border-custom pb-2">
                  Deductions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-rose-400 mb-1 font-bold">PF (₹)</label>
                    <input type="number" value={formData.pfDeduction} onChange={(e) => setFormData({ ...formData, pfDeduction: e.target.value })}
                      className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 text-sm font-mono text-rose-400" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-rose-400 mb-1 font-bold">Tax (₹)</label>
                    <input type="number" value={formData.taxDeduction} onChange={(e) => setFormData({ ...formData, taxDeduction: e.target.value })}
                      className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 text-sm font-mono text-rose-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-rose-400 mb-1 font-bold">Other Deductions (₹)</label>
                  <input type="number" value={formData.otherDeductions} onChange={(e) => setFormData({ ...formData, otherDeductions: e.target.value })}
                    className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 text-sm font-mono text-rose-400" />
                </div>

                <h3 className="text-sm font-black uppercase tracking-widest text-text-main border-b border-border-custom pb-2 mt-8 pt-4">
                  Bank Details
                </h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Bank Account Number" value={formData.bankAccount} onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 font-mono" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Bank Name" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                    
                    <input type="text" placeholder="IFSC Code" value={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 font-mono uppercase" />
                  </div>
                </div>

                {activeAssignment && (
                  <div className="mt-8">
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold text-amber-500">Reason for Update (Revision Type)</label>
                    <select
                      value={formData.revisionType}
                      onChange={(e) => setFormData({ ...formData, revisionType: e.target.value })}
                      className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-amber-500 text-sm font-bold text-amber-500"
                    >
                      <option value="correction">Correction</option>
                      <option value="annual_increment">Annual Increment</option>
                      <option value="promotion">Promotion</option>
                      <option value="pay_commission">Pay Commission</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Live Calculation Footer */}
        <div className="p-6 border-t border-border-custom bg-black/5 dark:bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 rounded-b-2xl">
          <div className="flex gap-8">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1">Gross Pay</span>
              <span className="text-xl font-mono font-black text-text-main">{fmt(gross)}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1 text-rose-400">Total Deductions</span>
              <span className="text-xl font-mono font-black text-rose-400">-{fmt(totalDed)}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-500 mb-1">Net Salary Payload</span>
              <span className="text-2xl font-mono font-black text-emerald-500">{fmt(net)}</span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={onClose} disabled={loading} className="px-6 py-3 rounded-xl font-bold bg-bg-main border border-border-custom hover:border-text-muted transition-colors text-sm w-full md:w-auto">
              Cancel
            </button>
            <button form="assignForm" type="submit" disabled={loading} className="px-6 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all w-full md:w-auto disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Saving...' : (activeAssignment ? 'Update Record' : 'Assign Salary')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
