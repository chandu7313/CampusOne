import React, { useState } from 'react';
import { X, User, Mail, Hash, BookOpen, Layers, Check, GraduationCap } from 'lucide-react';
import { useAdmitStudent } from '../hooks/useStudents';
import { useAcademicHierarchy } from '../hooks/useAcademics';

const AdmitStudentModal = ({ isOpen, onClose }) => {
    const { data: hierarchy } = useAcademicHierarchy();
    const admitStudent = useAdmitStudent();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        registrationNumber: '',
        programId: '',
        sectionId: '',
        batch: new Date().getFullYear().toString()
    });

    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Flatten hierarchy to get programs and sections for simple dropdowns
    const allPrograms = hierarchy?.flatMap(dept => dept.programs) || [];
    const selectedProgram = allPrograms.find(p => p.id === formData.programId);
    const availableSections = selectedProgram?.semesters?.flatMap(s => s.sections) || [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            await admitStudent.mutateAsync(formData);
            onClose();
            setFormData({
                firstName: '', lastName: '', email: '', registrationNumber: '',
                programId: '', sectionId: '', batch: new Date().getFullYear().toString()
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to admit student');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset section if program changes
            ...(name === 'programId' ? { sectionId: '' } : {})
        }));
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-card border border-border-custom rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="px-8 py-6 flex justify-between items-center bg-bg-card border-b border-border-custom">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold m-0 text-text-main">Individual Admission</h3>
                            <p className="text-[0.75rem] text-text-muted m-0 font-medium uppercase tracking-wider">Manual Student Provisioning</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-3 rounded-2xl text-[0.8rem] font-bold flex items-center gap-3">
                            <Check size={18} className="rotate-45" /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">First Name</label>
                            <div className="relative">
                                <input 
                                    name="firstName" 
                                    type="text" 
                                    placeholder="John"
                                    required 
                                    value={formData.firstName} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all"
                                />
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Last Name</label>
                            <div className="relative">
                                <input 
                                    name="lastName" 
                                    type="text" 
                                    placeholder="Doe"
                                    required 
                                    value={formData.lastName} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 col-span-2">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Institutional Email</label>
                            <div className="relative">
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="john.doe@university.edu"
                                    required 
                                    value={formData.email} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all"
                                />
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Reg. Number / ID</label>
                            <div className="relative">
                                <input 
                                    name="registrationNumber" 
                                    type="text" 
                                    placeholder="REG-2024-001"
                                    required 
                                    value={formData.registrationNumber} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all"
                                />
                                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Batch (Year)</label>
                            <input 
                                name="batch" 
                                type="text" 
                                placeholder="2024"
                                required 
                                value={formData.batch} 
                                onChange={handleChange}
                                className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Program</label>
                            <div className="relative">
                                <select 
                                    name="programId" 
                                    required 
                                    value={formData.programId} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all appearance-none"
                                >
                                    <option value="">Select Program</option>
                                    {allPrograms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Initial Section</label>
                            <div className="relative">
                                <select 
                                    name="sectionId" 
                                    required 
                                    disabled={!formData.programId}
                                    value={formData.sectionId} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-emerald-500 transition-all appearance-none disabled:opacity-50"
                                >
                                    <option value="">Select Section</option>
                                    {availableSections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
                                </select>
                                <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl bg-bg-main text-text-muted font-bold hover:text-text-main transition-all border-none cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={admitStudent.isLoading}
                            className="flex-[2] py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            {admitStudent.isLoading ? 'Syncing...' : <><Check size={20} /> Complete Admission</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdmitStudentModal;
