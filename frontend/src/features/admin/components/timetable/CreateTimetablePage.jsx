import React, { useState, useMemo } from 'react';
import { 
    CalendarRange, Save, ArrowLeft, AlertTriangle, 
    CheckCircle, Info, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAcademicHierarchy } from '../../hooks/useAcademics';
import { useTimetables, useCreateTimetable, useTimeSlots } from '../../hooks/useTimetable';
import DepartmentSelector from './DepartmentSelector';
import ProgramSelector from './ProgramSelector';
import YearSelector from './YearSelector';
import SemesterSelector from './SemesterSelector';
import SectionSelector from './SectionSelector';
import TimetableGrid from './TimetableGrid';
import TimetableEntryModal from '../TimetableEntryModal';
import { useToast } from '../../../../hooks/useToast';

const CreateTimetablePage = ({ onBack }) => {
    const navigate = useNavigate();
    const goBack = () => (onBack ? onBack() : navigate('/admin/timetable'));
    const { toast } = useToast();
    const { data: hierarchy } = useAcademicHierarchy();
    const { data: timeSlots } = useTimeSlots();
    const { data: existingTimetables } = useTimetables(); // To check for existing sections
    
    const [selection, setSelection] = useState({
        departmentId: '',
        programId: '',
        yearId: '',
        semesterId: '',
        sectionId: '',
        academicYear: '2025-26' // Updated default
    });

    const [draftEntries, setDraftEntries] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, slot: null, day: '' });
    
    // Derived hierarchy
    const selectedDept = useMemo(() => hierarchy?.find(d => d.id === selection.departmentId), [hierarchy, selection.departmentId]);
    const selectedProgram = useMemo(() => selectedDept?.programs?.find(p => p.id === selection.programId), [selectedDept, selection.programId]);
    const selectedYear = useMemo(() => selectedProgram?.years?.find(y => y.id === selection.yearId), [selectedProgram, selection.yearId]);
    const selectedSemester = useMemo(() => selectedYear?.semesters?.find(s => s.id === selection.semesterId), [selectedYear, selection.semesterId]);
    const sections = selectedSemester?.sections || [];

    // Existing section IDs for this semester/year to disable in dropdown
    const existingSectionIds = useMemo(() => {
        return existingTimetables
            ?.filter(tt => tt.semesterId === selection.semesterId && tt.academicYear === selection.academicYear)
            ?.map(tt => tt.sectionId) || [];
    }, [existingTimetables, selection.semesterId, selection.academicYear]);

    const createMutation = useCreateTimetable();

    const handleSlotClick = (slot) => {
        setModalConfig({ isOpen: true, slot, day: slot.dayOfWeek });
    };

    // Updated signature: TimetableGrid passes (resolvedSlot, entry) for filled cells
    const handleEntryClick = (slot, entry) => {
        setModalConfig({ isOpen: true, slot, day: slot.dayOfWeek });
    };

    const handleSaveEntry = (entry) => {
        setDraftEntries(prev => {
            const index = prev.findIndex(e => e.timeSlotId === entry.timeSlotId);
            if (index > -1) {
                const newEntries = [...prev];
                newEntries[index] = entry;
                return newEntries;
            }
            return [...prev, entry];
        });
    };

    const handleDeleteEntry = (entry) => {
        setDraftEntries(prev => prev.filter(e => e.timeSlotId !== entry.timeSlotId));
    };

    const handleSubmit = async () => {
        if (draftEntries.length === 0) {
            toast('Please add at least one slot to the timetable.', 'warning');
            return;
        }

        try {
            // Strip local draft IDs and display-only fields — backend auto-generates UUIDs
            // Inject required sectionId and academicYear into each entry
            const cleanEntries = draftEntries.map(({ id, subject, faculty, classroom, ...rest }) => ({
                ...rest,
                sectionId: selection.sectionId,
                academicYear: selection.academicYear
            }));

            await createMutation.mutateAsync({
                ...selection,
                entries: cleanEntries
            });
            toast('Timetable published successfully!', 'success');
            goBack();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to publish timetable';
            toast(msg, 'error');
            console.error(err);
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            {/* Header Area */}
            <div className="flex items-center justify-between gap-6 bg-bg-card border border-border-custom rounded-[32px] p-8 shadow-xl">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={goBack}
                        className="w-12 h-12 rounded-2xl bg-bg-main border border-border-custom flex items-center justify-center text-text-muted hover:text-primary transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight">Create Timetable</h1>
                        <p className="text-[0.7rem] font-bold text-text-muted mt-1 uppercase tracking-widest flex items-center gap-2">
                             New Schedule Builder
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[0.6rem] font-black text-text-muted uppercase tracking-widest">Drafting Status</p>
                        <p className="text-[0.8rem] font-black text-emerald-500 uppercase tracking-tighter">{draftEntries.length} Slots Assigned</p>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={!selection.sectionId || draftEntries.length === 0}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-[24px] font-black hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all border-none cursor-pointer disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                    >
                        <Save size={20} />
                        Publish Timetable
                    </button>
                </div>
            </div>

            {/* Step 1: Hierarchy Selection */}
            <div className="bg-bg-card border border-border-custom rounded-[32px] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <CheckCircle size={18} className="text-primary" />
                    <h3 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">Step 1: Define Target Class</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <DepartmentSelector 
                        departments={hierarchy} 
                        selectedDeptId={selection.departmentId} 
                        onChange={(val) => setSelection({ ...selection, departmentId: val, programId: '', yearId: '', semesterId: '', sectionId: '' })} 
                    />
                    <ProgramSelector 
                        programs={selectedDept?.programs} 
                        selectedProgramId={selection.programId} 
                        onChange={(val) => setSelection({ ...selection, programId: val, yearId: '', semesterId: '', sectionId: '' })} 
                        disabled={!selection.departmentId}
                    />
                    <YearSelector 
                        years={selectedProgram?.years} 
                        selectedYearId={selection.yearId} 
                        onChange={(val) => setSelection({ ...selection, yearId: val, semesterId: '', sectionId: '' })} 
                        disabled={!selection.programId}
                    />
                    <SemesterSelector 
                        semesters={selectedYear?.semesters} 
                        selectedSemesterId={selection.semesterId} 
                        onChange={(val) => setSelection({ ...selection, semesterId: val, sectionId: '' })} 
                        disabled={!selection.yearId}
                    />
                    <SectionSelector 
                        sections={sections} 
                        selectedSectionId={selection.sectionId} 
                        onChange={(val) => setSelection({ ...selection, sectionId: val })} 
                        disabled={!selection.semesterId}
                        existingTimetableSectionIds={existingSectionIds}
                    />
                </div>
            </div>

            {/* Step 2: Grid Builder */}
            {selection.sectionId ? (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CalendarRange size={18} className="text-primary" />
                            <h3 className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-text-muted">Step 2: Assign Schedule Slots</h3>
                        </div>
                        <div className="bg-primary/5 text-primary text-[0.65rem] font-black px-4 py-2 rounded-full border border-primary/10">
                            SECTION {selectedSemester?.sections?.find(s => s.id === selection.sectionId)?.name} • SEMESTER {selectedSemester?.semesterNumber} • {selection.academicYear}
                        </div>
                    </div>

                    <TimetableGrid
                        timeSlots={timeSlots}
                        entries={draftEntries}
                        onSlotClick={handleSlotClick}
                        onEntryClick={handleEntryClick}
                    />
                </div>
            ) : (
                <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mb-6 animate-pulse">
                        <Info size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-text-main mb-2">Select a Class to Begin Building</h2>
                    <p className="text-text-muted max-w-md font-medium">Use the selectors above to target a specific Department, Program, and Section to start the scheduling process.</p>
                </div>
            )}

            {modalConfig.isOpen && (
                <TimetableEntryModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    slot={modalConfig.slot}
                    day={modalConfig.day}
                    sectionId={selection.sectionId}
                    existingEntry={draftEntries.find(e => e.timeSlotId === modalConfig.slot?.id && e.dayOfWeek === modalConfig.slot?.dayOfWeek)}
                    academicYear={selection.academicYear}
                    onSave={handleSaveEntry}
                    onDelete={handleDeleteEntry}
                />
            )}
        </div>
    );
};

export default CreateTimetablePage;
