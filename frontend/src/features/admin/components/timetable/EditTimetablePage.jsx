import React, { useState, useEffect } from 'react';
import { CalendarRange, ArrowLeft, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTimetableById, useUpdateSlot, useDeleteSlot, useAddSlot, useTimeSlots } from '../../hooks/useTimetable';
import TimetableGrid from './TimetableGrid';
import TimetableEntryModal from '../TimetableEntryModal';
import FacultyAssignmentPanel from './FacultyAssignmentPanel';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
import { useToast } from '../../../../hooks/useToast';

const EditTimetablePage = () => {
    const { id: timetableId } = useParams();     // ← reads from URL /:id/edit
    const navigate = useNavigate();
    const goBack = () => navigate('/admin/timetable');

    const { toast } = useToast();
    const { data: timeSlots, isLoading: isLoadingSlots } = useTimeSlots();
    const { data: fullTimetable, isLoading: isLoadingData } = useTimetableById(timetableId);

    // Local mirror — unmounted & remounted fresh by React on every URL change
    // so there is NO stale bleed from a previous edit session
    const [entries, setEntries] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, slot: null, existingEntry: null });
    const [selectedFacultyId, setSelectedFacultyId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, entry: null });

    const addSlot = useAddSlot(timetableId);
    const updateSlot = useUpdateSlot(timetableId);
    const deleteSlot = useDeleteSlot(timetableId);

    useEffect(() => {
        if (fullTimetable?.entries) {
            setEntries(fullTimetable.entries.map(e => ({
                ...e,
                dayOfWeek: (e.dayOfWeek || e.timeSlot?.dayOfWeek || '').toUpperCase(),
            })));
        }
    }, [fullTimetable]);

    // ─── Open modal when clicking an EMPTY slot ───
    const handleSlotClick = (slot) => {
        setModalConfig({ isOpen: true, slot, existingEntry: null });
    };

    // ─── Open modal when clicking a FILLED entry cell ───
    // TimetableGrid calls this with (resolvedSlot, entry)
    const handleEntryClick = (resolvedSlot, entry) => {
        setModalConfig({ isOpen: true, slot: resolvedSlot, existingEntry: entry });
    };

    // ─── Save: update or add a single slot via API ───
    const handleSaveEntry = async (payload) => {
        const isNewEntry = !payload.id || String(payload.id).startsWith('draft_');

        try {
            if (isNewEntry) {
                const added = await addSlot.mutateAsync({
                    timeSlotId:  payload.timeSlotId,
                    subjectId:   payload.subjectId,
                    facultyId:   payload.facultyId,
                    classroomId: payload.classroomId,
                    slotType:    payload.slotType,
                    dayOfWeek:   payload.dayOfWeek,
                });
                setEntries(prev => [...prev, added]);
                toast('Slot added successfully', 'success');
            } else {
                const updated = await updateSlot.mutateAsync({
                    slotId: payload.id,
                    payload: {
                        subjectId:   payload.subjectId,
                        facultyId:   payload.facultyId,
                        classroomId: payload.classroomId,
                        slotType:    payload.slotType,
                    }
                });
                // Merge updated entry into local state immediately
                setEntries(prev => prev.map(e => e.id === payload.id ? { ...e, ...updated, ...payload } : e));
                toast('Slot updated successfully', 'success');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save slot';
            toast(msg, 'error');
        }
    };

    // ─── Delete: request confirm dialog first ───
    const handleDeleteRequest = (entry) => {
        setDeleteConfirm({ isOpen: true, entry });
    };

    const handleDeleteConfirm = async () => {
        const entry = deleteConfirm.entry;
        setDeleteConfirm({ isOpen: false, entry: null });

        try {
            await deleteSlot.mutateAsync(entry.id);
            setEntries(prev => prev.filter(e => e.id !== entry.id));
            toast('Slot removed', 'success');
        } catch (err) {
            toast(err.response?.data?.message || 'Failed to delete slot', 'error');
        }
    };

    if (isLoadingData || isLoadingSlots) {
        return (
            <div className="space-y-4">
                <div className="h-24 bg-bg-card rounded-[32px] animate-pulse" />
                <div className="h-96 bg-bg-card rounded-[32px] animate-pulse" />
            </div>
        );
    }

    const assignedCount = entries.filter(e => e.facultyId).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between gap-6 bg-bg-card border border-border-custom rounded-[32px] p-7 shadow-xl">
                <div className="flex items-center gap-5">
                    <button
                        onClick={goBack}
                        className="w-11 h-11 rounded-2xl bg-bg-main border border-border-custom flex items-center justify-center text-text-muted hover:text-primary transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-text-main tracking-tight">Edit Timetable</h1>
                        <p className="text-[0.65rem] font-bold text-text-muted mt-0.5 uppercase tracking-widest">
                            Section {fullTimetable?.section?.name} • {fullTimetable?.academicYear}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Assignment progress summary */}
                    <div className="hidden sm:flex flex-col items-end">
                        <p className="text-[0.55rem] font-black text-text-muted uppercase tracking-widest">Faculty Coverage</p>
                        <p className={`text-sm font-black uppercase tracking-tighter ${assignedCount === entries.length && entries.length > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {assignedCount}/{entries.length} Slots
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content: Grid + Faculty panel side-by-side */}
            <div className="flex gap-6">
                {/* Timetable Grid */}
                <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-3">
                        <CalendarRange size={16} className="text-primary" />
                        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted">Schedule Grid</h3>
                        <span className="ml-auto text-[0.6rem] text-text-muted font-bold">Click any cell to edit or add a slot</span>
                    </div>
                    <TimetableGrid
                        timeSlots={timeSlots}
                        entries={entries}
                        onSlotClick={handleSlotClick}
                        onEntryClick={handleEntryClick}
                        highlightFacultyId={selectedFacultyId}
                    />
                </div>

                {/* Faculty Assignment Panel */}
                <div className="w-64 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted">Faculty Panel</h3>
                    </div>
                    <FacultyAssignmentPanel
                        entries={entries}
                        selectedFacultyId={selectedFacultyId}
                        onSelectFaculty={setSelectedFacultyId}
                    />
                </div>
            </div>

            {/* Slot Modal */}
            {modalConfig.isOpen && (
                <TimetableEntryModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ isOpen: false, slot: null, existingEntry: null })}
                    slot={modalConfig.slot}
                    day={modalConfig.slot?.dayOfWeek}
                    sectionId={fullTimetable?.sectionId}
                    existingEntry={modalConfig.existingEntry}
                    academicYear={fullTimetable?.academicYear}
                    timetableId={timetableId}
                    onSave={handleSaveEntry}
                    onDelete={handleDeleteRequest}
                    isPending={updateSlot.isPending}
                />
            )}

            {/* Delete Confirm Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, entry: null })}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteSlot.isPending}
                title="Delete Slot?"
                description="This will permanently remove this slot from the timetable. This action cannot be undone."
                confirmLabel="Delete Slot"
                confirmVariant="danger"
            />
        </div>
    );
};

export default EditTimetablePage;
