import React, { useState, useEffect } from 'react';
import { X, Building, BookOpen, Layers, LayoutGrid, Check } from 'lucide-react';
import {
    useCreateDepartment,
    useCreateProgram,
    useCreateSection
} from '../hooks/useAcademics';
import { useToast } from '../../../hooks/useToast';

const PROGRAM_TYPES = ['UG', 'PG', 'PhD', 'Diploma'];

const AcademicMutationModal = ({ isOpen, onClose, type, parentData = {} }) => {
    const { toast } = useToast();
    const createDept = useCreateDepartment();
    const createProg = useCreateProgram();
    const createSection = useCreateSection();

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        durationYears: 4,
        totalSemesters: 8,
        capacity: 60,
        programType: 'UG',
        ...parentData
    });

    const [error, setError] = useState('');

    // Re-seed when parentData changes (e.g., different dept)
    useEffect(() => {
        setFormData(prev => ({ ...prev, ...parentData }));
        setError('');
    }, [parentData, isOpen]);

    if (!isOpen) return null;

    const titles = {
        department: 'New Department',
        program: 'Add Program',
        section: 'Add Section',
    };

    const icons = {
        department: <Building size={20} />,
        program: <BookOpen size={20} />,
        section: <LayoutGrid size={20} />,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            // Keep totalSemesters in sync with durationYears
            if (name === 'durationYears') next.totalSemesters = (parseInt(value) || 1) * 2;
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (type === 'department') {
                await createDept.mutateAsync({ name: formData.name, code: formData.code.toUpperCase() });
            }
            if (type === 'program') {
                await createProg.mutateAsync({
                    name: formData.name,
                    code: formData.code,
                    departmentId: formData.departmentId,
                    programType: formData.programType,
                    durationYears: parseInt(formData.durationYears),
                    totalSemesters: parseInt(formData.totalSemesters),
                });
            }
            if (type === 'section') {
                await createSection.mutateAsync({
                    name: formData.name,
                    semesterId: formData.semesterId,
                    programId: formData.programId,
                    departmentId: formData.departmentId,
                    capacity: parseInt(formData.capacity),
                });
            }
            toast(`${titles[type]} created successfully!`, 'success');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to create ${type}`);
        }
    };

    const isPending = createDept.isPending || createProg.isPending || createSection.isPending;

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-bg-card border border-border-custom rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-border-custom">
                    <div className="flex items-center gap-3 text-primary">
                        {icons[type]}
                        <h3 className="font-black text-text-main text-[0.95rem]">{titles[type]}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-xs font-bold">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    {(type === 'department' || type === 'program' || type === 'section') && (
                        <div className="space-y-1">
                            <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">
                                {type === 'section' ? 'Section Label (e.g. A, B, C)' : 'Name / Title'}
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder={type === 'section' ? 'e.g. D' : type === 'program' ? 'e.g. B.Tech Computer Science' : 'e.g. Engineering'}
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                            />
                        </div>
                    )}

                    {/* Code */}
                    {(type === 'department' || type === 'program') && (
                        <div className="space-y-1">
                            <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">Unique Code</label>
                            <input
                                name="code"
                                type="text"
                                placeholder={type === 'department' ? 'e.g. ENG' : 'e.g. BTECH-CS'}
                                required
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all font-mono"
                            />
                        </div>
                    )}

                    {/* Program type + Duration */}
                    {type === 'program' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">Program Type</label>
                                <select
                                    name="programType"
                                    value={formData.programType}
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                >
                                    {PROGRAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">Duration (Years)</label>
                                    <input
                                        name="durationYears"
                                        type="number"
                                        min={1}
                                        max={6}
                                        value={formData.durationYears}
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">Total Semesters</label>
                                    <input
                                        name="totalSemesters"
                                        type="number"
                                        min={1}
                                        value={formData.totalSemesters}
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Section capacity */}
                    {type === 'section' && (
                        <div className="space-y-1">
                            <label className="text-[0.65rem] font-black text-text-muted uppercase tracking-wider pl-1">Max Capacity</label>
                            <input
                                name="capacity"
                                type="number"
                                min={1}
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full bg-bg-main border border-border-custom rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary text-white py-3 rounded-xl font-black hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isPending ? 'Creating...' : <><Check size={16} /> Confirm</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcademicMutationModal;
