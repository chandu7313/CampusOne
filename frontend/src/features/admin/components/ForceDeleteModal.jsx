import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useDeleteProgram } from '../hooks/useAcademics';
import { useToast } from '../../../hooks/useToast';

/**
 * ForceDeleteModal
 *
 * Props:
 *   isOpen  — boolean
 *   onClose — () => void
 *   program — { id, name }
 *   meta    — { yearsCount, semestersCount, sectionsCount }
 */
const ForceDeleteModal = ({ isOpen, onClose, program, meta = {} }) => {
    const { toast } = useToast();
    const deleteProgram = useDeleteProgram();
    const [confirmText, setConfirmText] = useState('');

    if (!isOpen || !program) return null;

    const isConfirmed = confirmText.trim() === program.name;

    const handleForceDelete = async () => {
        if (!isConfirmed) return;
        try {
            await deleteProgram.mutateAsync({ id: program.id, force: true });
            toast(`"${program.name}" and all its data permanently deleted.`, 'success');
            onClose();
        } catch (err) {
            toast(err?.message || 'Force delete failed', 'error');
        }
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-bg-card border border-rose-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-rose-500/10 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-rose-500/20 bg-rose-500/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center">
                            <AlertTriangle size={18} className="text-rose-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-text-main text-[0.95rem]">Delete Program & All Data</h3>
                            <p className="text-[0.65rem] text-rose-400 font-bold">This action is irreversible</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* What will be deleted */}
                    <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4 space-y-2">
                        <p className="text-[0.75rem] font-black text-text-main">
                            "{program.name}" contains:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Years', value: meta.yearsCount ?? '?' },
                                { label: 'Semesters', value: meta.semestersCount ?? '?' },
                                { label: 'Sections', value: meta.sectionsCount ?? '?' },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-bg-card rounded-xl p-2.5 text-center border border-rose-500/10">
                                    <p className="text-xl font-black text-rose-400">{value}</p>
                                    <p className="text-[0.58rem] text-text-muted font-bold uppercase tracking-wider">{label}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-[0.65rem] text-rose-400/80 font-semibold">
                            All of the above will be permanently deleted.
                        </p>
                    </div>

                    {/* Typed confirmation */}
                    <div className="space-y-2">
                        <p className="text-[0.7rem] text-text-muted font-semibold">
                            Type <span className="font-black text-text-main">{program.name}</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder="Type program name exactly..."
                            className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-rose-400 transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-border-custom text-text-muted font-black text-sm hover:bg-bg-main transition-all cursor-pointer bg-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleForceDelete}
                            disabled={!isConfirmed || deleteProgram.isPending}
                            className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-black text-sm hover:bg-rose-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Trash2 size={15} />
                            {deleteProgram.isPending ? 'Deleting...' : 'Delete Everything'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForceDeleteModal;
