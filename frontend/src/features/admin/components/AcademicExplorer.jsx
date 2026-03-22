import React, { useState } from 'react';
import {
    useAcademicHierarchy,
    useDeleteDepartment,
    useDeleteProgram,
    useDeleteYear,
    useDeleteSemester,
    useDeleteSection
} from '../hooks/useAcademics';
import {
    GraduationCap, BookOpen, Layers, ChevronRight, ChevronDown,
    Plus, LayoutGrid, Calendar, Trash2
} from 'lucide-react';
import AcademicMutationModal from './AcademicMutationModal';
import InitializeSemestersModal from './InitializeSemestersModal';
import ForceDeleteModal from './ForceDeleteModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useToast } from '../../../hooks/useToast';

const AcademicExplorer = () => {
    const { data: hierarchy, isLoading } = useAcademicHierarchy();
    const { toast } = useToast();

    const deleteDept     = useDeleteDepartment();
    const deleteProgram  = useDeleteProgram();
    const deleteYear     = useDeleteYear();
    const deleteSemester = useDeleteSemester();
    const deleteSection  = useDeleteSection();

    const [expandedIds, setExpandedIds] = useState(new Set());

    // Generic add/create modal
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'department', parentData: {} });
    // Initialize semesters modal
    const [initModal, setInitModal] = useState({ isOpen: false, program: null });
    // Force-delete modal (for programs with children)
    const [forceModal, setForceModal] = useState({ isOpen: false, program: null, meta: {} });
    // Generic confirm dialog
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false, title: '', description: '', onConfirm: null, requireTyped: undefined
    });

    const openModal = (type, parentData = {}) => setModalConfig({ isOpen: true, type, parentData });
    const closeModal = () => setModalConfig(m => ({ ...m, isOpen: false }));

    const toggleExpand = id => setExpandedIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const confirm = (title, description, onConfirm, requireTyped) =>
        setConfirmConfig({ isOpen: true, title, description, onConfirm, requireTyped });

    const closeConfirm = () => setConfirmConfig(c => ({ ...c, isOpen: false }));

    // ─── Delete handlers ────────────────────────────────────────────────

    const handleDeleteDept = dept => confirm(
        `Delete "${dept.name}"?`,
        'Departments with programs cannot be deleted. Remove all programs first.',
        async () => {
            try {
                await deleteDept.mutateAsync(dept.id);
                toast(`Department "${dept.name}" deleted`, 'success');
            } catch (err) { toast(err?.message || 'Failed to delete', 'error'); }
            closeConfirm();
        },
        dept.name  // ← requireTyped
    );

    const handleDeleteProgram = async program => {
        // First try a safe delete — the backend will tell us if force is needed
        try {
            await deleteProgram.mutateAsync({ id: program.id, force: false });
            toast(`"${program.name}" deleted`, 'success');
        } catch (errData) {
            if (errData?.canForceDelete) {
                // Show the force-delete modal with counts from the API
                setForceModal({ isOpen: true, program, meta: errData.meta ?? {} });
            } else {
                toast(errData?.message || 'Failed to delete program', 'error');
            }
        }
    };

    const handleDeleteYear = year => confirm(
        `Delete ${year.name}?`,
        `This will permanently delete ${year.semesters?.length ?? 'all'} semester(s) and all their sections inside this year.`,
        async () => {
            try {
                const res = await deleteYear.mutateAsync(year.id);
                toast(res?.message || `${year.name} deleted`, 'success');
            } catch (err) { toast(err?.response?.data?.message || 'Failed to delete year', 'error'); }
            closeConfirm();
        },
        year.name  // ← requireTyped
    );

    const handleDeleteSemester = sem => confirm(
        `Delete Semester ${sem.semesterNumber}?`,
        `This will permanently delete Semester ${sem.semesterNumber} and all its sections.`,
        async () => {
            try {
                const res = await deleteSemester.mutateAsync(sem.id);
                toast(res?.message || 'Semester deleted', 'success');
            } catch (err) { toast(err?.response?.data?.message || 'Failed to delete semester', 'error'); }
            closeConfirm();
        },
        `Semester ${sem.semesterNumber}`  // ← requireTyped
    );

    const handleDeleteSection = section => confirm(
        `Delete Section "${section.name}"?`,
        'This will permanently remove the section and any student allocations within it.',
        async () => {
            try {
                await deleteSection.mutateAsync(section.id);
                toast(`Section "${section.name}" deleted`, 'success');
            } catch (err) { toast(err?.response?.data?.message || 'Failed to delete section', 'error'); }
            closeConfirm();
        },
        `Section ${section.name}`  // ← requireTyped
    );

    // ─── Render ─────────────────────────────────────────────────────────

    if (isLoading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-bg-card rounded-2xl animate-pulse" />)}
        </div>
    );

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-text-main tracking-tight">Academic Governance</h2>
                    <p className="text-[0.7rem] text-text-muted font-bold mt-0.5 uppercase tracking-widest">
                        {hierarchy?.length ?? 0} Department{hierarchy?.length !== 1 ? 's' : ''} · Manage the full academic hierarchy
                    </p>
                </div>
                <button
                    onClick={() => openModal('department')}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl text-[0.85rem] font-black hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all cursor-pointer border-none"
                >
                    <Plus size={16} /> New Department
                </button>
            </header>

            {/* Tree */}
            <div className="flex flex-col gap-3">
                {hierarchy?.length === 0 && (
                    <div className="text-center py-16 text-text-muted text-sm font-semibold opacity-50">
                        No departments yet. Click "New Department" to get started.
                    </div>
                )}

                {hierarchy?.map(dept => {
                    const deptExpanded = expandedIds.has(dept.id);
                    return (
                        <div key={dept.id} className="bg-bg-card border border-border-custom rounded-2xl overflow-hidden">
                            {/* ── DEPARTMENT ROW ── */}
                            <div
                                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-primary/[0.03] transition-colors group"
                                onClick={() => toggleExpand(dept.id)}
                            >
                                {deptExpanded
                                    ? <ChevronDown size={16} className="text-primary" />
                                    : <ChevronRight size={16} className="text-text-muted" />}
                                <GraduationCap size={20} className="text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-[0.95rem] text-text-main">{dept.name}</span>
                                    <span className="ml-2 text-[0.65rem] text-text-muted font-mono opacity-60">{dept.code}</span>
                                    <span className="ml-2 text-[0.6rem] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                                        {dept.programs?.length ?? 0} program{dept.programs?.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={e => { e.stopPropagation(); handleDeleteDept(dept); }}
                                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors border-none cursor-pointer"
                                        title="Delete department"><Trash2 size={14} /></button>
                                    <button onClick={e => { e.stopPropagation(); openModal('program', { departmentId: dept.id }); }}
                                        className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary px-2.5 py-1.5 rounded-lg text-[0.65rem] font-black hover:bg-primary hover:text-white transition-all border-none cursor-pointer">
                                        <Plus size={12} /> ADD PROGRAM
                                    </button>
                                </div>
                            </div>

                            {/* ── PROGRAMS ── */}
                            {deptExpanded && (
                                <div className="px-4 pb-4 space-y-1 border-t border-border-custom/40">
                                    {dept.programs?.length === 0 && (
                                        <p className="text-[0.7rem] text-text-muted font-semibold italic py-3 px-4 opacity-50">
                                            No programs — click ADD PROGRAM above
                                        </p>
                                    )}

                                    {dept.programs?.map(program => {
                                        const progExpanded = expandedIds.has(program.id);
                                        const isInitialized = program.years?.some(y => y.semesters?.some(s => s.sections?.length > 0));
                                        const totalSections = program.years?.flatMap(y => y.semesters?.flatMap(s => s.sections ?? []) ?? []).length ?? 0;

                                        return (
                                            <div key={program.id} className="ml-4 mt-2">
                                                {/* ── PROGRAM ROW ── */}
                                                <div
                                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/[0.03] rounded-xl transition-colors group"
                                                    onClick={() => toggleExpand(program.id)}
                                                >
                                                    {progExpanded
                                                        ? <ChevronDown size={14} className="text-purple-400" />
                                                        : <ChevronRight size={14} className="text-text-muted" />}
                                                    <BookOpen size={16} className="text-purple-500 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-black text-[0.9rem] text-text-main">{program.name}</span>
                                                        <span className="ml-2 text-[0.6rem] text-text-muted font-mono italic opacity-60">{program.code}</span>
                                                        {isInitialized && (
                                                            <span className="ml-2 text-[0.55rem] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                                                                ✓ Initialized · {totalSections} sections
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={e => { e.stopPropagation(); handleDeleteProgram(program); }}
                                                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors border-none cursor-pointer"
                                                            title="Delete program"><Trash2 size={13} /></button>
                                                    </div>
                                                </div>

                                                {/* ── PROGRAM EXPANDED ── */}
                                                {progExpanded && (
                                                    <div className="ml-8 mt-1 pl-4 border-l border-border-custom/40 space-y-1 pb-2">

                                                        {/* Action buttons when NOT initialized */}
                                                        {!isInitialized && (
                                                            <div className="flex flex-wrap gap-2 py-2">
                                                                <button
                                                                    onClick={() => setInitModal({ isOpen: true, program })}
                                                                    className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 text-primary px-3 py-2 rounded-xl text-[0.7rem] font-black hover:bg-primary hover:text-white transition-all cursor-pointer border-solid"
                                                                >
                                                                    <Layers size={13} /> + INITIALIZE SEMESTERS
                                                                </button>
                                                                <button
                                                                    onClick={() => openModal('program', { departmentId: dept.id })}
                                                                    className="flex items-center gap-1.5 bg-bg-main border border-dashed border-border-custom text-text-muted px-3 py-2 rounded-xl text-[0.7rem] font-black hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                                                                >
                                                                    <BookOpen size={13} /> + EXPAND PROGRAM CATALOG
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Expand Program Catalog always visible when initialized */}
                                                        {isInitialized && (
                                                            <div className="py-1.5">
                                                                <button
                                                                    onClick={() => openModal('program', { departmentId: dept.id })}
                                                                    className="flex items-center gap-1.5 bg-bg-main border border-dashed border-border-custom text-text-muted px-3 py-2 rounded-xl text-[0.7rem] font-black hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                                                                >
                                                                    <BookOpen size={13} /> + EXPAND PROGRAM CATALOG
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* ── YEARS ── */}
                                                        {program.years?.map(year => (
                                                            <div key={year.id} className="mt-1">
                                                                {/* Year Row */}
                                                                <div className="flex items-center gap-2 px-3 py-2 hover:bg-bg-main/50 rounded-xl transition-colors group/year">
                                                                    <Calendar size={14} className="text-blue-400 shrink-0" />
                                                                    <span className="font-black text-[0.8rem] text-text-main flex-1">
                                                                        {year.name}
                                                                        <span className="ml-2 text-[0.6rem] text-text-muted font-bold">
                                                                            {year.semesters?.length ?? 0} sem
                                                                        </span>
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleDeleteYear(year)}
                                                                        className="p-1 rounded-lg text-rose-400 opacity-0 group-hover/year:opacity-100 hover:bg-rose-500/10 transition-all border-none cursor-pointer"
                                                                        title="Delete year and all its semesters"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>

                                                                {/* ── SEMESTERS ── */}
                                                                <div className="ml-5 pl-3 border-l border-border-custom/30 space-y-1 mt-0.5">
                                                                    {year.semesters?.map(semester => (
                                                                        <div key={semester.id} className="py-1.5">
                                                                            {/* Semester Row */}
                                                                            <div className="flex items-center gap-2 px-2 group/sem">
                                                                                <Layers size={13} className="text-amber-400 shrink-0" />
                                                                                <span className="font-bold text-[0.78rem] text-text-main flex-1">
                                                                                    Semester {semester.semesterNumber}
                                                                                    <span className="ml-2 text-[0.58rem] text-text-muted font-bold bg-bg-main px-1.5 py-0.5 rounded-md">
                                                                                        {semester.academicYear}
                                                                                    </span>
                                                                                    <span className="ml-1 text-[0.58rem] text-text-muted opacity-60">
                                                                                        · {semester.sections?.length ?? 0} section{semester.sections?.length !== 1 ? 's' : ''}
                                                                                    </span>
                                                                                </span>
                                                                                <button
                                                                                    onClick={() => handleDeleteSemester(semester)}
                                                                                    className="p-1 rounded-lg text-rose-400 opacity-0 group-hover/sem:opacity-100 hover:bg-rose-500/10 transition-all border-none cursor-pointer"
                                                                                    title="Delete semester and all its sections"
                                                                                >
                                                                                    <Trash2 size={11} />
                                                                                </button>
                                                                            </div>

                                                                            {/* ── SECTIONS ── */}
                                                                            <div className="ml-5 mt-1.5 flex flex-wrap gap-2">
                                                                                {semester.sections?.map(section => (
                                                                                    <div key={section.id}
                                                                                        className="flex items-center gap-1.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-3 py-1.5 group/sec"
                                                                                    >
                                                                                        <LayoutGrid size={11} className="text-emerald-400" />
                                                                                        <span className="text-[0.72rem] font-black text-text-main">Section {section.name}</span>
                                                                                        <span className="text-[0.58rem] text-text-muted ml-1">cap: {section.capacity}</span>
                                                                                        <button
                                                                                            onClick={() => handleDeleteSection(section)}
                                                                                            className="ml-1 p-0.5 rounded text-rose-400 opacity-0 group-hover/sec:opacity-100 hover:bg-rose-500/10 transition-all border-none cursor-pointer"
                                                                                            title="Delete section"
                                                                                        >
                                                                                            <Trash2 size={10} />
                                                                                        </button>
                                                                                    </div>
                                                                                ))}

                                                                                {/* +Adjoin Section */}
                                                                                <button
                                                                                    onClick={() => openModal('section', {
                                                                                        semesterId: semester.id,
                                                                                        programId: program.id,
                                                                                        departmentId: dept.id
                                                                                    })}
                                                                                    className="flex items-center gap-1 border border-dashed border-border-custom text-text-muted px-3 py-1.5 rounded-xl text-[0.65rem] font-black hover:border-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all cursor-pointer bg-transparent"
                                                                                >
                                                                                    <Plus size={11} /> ADJOIN SECTION
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Dept-level: Expand Program Catalog */}
                                    <button
                                        onClick={() => openModal('program', { departmentId: dept.id })}
                                        className="ml-4 w-[calc(100%-1rem)] bg-transparent border border-dashed border-border-custom text-text-muted p-2.5 rounded-xl text-[0.75rem] font-black hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                                    >
                                        + EXPAND PROGRAM CATALOG
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Modals ── */}
            <AcademicMutationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                type={modalConfig.type}
                parentData={modalConfig.parentData}
            />

            <InitializeSemestersModal
                isOpen={initModal.isOpen}
                onClose={() => setInitModal({ isOpen: false, program: null })}
                program={initModal.program}
            />

            <ForceDeleteModal
                isOpen={forceModal.isOpen}
                onClose={() => setForceModal({ isOpen: false, program: null, meta: {} })}
                program={forceModal.program}
                meta={forceModal.meta}
            />

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmLabel="Delete"
                confirmVariant="danger"
                requireTyped={confirmConfig.requireTyped}
                isLoading={deleteDept.isPending || deleteYear.isPending || deleteSemester.isPending || deleteSection.isPending}
            />
        </div>
    );
};

export default AcademicExplorer;
