import React, { useState } from 'react';
import { X, Book, User, MapPin, Clock, AlertCircle, Check } from 'lucide-react';
import { useCreateTimetableEntry } from '../hooks/useTimetable';
import { useCourses } from '../hooks/useAcademics';
import { useFacultyProfiles } from '../hooks/useFaculty';
import { useClassrooms } from '../hooks/useTimetable';

const TimetableEntryModal = ({ isOpen, onClose, slot, day, sectionId }) => {
    const { data: courses } = useCourses();
    const { data: faculty } = useFacultyProfiles(); // Ideally filtered by course dept
    const { data: classrooms } = useClassrooms();
    const createEntry = useCreateTimetableEntry();

    const [formData, setFormData] = useState({
        courseId: '',
        facultyAssignmentId: '', // For simplicity, we'll map facultyId to an assignment later
        classroomId: '',
        type: 'Lecture'
    });

    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await createEntry.mutateAsync({
                ...formData,
                dayOfWeek: day,
                timeSlotId: slot.id,
                sectionId
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Conflict detected or server error');
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-card border border-border-custom rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <header className="px-8 py-6 flex justify-between items-center bg-bg-card border-b border-border-custom">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold m-0 text-text-main">Schedule Slot</h3>
                            <p className="text-[0.75rem] text-text-muted m-0 font-medium uppercase tracking-wider">{day} • {slot.startTime.split(':').slice(0, 2).join(':')} - {slot.endTime.split(':').slice(0, 2).join(':')}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-xl transition-colors border-none cursor-pointer text-text-muted">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-5 py-3 rounded-2xl text-[0.8rem] font-bold flex items-center gap-3">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Course / Subject</label>
                            <div className="relative group">
                                <select 
                                    name="courseId" 
                                    required 
                                    value={formData.courseId} 
                                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all appearance-none"
                                >
                                    <option value="">Select Course</option>
                                    {courses?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                                </select>
                                <Book size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Faculty Member</label>
                            <div className="relative group">
                                <select 
                                    name="facultyId" 
                                    required 
                                    value={formData.facultyId} 
                                    onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all appearance-none"
                                >
                                    <option value="">Assign Professor</option>
                                    {faculty?.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.user?.firstName} {f.user?.lastName} (Current Load: {f.currentWeeklyHours}h)
                                        </option>
                                    ))}
                                </select>
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Classroom / Hall</label>
                            <div className="relative group">
                                <select 
                                    name="classroomId" 
                                    required 
                                    value={formData.classroomId} 
                                    onChange={(e) => setFormData({...formData, classroomId: e.target.value})}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all appearance-none"
                                >
                                    <option value="">Select Room</option>
                                    {classrooms?.map(r => <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>)}
                                </select>
                                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={onClose} className="py-3.5 rounded-2xl bg-bg-main text-text-muted font-bold hover:text-text-main transition-all border-none cursor-pointer">Discard</button>
                                <button 
                                    type="submit" 
                                    disabled={createEntry.isLoading}
                                    className="py-3.5 rounded-2xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                                >
                                    {createEntry.isLoading ? 'Verifying...' : <><Check size={18} /> Schedule Block</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimetableEntryModal;
