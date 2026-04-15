import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Plus, Pencil, Trash2, Copy, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '../../../../api/apiClient';
import FeeStructureModal from '../../pages/FeeStructureModal';

export default function FeeStructuresTab({ fmt }) {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: 'create' | 'edit', data? }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/finance-admin/fee-structures');
      setStructures(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this structure? This will fail if student fees are assigned to it.')) return;
    try {
      await apiClient.delete(`/finance-admin/fee-structures/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleDuplicate = async (id) => {
    const year = window.prompt('Enter new Academic Year:', '2025-26');
    if (!year) return;
    try {
      await apiClient.post(`/finance-admin/fee-structures/${id}/duplicate`, { academicYear: year });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Duplication failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center bg-white/5 border border-border-custom p-4 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 tracking-tight uppercase">
            <Layers className="text-primary" /> Structure Templates
          </h3>
          <p className="text-text-muted text-xs font-medium">Manage academic year fee blueprints</p>
        </div>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          <Plus size={16} /> New Structure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="glass h-48 rounded-3xl animate-pulse" />)
        ) : structures.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-2 border-border-custom/50">
            <Layers size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-text-muted font-bold tracking-tight">No templates defined yet</p>
          </div>
        ) : (
          structures.map(fs => (
            <div key={fs.id} className="glass-card group relative p-6 border-border-custom/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-black text-text-main tracking-tighter uppercase italic">{fs.academicYear}</h4>
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Sem {fs.semester}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDuplicate(fs.id)} className="p-2 rounded-lg hover:bg-white/10 text-text-muted transition-colors"><Copy size={14} /></button>
                  <button onClick={() => setModal({ type: 'edit', data: fs })} className="p-2 rounded-lg hover:bg-white/10 text-text-muted transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(fs.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-text-muted">Tuition</span>
                  <span className="text-text-main">{fmt(fs.tuitionFee)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-text-muted">Other Total</span>
                  <span className="text-text-main">{fmt(Number(fs.totalAmount || 0) - Number(fs.tuitionFee || 0))}</span>
                </div>
                <div className="h-[1px] bg-border-custom/50 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Amount</span>
                  <span className="text-2xl font-black text-text-main tabular-nums">₹{Number(fs.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[10px] text-text-muted font-medium bg-black/20 p-2 rounded-lg border border-border-custom/50">
                Penalty: {fmt(fs.lateFeePerDay)}/day after {fs.lateFeeStartDate || 0} grace days
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <FeeStructureModal
          structure={modal.data}
          onClose={() => setModal(null)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
