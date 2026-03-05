import React, { useState } from 'react';
import { X, Book, Calendar, Clock, MapPin, Check, AlertCircle } from 'lucide-react';
import { useScheduleSubject } from '../hooks/useExams';
import { useCourses } from '../hooks/useAcademics';
import { useClassrooms } from '../hooks/useTimetable';

const ExamScheduleModal = ({ isOpen, onClose, examId }) => {
    const { data: courses } = useCourses();
    const { data: classrooms } = useClassrooms();
    const scheduleSubject = useScheduleSubject();

    const [formData, setFormData] = useState({
        courseId: '',
        examDate: '',
        startTime: '',
        endTime: '',
        classroomId: '',
        maxMarks: 100,
        passingMarks: 40
    });

    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await scheduleSubject.mutateAsync({
                ...formData,
                examId
            });
            onClose();
            setFormData({
                courseId: '', examDate: '', startTime: '', endTime: '',
                classroomId: '', maxMarks: 100, passingMarks: 40
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Conflict detected or server error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-bg-card border border-border-custom rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <header className="px-8 py-6 flex justify-between items-center bg-bg-card border-b border-border-custom">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                            <Book size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold m-0 text-text-main">Schedule Subject</h3>
                            <p className="text-[0.75rem] text-text-muted m-0 font-medium uppercase tracking-wider">Subject-Level Paper Allocation</p>
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

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Target Course</label>
                            <div className="relative">
                                <select 
                                    name="courseId" 
                                    required 
                                    value={formData.courseId} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all appearance-none"
                                >
                                    <option value="">Select Course</option>
                                    {courses?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                                </select>
                                <Book size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Exam Date</label>
                                <div className="relative">
                                    <input 
                                        name="examDate" 
                                        type="date" 
                                        required 
                                        value={formData.examDate} 
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                    />
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Hall / Classroom</label>
                                <div className="relative">
                                    <select 
                                        name="classroomId" 
                                        required 
                                        value={formData.classroomId} 
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="">Select Venue</option>
                                        {classrooms?.map(r => <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>)}
                                    </select>
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Start Time</label>
                                <div className="relative">
                                    <input 
                                        name="startTime" 
                                        type="time" 
                                        required 
                                        value={formData.startTime} 
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                    />
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">End Time</label>
                                <div className="relative">
                                    <input 
                                        name="endTime" 
                                        type="time" 
                                        required 
                                        value={formData.endTime} 
                                        onChange={handleChange}
                                        className="w-full bg-bg-main border border-border-custom rounded-2xl px-10 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                    />
                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted opacity-40" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Max Marks</label>
                                <input 
                                    name="maxMarks" 
                                    type="number" 
                                    value={formData.maxMarks} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest pl-1">Passing Marks</label>
                                <input 
                                    name="passingMarks" 
                                    type="number" 
                                    value={formData.passingMarks} 
                                    onChange={handleChange}
                                    className="w-full bg-bg-main border border-border-custom rounded-2xl px-4 py-3.5 text-[0.9rem] text-text-main outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={scheduleSubject.isLoading}
                            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                        >
                            {scheduleSubject.isLoading ? 'Verifying Conflict...' : <><Check size={20} /> Schedule Subject</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamScheduleModal;
