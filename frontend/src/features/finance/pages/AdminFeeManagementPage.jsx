import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Users, Clock, Award, Plus, Pencil, Trash2, ListChecks, Search, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import apiClient from '../../../api/apiClient';
import AssignFeeModal from './AssignFeeModal';
import InstallmentModal from './InstallmentModal';
import ScholarshipModal from './ScholarshipModal';

const STATUS_COLORS = {
  Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Partial: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Pending: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="glass rounded-2xl p-5 flex items-start gap-4 border border-border-custom">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-0.5">{value}</p>
      {sub && <p className="text-text-muted text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function AdminFeeManagementPage() {
  const [fees, setFees] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modal, setModal] = useState(null); // { type: 'assign' | 'installment' | 'scholarship', data? }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const [feesRes, overviewRes] = await Promise.all([
        apiClient.get(`/finance-admin/fees?${params}`),
        apiClient.get('/finance-admin/overview'),
      ]);

      setFees(feesRes.data.data);
      setTotalPages(feesRes.data.totalPages || 1);
      setOverview(overviewRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fee record?')) return;
    try {
      await apiClient.delete(`/finance-admin/fees/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fee Management</h1>
          <p className="text-text-muted text-sm mt-0.5">Assign, track, and manage student fees</p>
        </div>
        <button
          onClick={() => setModal({ type: 'assign' })}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all cursor-pointer"
        >
          <Plus size={16} /> Assign Fee
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={fmt(overview.totalRevenue)} color="bg-emerald-600" />
        <StatCard icon={Clock} label="Pending Dues" value={fmt(overview.pendingRevenue)} color="bg-amber-600" />
        <StatCard icon={Users} label="Fee Records" value={overview.totalStudents || 0} sub="students enrolled" color="bg-blue-600" />
        <StatCard icon={Award} label="Scholarships" value={fmt(overview.totalScholarships)} color="bg-purple-600" />
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl border border-border-custom p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search size={15} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search student name..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-text-muted/60"
          />
        </div>
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2">
          <Filter size={15} className="text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-transparent text-sm outline-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <button onClick={fetchData} className="p-2 rounded-xl border border-border-custom hover:bg-primary/10 transition-all">
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
                <th className="text-left px-5 py-3.5">Program / Semester</th>
                <th className="text-right px-5 py-3.5">Total</th>
                <th className="text-right px-5 py-3.5">Paid</th>
                <th className="text-right px-5 py-3.5">Pending</th>
                <th className="text-left px-5 py-3.5">Due Date</th>
                <th className="text-left px-5 py-3.5">Status</th>
                <th className="text-center px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16 text-text-muted">Loading...</td></tr>
              ) : fees.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-text-muted">No fee records found</td></tr>
              ) : (
                fees.map((fee) => {
                  const final = Number(fee.finalAmount || fee.totalAmount);
                  const pending = Math.max(0, final - Number(fee.paidAmount));
                  return (
                    <tr key={fee.id} className="border-b border-border-custom/40 hover:bg-primary/5 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold">{fee.student?.user?.name || '—'}</p>
                        <p className="text-text-muted text-xs">{fee.student?.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p>{fee.feeStructure?.academicYear || '—'}</p>
                        <p className="text-text-muted text-xs">Sem {fee.feeStructure?.semester}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono">{fmt(final)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-emerald-400">{fmt(fee.paidAmount)}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-amber-400">{fmt(pending)}</td>
                      <td className="px-5 py-3.5 text-text-muted">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[fee.status] || ''}`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setModal({ type: 'installment', data: fee })}
                            title="Installments"
                            className="p-1.5 rounded-lg hover:bg-blue-500/15 text-blue-400 transition-colors"
                          >
                            <ListChecks size={15} />
                          </button>
                          <button
                            onClick={() => setModal({ type: 'scholarship', data: fee })}
                            title="Apply Scholarship"
                            className="p-1.5 rounded-lg hover:bg-purple-500/15 text-purple-400 transition-colors"
                          >
                            <Award size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(fee.id)}
                            title="Delete"
                            className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-400 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border-custom text-sm text-text-muted">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-border-custom disabled:opacity-30 hover:bg-primary/10 transition-all">
                <ChevronLeft size={15} />
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-border-custom disabled:opacity-30 hover:bg-primary/10 transition-all">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'assign' && (
        <AssignFeeModal onClose={() => setModal(null)} onSuccess={fetchData} />
      )}
      {modal?.type === 'installment' && (
        <InstallmentModal fee={modal.data} onClose={() => setModal(null)} onSuccess={fetchData} />
      )}
      {modal?.type === 'scholarship' && (
        <ScholarshipModal fee={modal.data} onClose={() => setModal(null)} onSuccess={fetchData} />
      )}
    </div>
  );
}
