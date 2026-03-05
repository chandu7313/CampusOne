import React, { useState } from 'react';
import { X, Building, BookOpen, Layers, LayoutGrid, Check } from 'lucide-react';
import { 
    useCreateDepartment, 
    useCreateProgram, 
    useCreateSection 
} from '../hooks/useAcademics';

const AcademicMutationModal = ({ isOpen, onClose, type, parentData }) => {
    const createDept = useCreateDepartment();
    const createProg = useCreateProgram();
    const createSection = useCreateSection();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        durationYears: 1,
        totalSemesters: 2,
        capacity: 60,
        ...parentData // Inherit parent IDs (programId, departmentId, etc.)
    });

    const [error, setError] = useState('');

    if (!isOpen) return null;

    const titles = {
        department: 'Create New Department',
        program: 'Launch Academic Program',
        semester: 'Initialize Semester',
        section: 'Provision Section'
    };

    const icons = {
        department: <Building size={24} />,
        program: <Layers size={24} />,
        semester: <BookOpen size={24} />,
        section: <LayoutGrid size={24} />
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (type === 'department') await createDept.mutateAsync(formData);
            if (type === 'program') await createProg.mutateAsync(formData);
            if (type === 'section') await createSection.mutateAsync(formData);
            
            setFormData({
                name: '', code: '', durationYears: 1, totalSemesters: 2, capacity: 60
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to create ${type}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="bg-bg-card border border-border-custom rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <header className="px-6 py-4 flex justify-between items-center bg-bg-card border-b border-border-custom">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">{icons[type]}</div>
                        <h3 className="font-bold text-text-main m-0">{titles[type]}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold leading-relaxed">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {(type === 'department' || type === 'program' || type === 'section') && (
                            <div className="space-y-1">
                                <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1 font-bold">Name / Title</label>
                                <input 
                                    name="name" 
                                    type="text" 
                                    placeholder={type === 'section' ? 'e.g. Section A' : 'e.g. Computer Science'}
                                    required 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                        )}

                        {(type === 'department' || type === 'program') && (
                            <div className="space-y-1">
                                <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1 font-bold">Unique Code</label>
                                <input 
                                    name="code" 
                                    type="text" 
                                    placeholder="e.g. CSE-101"
                                    required 
                                    value={formData.code} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                        )}

                        {type === 'program' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1 font-bold">Duration (Yrs)</label>
                                    <input 
                                        name="durationYears" 
                                        type="number" 
                                        value={formData.durationYears} 
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1 font-bold">Semesters</label>
                                    <input 
                                        name="totalSemesters" 
                                        type="number" 
                                        value={formData.totalSemesters} 
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {type === 'section' && (
                            <div className="space-y-1">
                                <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1 font-bold">Max Capacity</label>
                                <input 
                                    name="capacity" 
                                    type="number" 
                                    value={formData.capacity} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit"
                        disabled={createDept.isLoading || createProg.isLoading || createSection.isLoading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold mt-4 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                        {(createDept.isLoading || createProg.isLoading || createSection.isLoading) ? 'Syncing...' : (
                            <><Check size={18} /> Confirm Provisioning</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcademicMutationModal;
