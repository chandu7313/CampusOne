import React, { useState } from 'react';
import { X, FileText, Calendar, Layers, Check, AlertCircle } from 'lucide-react';
import { useCreateExam } from '../hooks/useExams';

const ExamMutationModal = ({ isOpen, onClose }) => {
    const createExam = useCreateExam();
    const [formData, setFormData] = useState({
        name: '',
        type: 'MIDTERM',
        academicYear: new Date().getFullYear().toString(),
        semesterNumber: 1,
        startDate: '',
        endDate: ''
    });

    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await createExam.mutateAsync(formData);
            onClose();
            setFormData({
                name: '', type: 'MIDTERM', academicYear: new Date().getFullYear().toString(),
                semesterNumber: 1, startDate: '', endDate: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create exam event');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-card border border-border-custom rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="px-8 py-6 flex justify-between items-center bg-bg-card border-b border-border-custom">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold m-0 text-text-main">Plan Exam Event</h3>
                            <p className="text-[0.75rem] text-text-muted m-0 font-medium uppercase tracking-wider">Academic Assessment Audit</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-3 rounded-2xl text-[0.8rem] font-bold flex items-center gap-3">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Event Name</label>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder="e.g. B.Tech Odd Sem Midterms"
                                required 
                                value={formData.name} 
                                onChange={handleChange}
                                className="w-full bg-bg-main border border-border-custom rounded-2xl px-5 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Exam Type</label>
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all appearance-none"
                                >
                                    <option value="MIDTERM">Midterm</option>
                                    <option value="FINAL">Final Exam</option>
                                    <option value="PRACTICAL">Practical</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Term / Sem</label>
                                <input 
                                    name="semesterNumber" 
                                    type="number" 
                                    min="1" max="10"
                                    value={formData.semesterNumber} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Start Date</label>
                                <input 
                                    name="startDate" 
                                    type="date" 
                                    required 
                                    value={formData.startDate} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">End Date</label>
                                <input 
                                    name="endDate" 
                                    type="date" 
                                    required 
                                    value={formData.endDate} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={createExam.isLoading}
                            className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            {createExam.isLoading ? 'Syncing...' : <><Check size={20} /> Initialize Event</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamMutationModal;
