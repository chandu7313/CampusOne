import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, AlertCircle, Check, Trash2, AlertTriangle } from 'lucide-react';
import { useCourses } from '../hooks/useAcademics';
import { useFacultyProfiles } from '../hooks/useFaculty';
import { useClassrooms, useTimetableConflicts } from '../hooks/useTimetable';

const SLOT_TYPES = ['LECTURE', 'LAB', 'TUTORIAL', 'BREAK'];

const SLOT_TYPE_COLORS = {
    LECTURE:  'bg-primary/10 text-primary border-primary/20',
    LAB:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    TUTORIAL: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    BREAK:    'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

/**
 * TimetableEntryModal
 *
 * Props:
 *   isOpen, onClose
 *   slot        — the TimeSlot object { id, dayOfWeek, startTime }
 *   day         — string (fallback if slot.dayOfWeek is missing)
 *   existingEntry — existing TimetableEntry data (for edit mode)
 *   sectionId, academicYear, timetableId
 *   onSave(payload)   — called with the full entry payload
 *   onDelete(entry)   — called when delete is confirmed
 *   isPending         — external loading state (for save button)
 */
const TimetableEntryModal = ({
    isOpen,
    onClose,
    slot,
    day,
    sectionId,
    existingEntry,
    onSave,
    onDelete,
    timetableId,
    academicYear,
    isPending = false,
}) => {
    const { data: courses } = useCourses();
    const { data: allFaculty } = useFacultyProfiles();
    const { data: classrooms } = useClassrooms();

    const effectiveDay = slot?.dayOfWeek || day || '';

    const [formData, setFormData] = useState({
        subjectId:   existingEntry?.subjectId  || '',
        facultyId:   existingEntry?.facultyId  || '',
        classroomId: existingEntry?.classroomId || '',
        slotType:    existingEntry?.slotType    || 'LECTURE',
    });
    const [error, setError] = useState('');

    // Re-populate form when existingEntry changes (e.g. opening a different slot)
    useEffect(() => {
        setFormData({
            subjectId:   existingEntry?.subjectId  || '',
            facultyId:   existingEntry?.facultyId  || '',
            classroomId: existingEntry?.classroomId || '',
            slotType:    existingEntry?.slotType    || 'LECTURE',
        });
        setError('');
    }, [existingEntry, isOpen]);

    // Escape key + ensure body scroll lock
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Filter faculty to only those who teach the selected subject
    // (uses course.facultyAssignments or falls back to all faculty)
    const filteredFaculty = useMemo(() => {
        if (!allFaculty) return [];
        if (!formData.subjectId) return allFaculty;

        // Try to find faculty via course assignments
        const course = courses?.find(c => c.id === formData.subjectId);
        if (course?.assignments && course.assignments.length > 0) {
            const assignedFacultyIds = course.assignments.map(a => a.facultyId || a.userId);
            const filtered = allFaculty.filter(f => {
                const id = f.userId || f.id;
                return assignedFacultyIds.includes(id);
            });
            if (filtered.length > 0) return filtered;
        }
        // Fallback: return all faculty if no assignment data
        return allFaculty;
    }, [allFaculty, formData.subjectId, courses]);

    // Conflict check params — only run when we have enough info
    const conflictsParams = {
        facultyId:         formData.facultyId,
        classroomId:       formData.classroomId,
        timeSlotId:        slot?.id,
        dayOfWeek:         effectiveDay,
        academicYear:      academicYear || '2025-26',
        ignoreTimetableId: timetableId,
    };

    const { data: conflicts, isFetching: isCheckingConflicts } = useTimetableConflicts(conflictsParams);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.subjectId || !formData.facultyId || !formData.classroomId) {
            setError('Please fill in all required fields.');
            return;
        }

        const subjectObj   = courses?.find(c => c.id === formData.subjectId);
        const facultyEntry = filteredFaculty?.find(f => (f.userId || f.id) === formData.facultyId);
        const classroomObj = classrooms?.find(c => c.id === formData.classroomId);

        const payload = {
            id:          existingEntry?.id || `draft_${Date.now()}`,
            subjectId:   formData.subjectId,
            facultyId:   formData.facultyId,
            classroomId: formData.classroomId,
            slotType:    formData.slotType,
            timeSlotId:  slot?.id || existingEntry?.timeSlotId,
            dayOfWeek:   effectiveDay,
            subject:     subjectObj,
            faculty:     facultyEntry?.user || facultyEntry,
            classroom:   classroomObj,
        };

        onSave(payload);
        onClose();
    };

    const handleDelete = () => {
        onDelete(existingEntry);
        onClose();
    };

    const isEditing = !!existingEntry?.id && !String(existingEntry.id).startsWith('draft_');

    return (
        <div
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-bg-card border border-border-custom rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <header className="px-10 py-7 flex justify-between items-center bg-bg-card border-b border-border-custom shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text-main tracking-tight m-0">
                                {isEditing ? 'Edit Slot' : 'Assign Slot'}
                            </h3>
                            <p className="text-[0.65rem] text-text-muted font-black uppercase tracking-widest mt-0.5 m-0 opacity-70">
                                {effectiveDay} {slot?.startTime ? `• ${slot.startTime}` : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-bg-main rounded-[16px] transition-all border-none cursor-pointer text-text-muted hover:text-rose-500 bg-transparent"
                    >
                        <X size={18} />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Slot Type */}
                    <div>
                        <label className="block text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-3">
                            Slot Type
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {SLOT_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, slotType: type }))}
                                    className={`py-2.5 px-3 rounded-xl text-[0.6rem] font-black uppercase tracking-widest border transition-all cursor-pointer
                                        ${formData.slotType === type ? SLOT_TYPE_COLORS[type] : 'bg-bg-main text-text-muted border-border-custom hover:border-text-muted/30'}
                                    `}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-3">
                            Subject <span className="text-rose-400">*</span>
                        </label>
                        <select
                            value={formData.subjectId}
                            onChange={e => setFormData(p => ({ ...p, subjectId: e.target.value, facultyId: '' }))}
                            className="w-full bg-bg-main border border-border-custom rounded-2xl px-5 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            <option value="">— Select Subject —</option>
                            {courses?.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>

                    {/* Faculty */}
                    <div>
                        <label className="block text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-3">
                            Faculty <span className="text-rose-400">*</span>
                            {formData.subjectId && filteredFaculty.length < (allFaculty?.length || 0) && (
                                <span className="ml-2 text-emerald-400 normal-case tracking-normal">
                                    ({filteredFaculty.length} eligible)
                                </span>
                            )}
                        </label>
                        <select
                            value={formData.facultyId}
                            onChange={e => setFormData(p => ({ ...p, facultyId: e.target.value }))}
                            className="w-full bg-bg-main border border-border-custom rounded-2xl px-5 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            <option value="">— Select Faculty —</option>
                            {filteredFaculty?.map(f => {
                                const id   = f.userId || f.id;
                                const name = f.user
                                    ? `${f.user.firstName} ${f.user.lastName}`
                                    : `${f.firstName || ''} ${f.lastName || ''}`.trim();
                                return <option key={id} value={id}>{name}</option>;
                            })}
                        </select>
                    </div>

                    {/* Classroom */}
                    <div>
                        <label className="block text-[0.65rem] font-black uppercase tracking-widest text-text-muted mb-3">
                            Classroom <span className="text-rose-400">*</span>
                        </label>
                        <select
                            value={formData.classroomId}
                            onChange={e => setFormData(p => ({ ...p, classroomId: e.target.value }))}
                            className="w-full bg-bg-main border border-border-custom rounded-2xl px-5 py-3.5 text-sm font-semibold text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            <option value="">— Select Classroom —</option>
                            {classrooms?.map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Cap: {c.capacity})</option>
                            ))}
                        </select>
                    </div>

                    {/* Conflict Warning */}
                    {conflicts?.length > 0 && (
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[24px] p-5 flex gap-4 animate-in slide-in-from-top-2 duration-300">
                            <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
                            <div className="space-y-1">
                                <p className="text-[0.65rem] font-black text-rose-500 uppercase tracking-widest">Conflict Detected</p>
                                {conflicts.map((c, i) => (
                                    <p key={i} className="text-rose-400 text-xs font-semibold leading-tight">{c.message}</p>
                                ))}
                                <p className="text-rose-300/60 text-[0.6rem] font-medium mt-2">You can still proceed — the slot will be flagged.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="p-7 pt-0 flex gap-3 shrink-0">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="w-14 h-14 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow hover:shadow-rose-500/30 disabled:opacity-50 shrink-0"
                            title="Delete Slot"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 px-6 rounded-2xl font-black text-xs text-text-muted hover:bg-bg-main transition-all border border-border-custom cursor-pointer uppercase tracking-widest bg-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || isCheckingConflicts}
                        className={`flex-1 py-4 px-6 rounded-2xl cursor-pointer font-black text-[0.75rem] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-none shadow-xl
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
                            ${conflicts?.length > 0
                                ? 'bg-amber-500 text-white hover:bg-amber-600'
                                : 'bg-primary text-white hover:-translate-y-0.5 hover:shadow-primary/30'
                            }`}
                    >
                        <Check size={16} />
                        {isPending
                            ? 'Saving…'
                            : isCheckingConflicts
                            ? 'Checking…'
                            : conflicts?.length > 0
                            ? 'Proceed Anyway'
                            : isEditing ? 'Update' : 'Assign'
                        }
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TimetableEntryModal;
