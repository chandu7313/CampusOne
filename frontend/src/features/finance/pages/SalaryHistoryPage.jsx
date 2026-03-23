import { useState, useEffect, useCallback } from 'react';
import { Play, CheckCircle, FileText, ChevronRight, Check } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function SalaryHistoryPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Payslip Expand State
  const [expandedPayrollId, setExpandedPayrollId] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loadingSlips, setLoadingSlips] = useState(false);

  const fetchPayrolls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/finance-admin/payroll?limit=24');
      setPayrolls(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayrolls(); }, [fetchPayrolls]);

  const handleGeneratePayroll = async () => {
    const month = parseInt(prompt('Enter Month (1-12)', new Date().getMonth() + 1));
    const year = parseInt(prompt('Enter Year', new Date().getFullYear()));
    if (!month || !year || month < 1 || month > 12) return alert('Invalid month/year');

    setGenerating(true);
    try {
      await apiClient.post('/finance-admin/payroll/generate', { month, year });
      fetchPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate payroll batch');
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this batch as ${status}?`)) return;
    setProcessingId(id);
    try {
      await apiClient.put(`/finance-admin/payroll/${id}/status`, { status });
      fetchPayrolls();
      if (expandedPayrollId === id) fetchPayslips(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const fetchPayslips = async (payrollId) => {
    setLoadingSlips(true);
    try {
      const res = await apiClient.get(`/finance-admin/payslips/${payrollId}`);
      setPayslips(res.data.data);
    } catch (err) {
      alert('Failed to fetch payslips');
    } finally {
      setLoadingSlips(false);
    }
  };

  const toggleExpand = (id) => {
    if (expandedPayrollId === id) {
      setExpandedPayrollId(null);
      setPayslips([]);
    } else {
      setExpandedPayrollId(id);
      fetchPayslips(id);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const monthName = (n) => new Date(2000, n - 1).toLocaleString('en-IN', { month: 'long' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-amber-500/15 text-amber-500 border border-amber-500/30';
      case 'Processing': return 'bg-blue-500/15 text-blue-500 border border-blue-500/30';
      case 'Approved': return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30';
      case 'Disbursed': return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30';
      default: return 'bg-text-muted/10 text-text-muted border border-border-custom';
    }
  };

  const InlineEditField = ({ payslip, fieldKey, label, readOnly }) => {
    const [val, setVal] = useState(payslip[fieldKey]);
    const [saving, setSaving] = useState(false);

    const onBlur = async () => {
      if (String(val) === String(payslip[fieldKey])) return;
      setSaving(true);
      try {
        await apiClient.put(`/finance-admin/payslips/${payslip.id}`, { [fieldKey]: val });
        setPayslips(prev => prev.map(p => p.id === payslip.id ? { ...p, [fieldKey]: val } : p));
        fetchPayrolls(); // Refresh total batch amounts
      } catch (err) {
        alert('Failed to update field');
        setVal(payslip[fieldKey]);
      } finally {
        setSaving(false);
      }
    };

    if (readOnly) return <span className="text-sm font-mono">{val}</span>;

    return (
      <div className="relative group/field flex items-center">
        {saving && <span className="absolute -left-4 text-xs text-primary animate-pulse">●</span>}
        <input 
          type="number" 
          value={val} 
          onChange={(e) => setVal(e.target.value)}
          onBlur={onBlur}
          className="w-16 bg-black/5 dark:bg-white/5 border border-border-custom px-2 py-1 text-sm outline-none focus:border-primary/50 text-right group-hover/field:border-text-muted transition-colors rounded"
        />
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-end justify-between border-b border-border-custom pb-6">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
            Payroll <span className="text-primary italic font-black">Dashboard</span>
          </h1>
          <p className="text-text-muted text-sm mt-1 font-medium">Batch processing, adjustments, and disbursements.</p>
        </div>
        <button
          onClick={handleGeneratePayroll}
          disabled={generating}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <Play size={16} className={generating ? 'animate-pulse' : ''} /> 
          {generating ? 'Drafting Batch...' : 'Generate New Trial'}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 text-text-muted">Loading Batches...</div>
        ) : payrolls.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl text-text-muted font-medium border border-dashed border-border-custom">
            No payroll batches generated yet. Click Generate New Trial to start.
          </div>
        ) : (
          payrolls.map((batch) => (
            <div key={batch.id} className="glass rounded-2xl border border-border-custom overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Batch Header */}
              <div 
                className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${expandedPayrollId === batch.id ? 'bg-primary/5 border-b border-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                onClick={() => toggleExpand(batch.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="bg-bg-main border border-border-custom rounded-xl p-3 flex flex-col items-center justify-center min-w-[80px]">
                    <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">{batch.year}</span>
                    <span className="text-sm font-black text-primary">{monthName(batch.month)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold font-mono">Run #{batch.id.slice(0, 8)}</h3>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted font-medium mt-1">
                      {batch.employeeCount} Employees
                      {batch.approvedAt && ` • Approved on ${new Date(batch.approvedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">Total Payout</p>
                    <p className="text-2xl font-black font-mono text-emerald-500">{fmt(batch.totalNet)}</p>
                  </div>
                  <ChevronRight size={24} className={`text-text-muted transition-transform ${expandedPayrollId === batch.id ? 'rotate-90 text-primary' : ''}`} />
                </div>
              </div>

              {/* Collapsed Details - Payslips */}
              {expandedPayrollId === batch.id && (
                <div className="p-0 border-t border-border-custom/50 bg-bg-main relative">
                  {/* Status Action Banner */}
                  <div className="p-4 bg-black/5 dark:bg-white/5 border-b border-border-custom/50 flex justify-between items-center text-sm">
                    <p className="font-medium text-text-muted">
                      {batch.status === 'Draft' ? 'Review payslips below and adjust leaves, bonuses, or arrears before approving.' :
                       batch.status === 'Approved' ? 'Payroll is locked. Verify amounts and click Disburse to finalize.' :
                       'This payroll run is completed and locked.'}
                    </p>
                    <div className="flex gap-2">
                      {batch.status === 'Draft' && (
                        <button 
                          disabled={processingId === batch.id}
                          onClick={() => handleStatusUpdate(batch.id, 'Approved')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow transition-colors flex items-center gap-2 text-xs"
                        >
                          <CheckCircle size={14} /> Approve Run
                        </button>
                      )}
                      {batch.status === 'Approved' && (
                        <button 
                          disabled={processingId === batch.id}
                          onClick={() => handleStatusUpdate(batch.id, 'Disbursed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow transition-colors flex items-center gap-2 text-xs"
                        >
                          <Check size={14} /> Disburse Payments
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {loadingSlips ? (
                      <div className="p-8 text-center text-text-muted animate-pulse">Loading payslips...</div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border-custom text-text-muted text-[10px] uppercase font-bold tracking-widest bg-black/5 dark:bg-white/5">
                            <th className="text-left px-5 py-4">Employee</th>
                            <th className="text-right px-5 py-4 bg-primary/5">Base Gross</th>
                            <th className="text-right px-5 py-4 text-emerald-500/80">Bonus (+)</th>
                            <th className="text-right px-5 py-4 text-emerald-500/80">Arrears (+)</th>
                            <th className="text-right px-5 py-4 text-rose-400">Fixed Ded. (-)</th>
                            <th className="text-right px-5 py-4 text-rose-400 border-r border-border-custom/30">Leaves Ded. (-)</th>
                            <th className="text-right px-5 py-4 text-emerald-400 bg-emerald-500/5">Final Net</th>
                            <th className="text-center px-5 py-4">Slip</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payslips.map(slip => {
                            const readOnly = batch.status !== 'Draft';
                            const fixedDed = Number(slip.taxDeduction) + Number(slip.pfDeduction) + Number(slip.otherDeductions);
                            return (
                              <tr key={slip.id} className="border-b border-border-custom/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <td className="px-5 py-3">
                                  <p className="font-bold text-text-main">{slip.employee?.name}</p>
                                  <p className="text-[10px] text-text-muted uppercase tracking-wider">{slip.employee?.role}</p>
                                </td>
                                <td className="px-5 py-3 text-right font-mono bg-primary/5">{fmt(slip.grossSalary - slip.bonus - slip.arrears)}</td>
                                
                                <td className="px-5 py-3 text-right flex justify-end">
                                  <InlineEditField payslip={slip} fieldKey="bonus" readOnly={readOnly} />
                                </td>
                                <td className="px-5 py-3 text-right flex justify-end">
                                  <InlineEditField payslip={slip} fieldKey="arrears" readOnly={readOnly} />
                                </td>
                                
                                <td className="px-5 py-3 text-right font-mono text-rose-400">{fmt(fixedDed)}</td>
                                <td className="px-5 py-3 text-right flex justify-end border-r border-border-custom/30">
                                  <InlineEditField payslip={slip} fieldKey="leaveDeduction" readOnly={readOnly} />
                                </td>
                                
                                <td className="px-5 py-3 text-right font-mono font-black text-emerald-500 bg-emerald-500/5 text-base">{fmt(slip.netSalary)}</td>
                                <td className="px-5 py-3 text-center">
                                  <button title="Print Payslip" onClick={() => alert('PDF generation coming soon!')} className="p-1.5 text-text-muted hover:text-primary transition-colors">
                                    <FileText size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
