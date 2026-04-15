import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Users, Clock, Award, Plus, Pencil, Trash2, ListChecks, Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Layers, FileText, Receipt, ShieldAlert, BarChart3, Settings } from 'lucide-react';
import apiClient from '../../../api/apiClient';

// Dummy modest components for tabs; extending existing logic where possible.
import AssignFeeModal from './AssignFeeModal';
import InstallmentModal from './InstallmentModal';
import ScholarshipModal from './ScholarshipModal';
import FeeStructureModal from './FeeStructureModal';

// High-fidelity tab components
import FeeStructuresTab from '../components/tabs/FeeStructuresTab';
import TransactionsTab from '../components/tabs/TransactionsTab';
import WaiversTab from '../components/tabs/WaiversTab';
import DefaultersTab from '../components/tabs/DefaultersTab';
import ReportsTab from '../components/tabs/ReportsTab';

const STATUS_COLORS = {
  Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Partial: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Pending: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Overdue: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  Reversed: 'bg-red-500/15 text-red-500 border-red-500/30'
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="glass rounded-2xl p-6 flex flex-col justify-between border border-border-custom relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 blur-2xl ${color} group-hover:scale-150 transition-transform duration-500`}></div>
    <div className="flex items-start justify-between relative z-10 w-full mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-extrabold text-text-main drop-shadow-sm">{value}</h3>
      {sub && <p className="text-text-muted text-xs mt-2 font-medium">{sub}</p>}
    </div>
  </div>
);

// --- TAB COMPONENTS ---

const OverviewTab = ({ overview, fmt }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
    <StatCard icon={DollarSign} label="Total Collection" value={fmt(overview.totalRevenue)} color="from-emerald-500 to-emerald-700" />
    <StatCard icon={Clock} label="Pending Dues" value={fmt(overview.pendingRevenue)} color="from-amber-400 to-amber-600" />
    <StatCard icon={Users} label="Enrolled Students" value={overview.totalStudents || 0} sub="Active fee records" color="from-blue-500 to-blue-700" />
    <StatCard icon={Award} label="Total Waivers" value={fmt(overview.totalScholarships)} color="from-purple-500 to-purple-700" />
  </div>
);

const StudentFeesTab = ({ fees, loading, fmt, fetchData, setModal, handleDelete, page, setPage, totalPages, search, setSearch, statusFilter, setStatusFilter }) => (
  <div className="space-y-4 animate-fade-in-up">
    <div className="glass rounded-2xl border border-border-custom p-4 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-3 flex-1">
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-4 py-2 flex-1 max-w-sm focus-within:border-primary/50 transition-colors">
          <Search size={16} className="text-text-muted" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search student..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-text-muted/60 text-text-main"
          />
        </div>
        <div className="flex items-center gap-2 bg-bg-main/50 border border-border-custom rounded-xl px-3 py-2">
          <Filter size={16} className="text-text-muted" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-transparent text-sm outline-none cursor-pointer text-text-main">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={fetchData} className="p-2.5 rounded-xl border border-border-custom hover:bg-primary/10 transition-all group">
          <RefreshCw size={16} className="text-text-muted group-hover:rotate-180 transition-transform duration-500" />
        </button>
        <button onClick={() => setModal({ type: 'assign' })} className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Assign Fee
        </button>
      </div>
    </div>

    <div className="glass rounded-2xl border border-border-custom overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-main/30 border-b border-border-custom text-text-muted text-xs uppercase tracking-wider font-semibold">
              <th className="text-left px-6 py-4">Student</th>
              <th className="text-left px-6 py-4">Program</th>
              <th className="text-right px-6 py-4">Total</th>
              <th className="text-right px-6 py-4">Paid</th>
              <th className="text-right px-6 py-4">Pending</th>
              <th className="text-left px-6 py-4">Due Date</th>
              <th className="text-center px-6 py-4">Status</th>
              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-20 text-text-muted"><RefreshCw className="animate-spin inline-block mr-2"/> Loading...</td></tr>
            ) : fees.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-20 text-text-muted font-medium">No records found</td></tr>
            ) : (
              fees.map((fee) => {
                const final = Number(fee.finalAmount || fee.totalAmount);
                const pending = Math.max(0, final - Number(fee.paidAmount));
                return (
                  <tr key={fee.id} className="border-b border-border-custom/40 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main">{fee.student?.user?.name || '—'}</p>
                      <p className="text-text-muted text-xs font-medium">{fee.student?.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-text-main">{fee.feeStructure?.academicYear || '—'}</p>
                      <p className="text-text-muted text-xs badge inline-block mt-1">Sem {fee.feeStructure?.semester}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">{fmt(final)}</td>
                    <td className="px-6 py-4 text-right font-mono text-emerald-400 font-bold">{fmt(fee.paidAmount)}</td>
                    <td className="px-6 py-4 text-right font-mono text-amber-500 font-bold">{fmt(pending)}</td>
                    <td className="px-6 py-4 text-text-muted font-medium">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${STATUS_COLORS[fee.status] || ''}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setModal({ type: 'installment', data: fee })} title="Installments" className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors">
                          <ListChecks size={16} />
                        </button>
                        <button onClick={() => setModal({ type: 'scholarship', data: fee })} title="Waivers" className="p-2 rounded-lg hover:bg-purple-500/20 text-purple-400 transition-colors">
                          <Award size={16} />
                        </button>
                        <button onClick={() => handleDelete(fee.id)} title="Delete" className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors">
                          <Trash2 size={16} />
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-bg-main/20 border-t border-border-custom text-sm font-medium text-text-muted">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl bg-bg-main border border-border-custom disabled:opacity-30 hover:bg-white/10 hover:text-white transition-all"><ChevronLeft size={16} /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl bg-bg-main border border-border-custom disabled:opacity-30 hover:bg-white/10 hover:text-white transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  </div>
);

const PlaceHolderTab = ({ title, icon: Icon, desc }) => (
  <div className="glass rounded-2xl border border-border-custom p-16 flex flex-col items-center justify-center text-center animate-fade-in-up">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <Icon size={40} className="text-primary opacity-80" />
    </div>
    <h3 className="text-2xl font-bold text-text-main mb-2">{title}</h3>
    <p className="text-text-muted max-w-md">{desc}</p>
    <button className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors">
      Configure {title}
    </button>
  </div>
);

// --- MAIN PAGE ---

export default function AdminFeeManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [fees, setFees] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modal, setModal] = useState(null);

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'structures', label: 'Fee Structures', icon: Layers },
    { id: 'assign', label: 'Student Fees', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'waivers', label: 'Waivers', icon: Award },
    { id: 'defaulters', label: 'Defaulters', icon: ShieldAlert },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2 animate-fade-in-down">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <DollarSign size={14} /> Finance Module
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-muted mb-2 tracking-tight">
            Fee Management
          </h1>
          <p className="text-text-muted text-sm font-medium max-w-xl">
            Complete financial oversight. Create robust structures, track real-time collections, handle waivers, and manage student defaults.
          </p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-border-custom/50 mb-6 pb-2 gap-2 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl sm:rounded-xl text-sm font-semibold transition-all whitespace-nowrap relative
                ${active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'
                }
              `}
            >
              <Icon size={16} className={active ? "text-primary" : "opacity-70"} />
              {tab.label}
              {active && (
                <div className="absolute bottom-[-9px] sm:bottom-0 left-0 w-full h-[2px] sm:h-full bg-primary/20 sm:bg-transparent -z-10 rounded-xl" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewTab overview={overview} fmt={fmt} />}
        {activeTab === 'assign' && (
          <StudentFeesTab 
            fees={fees} loading={loading} fmt={fmt} fetchData={fetchData} 
            setModal={setModal} handleDelete={handleDelete} 
            page={page} setPage={setPage} totalPages={totalPages} 
            search={search} setSearch={setSearch} 
            statusFilter={statusFilter} setStatusFilter={setStatusFilter} 
          />
        )}
        {activeTab === 'structures' && <FeeStructuresTab fmt={fmt} />}
        {activeTab === 'transactions' && <TransactionsTab fmt={fmt} />}
        {activeTab === 'waivers' && <WaiversTab fmt={fmt} />}
        {activeTab === 'defaulters' && <DefaultersTab fmt={fmt} />}
        {activeTab === 'reports' && <ReportsTab fmt={fmt} />}
      </div>

      {/* Modals from old structure */}
      {modal?.type === 'assign' && <AssignFeeModal onClose={() => setModal(null)} onSuccess={fetchData} />}
      {modal?.type === 'installment' && <InstallmentModal fee={modal.data} onClose={() => setModal(null)} onSuccess={fetchData} />}
      {modal?.type === 'scholarship' && <ScholarshipModal fee={modal.data} onClose={() => setModal(null)} onSuccess={fetchData} />}
    </div>
  );
}

// Added extra dummy icon missing from import if necessary
const PieChart = BarChart3;
