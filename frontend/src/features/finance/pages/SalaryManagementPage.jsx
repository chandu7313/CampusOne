import { useState, useEffect, useCallback } from 'react';
import { Users, DollarSign, Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Layers } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import AssignSalaryModal from './AssignSalaryModal';

const ROLE_COLORS = {
  Admin: 'bg-rose-500/15 text-rose-400',
  Faculty: 'bg-blue-500/15 text-blue-400',
  HOD: 'bg-purple-500/15 text-purple-400',
  Staff: 'bg-amber-500/15 text-amber-400',
  Authority: 'bg-indigo-500/15 text-indigo-400'
};

export default function SalaryManagementPage() {
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'templates'
  
  // Data States
  const [employees, setEmployees] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Pagination & Filters (Assignments)
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modals
  const [modal, setModal] = useState(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);

      const res = await apiClient.get(`/finance-admin/employee-salaries?${params}`);
      setEmployees(res.data.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/finance-admin/salary-structures');
      setTemplates(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'assignments') fetchAssignments();
    else fetchTemplates();
  }, [activeTab, fetchAssignments, fetchTemplates]);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Deactivate this grade template? It will no longer be available for new assignments.')) return;
    try {
      await apiClient.delete(`/finance-admin/salary-structures/${id}`);
      fetchTemplates();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const TemplateModal = ({ template, onClose }) => {
    const [formData, setFormData] = useState({
      designation: template?.designation || '',
      roleType: template?.roleType || 'Faculty',
      grade: template?.grade || '',
      basicPay: template?.basicPay || 0,
      hraPercent: template?.hraPercent || 0,
      daPercent: template?.daPercent || 0,
      taPercent: template?.taPercent || 0,
      medicalAllowance: template?.medicalAllowance || 0,
      pfDeductionPercent: template?.pfDeductionPercent || 0,
      taxDeduction: template?.taxDeduction || 0,
      otherDeductions: template?.otherDeductions || 0,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (template?.id) {
          await apiClient.put(`/finance-admin/salary-structures/${template.id}`, formData);
        } else {
          await apiClient.post('/finance-admin/salary-structures', formData);
        }
        onClose();
        fetchTemplates();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to save template');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-bg-main border border-border-custom rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-border-custom/50 flex justify-between items-center bg-black/5 dark:bg-white/5">
            <h2 className="text-xl font-bold">{template ? 'Edit Grade Template' : 'New Grade Template'}</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text-main">✕</button>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <form id="templateForm" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Role Type</label>
                  <select
                    required
                    value={formData.roleType}
                    onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                    <option value="Authority">Authority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Grade (e.g., A1, Sr)</label>
                  <input
                    required
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Designation (Title)</label>
                <input
                  required
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  placeholder="e.g. Senior Professor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Basic Pay (₹)</label>
                  <input
                    required
                    type="number"
                    value={formData.basicPay}
                    onChange={(e) => setFormData({ ...formData, basicPay: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">Medical Allowance (₹)</label>
                  <input
                    type="number"
                    value={formData.medicalAllowance}
                    onChange={(e) => setFormData({ ...formData, medicalAllowance: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">HRA %</label>
                  <input
                    type="number" step="0.01"
                    value={formData.hraPercent}
                    onChange={(e) => setFormData({ ...formData, hraPercent: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">DA %</label>
                  <input
                    type="number" step="0.01"
                    value={formData.daPercent}
                    onChange={(e) => setFormData({ ...formData, daPercent: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold">TA %</label>
                  <input
                    type="number" step="0.01"
                    value={formData.taPercent}
                    onChange={(e) => setFormData({ ...formData, taPercent: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-custom rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold text-rose-400">PF %</label>
                  <input
                    type="number" step="0.01"
                    value={formData.pfDeductionPercent}
                    onChange={(e) => setFormData({ ...formData, pfDeductionPercent: e.target.value })}
                    className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 text-rose-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold text-rose-400">Flat Tax (₹)</label>
                  <input
                    type="number"
                    value={formData.taxDeduction}
                    onChange={(e) => setFormData({ ...formData, taxDeduction: e.target.value })}
                    className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 text-rose-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-bold text-rose-400">Other Ded. (₹)</label>
                  <input
                    type="number"
                    value={formData.otherDeductions}
                    onChange={(e) => setFormData({ ...formData, otherDeductions: e.target.value })}
                    className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 text-rose-400 text-sm"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="p-6 border-t border-border-custom flex justify-end gap-3 bg-black/5 dark:bg-white/5">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button form="templateForm" type="submit" className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">Save Template</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border-custom pb-6">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
            Salary <span className="text-primary italic font-black">Control</span>
          </h1>
          <p className="text-text-muted text-sm mt-1 font-medium">Manage grade templates and employee assignments.</p>
        </div>
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-border-custom">
          <button 
            onClick={() => setActiveTab('assignments')} 
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-bg-main shadow-md text-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            Employee Salaries
          </button>
          <button 
            onClick={() => setActiveTab('templates')} 
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'templates' ? 'bg-bg-main shadow-md text-primary' : 'text-text-muted hover:text-text-main'}`}
          >
            Grade Templates
          </button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2"><Layers size={18} className="text-primary" /> Grade Templates</h2>
            <button onClick={() => setModal({ type: 'template' })} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              <Plus size={14} /> New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(t => (
              <div key={t.id} className="glass rounded-2xl border border-border-custom p-6 relative group overflow-hidden hover:border-primary/50 transition-colors">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal({ type: 'template', data: t })} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20"><Pencil size={14}/></button>
                  <button onClick={() => handleDeleteTemplate(t.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20"><Trash2 size={14}/></button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${ROLE_COLORS[t.roleType]}`}>{t.roleType}</span>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-black/5 dark:bg-white/5 border border-border-custom">Grade {t.grade}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{t.designation}</h3>
                <p className="text-3xl font-black text-text-main mt-4">{fmt(t.basicPay)} <span className="text-xs text-text-muted font-bold uppercase tracking-widest block mt-1">Basic Pay</span></p>
                
                <div className="mt-6 pt-4 border-t border-border-custom/50 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">HRA</span>
                    <span className="font-medium">{t.hraPercent}%</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">DA</span>
                    <span className="font-medium">{t.daPercent}%</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">PF</span>
                    <span className="font-medium text-rose-400">{t.pfDeductionPercent}%</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">Tax Flat</span>
                    <span className="font-medium text-rose-400">{fmt(t.taxDeduction)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {templates.length === 0 && !loading && (
            <div className="glass p-12 text-center rounded-2xl text-text-muted font-medium border border-dashed border-border-custom">
              No Grade Templates found. Create one to start assigning salaries.
            </div>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="glass rounded-2xl border border-border-custom p-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2 flex-1 min-w-[200px]">
              <Search size={15} className="text-text-muted" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search employee name..." className="bg-transparent text-sm outline-none flex-1 font-medium placeholder:text-text-muted/60" />
            </div>
            <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2">
              <Filter size={15} className="text-text-muted" />
              <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
                className="bg-transparent text-sm outline-none cursor-pointer font-medium">
                <option value="">All Roles</option>
                <option value="Faculty">Faculty</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button onClick={fetchAssignments} className="p-2 rounded-xl border border-border-custom hover:bg-primary/10 transition-all text-primary">
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="glass rounded-2xl border border-border-custom overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-custom text-text-muted text-[10px] uppercase font-bold tracking-widest bg-black/5 dark:bg-white/5">
                    <th className="text-left px-5 py-4">Employee</th>
                    <th className="text-left px-5 py-4">Structure</th>
                    <th className="text-right px-5 py-4">Gross</th>
                    <th className="text-right px-5 py-4">Deductions</th>
                    <th className="text-right px-5 py-4">Net Salary</th>
                    <th className="text-left px-5 py-4">Bank Profile</th>
                    <th className="text-center px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-16 text-text-muted">Loading...</td></tr>
                  ) : employees.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-16 text-text-muted">No employees found</td></tr>
                  ) : employees.map(emp => {
                    const sal = emp.salaries?.[0]; // Active assignment
                    return (
                      <tr key={emp.id} className="border-b border-border-custom/40 hover:bg-primary/5 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-text-main">{emp.name}</p>
                          <p className="text-text-muted text-xs font-medium">{emp.email}</p>
                          <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded border border-border-custom ${ROLE_COLORS[emp.role] || 'text-text-muted'}`}>
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {sal ? (
                            <div>
                              <p className="font-bold text-text-main">{sal.structure?.designation || 'Custom'}</p>
                              <p className="text-xs text-text-muted font-medium">Basic: {fmt(sal.basicPay)}</p>
                            </div>
                          ) : <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Unassigned</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-medium text-emerald-400">
                          {sal ? fmt(sal.grossSalary) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-medium text-rose-400">
                          {sal ? fmt((Number(sal.pfDeduction) + Number(sal.taxDeduction) + Number(sal.otherDeductions))) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-black text-text-main text-base">
                          {sal ? fmt(sal.netSalary) : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          {sal?.bankAccount ? (
                            <div>
                              <p className="text-xs font-mono text-text-muted">{sal.bankAccount}</p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{sal.bankName}</p>
                            </div>
                          ) : <span className="text-text-muted text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button 
                            onClick={() => setModal({ type: 'assign', data: emp, templates: templates })}
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-block whitespace-nowrap"
                          >
                            {sal ? 'Override' : 'Assign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border-custom text-sm text-text-muted font-bold">
                <span>Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-border-custom disabled:opacity-30 hover:text-text-main transition-all"><ChevronLeft size={16} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-border-custom disabled:opacity-30 hover:text-text-main transition-all"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'template' && <TemplateModal template={modal.data} onClose={() => setModal(null)} />}
      {modal?.type === 'assign' && <AssignSalaryModal employee={modal.data} templates={templates} onClose={() => setModal(null)} onSuccess={fetchAssignments} />}
    </div>
  );
}
