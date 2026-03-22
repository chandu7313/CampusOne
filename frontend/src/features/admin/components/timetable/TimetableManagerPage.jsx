import React, { useState, useMemo } from 'react';
import {
    CalendarRange, PlusCircle, Filter,
    Trash2, Eye, Edit3, CheckCircle, Clock, BookOpen
} from 'lucide-react';
import { useAcademicHierarchy } from '../../hooks/useAcademics';
import { useTimetables, useDeleteTimetable } from '../../hooks/useTimetable';
import DepartmentSelector from './DepartmentSelector';
import ProgramSelector from './ProgramSelector';
import YearSelector from './YearSelector';
import SemesterSelector from './SemesterSelector';
import SectionSelector from './SectionSelector';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
import { useToast } from '../../../../hooks/useToast';

// Loading skeleton row
const SkeletonRow = () => (
    <tr className="border-b border-border-custom animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
            <td key={i} className="px-8 py-6">
                <div className="h-4 bg-bg-main rounded-lg w-3/4" />
                {i === 0 && <div className="h-3 bg-bg-main rounded-lg w-1/2 mt-2" />}
            </td>
        ))}
    </tr>
);

const TimetableManagerPage = ({ onCreateClick, onEditClick, onViewClick }) => {
    const { toast } = useToast();
    const { data: hierarchy } = useAcademicHierarchy();
    const [filters, setFilters] = useState({
        departmentId: '', programId: '', yearId: '', semesterId: '', sectionId: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, label: '' });

    const { data: timetables, isLoading } = useTimetables(filters);
    const deleteMutation = useDeleteTimetable();

    // Derived hierarchy for selectors
    const selectedDept     = useMemo(() => hierarchy?.find(d => d.id === filters.departmentId), [hierarchy, filters.departmentId]);
    const selectedProgram  = useMemo(() => selectedDept?.programs?.find(p => p.id === filters.programId), [selectedDept, filters.programId]);
    const selectedYear     = useMemo(() => selectedProgram?.years?.find(y => y.id === filters.yearId), [selectedProgram, filters.yearId]);
    const selectedSemester = useMemo(() => selectedYear?.semesters?.find(s => s.id === filters.semesterId), [selectedYear, filters.semesterId]);
    const sections = selectedSemester?.sections || [];

    const handleDeleteRequest = (tt) => {
        setDeleteConfirm({
            isOpen: true,
            id: tt.id,
            label: `${tt.department?.name} › Section ${tt.section?.name}`
        });
    };

    const handleDeleteConfirm = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ isOpen: false, id: null, label: '' });
        try {
            await deleteMutation.mutateAsync(id);
            toast('Timetable deleted successfully', 'success');
        } catch (err) {
            toast(err.response?.data?.message || 'Failed to delete timetable', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-text-main tracking-tight flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <CalendarRange size={24} />
                        </div>
                        Timetable Manager
                    </h1>
                    <p className="text-text-muted mt-2 font-medium">Monitor and manage academic schedules across all departments.</p>
                </div>
                <button
                    onClick={onCreateClick}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-[24px] font-black hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all border-none cursor-pointer"
                >
                    <PlusCircle size={20} />
                    Create New Timetable
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-bg-card border border-border-custom rounded-[32px] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <Filter size={16} className="text-primary" />
                    <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted">Global Filters</h3>
                    {(filters.departmentId || filters.programId || filters.yearId || filters.semesterId || filters.sectionId) && (
                        <button
                            onClick={() => setFilters({ departmentId: '', programId: '', yearId: '', semesterId: '', sectionId: '' })}
                            className="ml-auto text-[0.6rem] font-black text-primary/70 hover:text-primary transition-colors border-none bg-transparent cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <DepartmentSelector departments={hierarchy} selectedDeptId={filters.departmentId} onChange={(val) => setFilters({ ...filters, departmentId: val, programId: '', yearId: '', semesterId: '', sectionId: '' })} />
                    <ProgramSelector programs={selectedDept?.programs} selectedProgramId={filters.programId} onChange={(val) => setFilters({ ...filters, programId: val, yearId: '', semesterId: '', sectionId: '' })} disabled={!filters.departmentId} />
                    <YearSelector years={selectedProgram?.years} selectedYearId={filters.yearId} onChange={(val) => setFilters({ ...filters, yearId: val, semesterId: '', sectionId: '' })} disabled={!filters.programId} />
                    <SemesterSelector semesters={selectedYear?.semesters} selectedSemesterId={filters.semesterId} onChange={(val) => setFilters({ ...filters, semesterId: val, sectionId: '' })} disabled={!filters.yearId} />
                    <SectionSelector sections={sections} selectedSectionId={filters.sectionId} onChange={(val) => setFilters({ ...filters, sectionId: val })} disabled={!filters.semesterId} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-bg-card border border-border-custom rounded-[32px] overflow-hidden shadow-xl">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-bg-main/50 border-b border-border-custom">
                            <th className="px-8 py-6 text-left text-[0.65rem] font-black uppercase tracking-widest text-text-muted">Department / Program</th>
                            <th className="px-8 py-6 text-left text-[0.65rem] font-black uppercase tracking-widest text-text-muted">Year / Semester</th>
                            <th className="px-8 py-6 text-left text-[0.65rem] font-black uppercase tracking-widest text-text-muted">Section</th>
                            <th className="px-8 py-6 text-left text-[0.65rem] font-black uppercase tracking-widest text-text-muted">Slots</th>
                            <th className="px-8 py-6 text-left text-[0.65rem] font-black uppercase tracking-widest text-text-muted">Status</th>
                            <th className="px-8 py-6 text-right text-[0.65rem] font-black uppercase tracking-widest text-text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : !timetables?.length ? (
                            <tr>
                                <td colSpan="6">
                                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                        <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/40">
                                            <BookOpen size={32} />
                                        </div>
                                        <p className="text-text-muted font-bold italic text-sm">No timetables found.</p>
                                        <button
                                            onClick={onCreateClick}
                                            className="text-[0.75rem] font-black text-primary hover:underline border-none bg-transparent cursor-pointer"
                                        >
                                            + Create the first one
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : timetables.map(tt => {
                            const totalSlots    = tt.entries?.length ?? tt._count?.entries ?? '—';
                            const assignedSlots = tt.entries?.filter(e => e.facultyId).length;
                            const showProgress  = typeof totalSlots === 'number' && totalSlots > 0;

                            return (
                                <tr key={tt.id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[0.8rem] font-black text-text-main uppercase tracking-tighter">{tt.department?.name}</span>
                                            <span className="text-[0.65rem] font-bold text-text-muted">{tt.program?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[0.75rem] font-black text-text-main uppercase">{tt.year?.name}</span>
                                            <span className="text-[0.65rem] font-bold text-text-muted">Semester {tt.semester?.semesterNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 text-primary font-black text-sm border border-primary/10">
                                            {tt.section?.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {showProgress ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[0.7rem] font-black text-text-main">{assignedSlots}/{totalSlots} assigned</span>
                                                <div className="w-24 h-1.5 bg-bg-main rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                                        style={{ width: `${(assignedSlots / totalSlots) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[0.7rem] font-bold text-text-muted">—</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-wider
                                            ${tt.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : tt.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                            {tt.status === 'ACTIVE' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                            {tt.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onViewClick(tt)} className="p-3 bg-bg-main border border-border-custom rounded-xl text-text-muted hover:text-primary transition-all cursor-pointer" title="View Grid">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => onEditClick(tt)} className="p-3 bg-bg-main border border-border-custom rounded-xl text-text-muted hover:text-primary transition-all cursor-pointer" title="Edit">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteRequest(tt)} className="p-3 bg-bg-main border border-border-custom rounded-xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null, label: '' })}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteMutation.isPending}
                title="Delete Timetable?"
                description={`This will permanently delete the timetable for "${deleteConfirm.label}" and all its slots. This cannot be undone.`}
                confirmLabel="Delete Timetable"
                confirmVariant="danger"
                requireTyped={deleteConfirm.label}
            />
        </div>
    );
};

export default TimetableManagerPage;
