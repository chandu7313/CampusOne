import React, { useState } from 'react';
import { FileText, Plus, Calendar, Users, CheckCircle, Clock, AlertCircle, ChevronRight, Upload, Book, MapPin, PlusCircle, ArrowLeft } from 'lucide-react';
import { useExams, useExamSchedule } from '../hooks/useExams';
import ExamMutationModal from './ExamMutationModal';
import ExamScheduleModal from './ExamScheduleModal';

const ExamConsole = () => {
    const { data: exams, isLoading } = useExams();
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [isMutationModalOpen, setIsMutationModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const { data: schedule, isLoading: isScheduleLoading } = useExamSchedule(selectedExamId);

    const activeExam = exams?.find(e => e.id === selectedExamId);

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                    {selectedExamId && (
                        <button 
                            onClick={() => setSelectedExamId(null)}
                            className="p-2 hover:bg-bg-card rounded-xl transition-all border-none cursor-pointer text-text-muted"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold m-0 text-text-main">
                            {selectedExamId ? activeExam?.name : 'Examination Console'}
                        </h2>
                        <p className="text-text-muted text-[0.95rem] mt-1">
                            {selectedExamId ? `${activeExam?.type} • Semester ${activeExam?.semesterNumber}` : 'Schedule Assessments & Academic Audits'}
                        </p>
                    </div>
                </div>
                {!selectedExamId ? (
                    <button 
                        onClick={() => setIsMutationModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer border-none"
                    >
                        <Plus size={18} /> Plan New Exam
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer border-none"
                    >
                        <PlusCircle size={18} /> Schedule Subject
                    </button>
                )}
            </header>

            <div className="grid grid-cols-[1fr_400px] gap-8 max-2xl:grid-cols-1">
                <main className="flex flex-col gap-6">
                    {!selectedExamId ? (
                        <>
                            <div className="flex gap-4 border-b border-border-custom pb-1">
                                <button className="px-4 py-2 border-b-2 border-primary text-primary text-sm font-bold">Active Exams</button>
                                <button className="px-4 py-2 text-text-muted text-sm font-medium hover:text-text-main">Drafts</button>
                                <button className="px-4 py-2 text-text-muted text-sm font-medium hover:text-text-main">Completed</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {isLoading ? (
                                    <div className="text-center py-20 opacity-40">Loading Exam events...</div>
                                ) : exams?.length === 0 ? (
                                    <div className="glass p-12 text-center rounded-[32px] border-dashed border-2 border-border-custom">
                                        <FileText size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="text-text-muted">No active examinations found.</p>
                                    </div>
                                ) : exams?.map(exam => (
                                    <div key={exam.id} onClick={() => setSelectedExamId(exam.id)} className="glass p-6 rounded-[28px] border border-border-custom/30 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                                                exam.type === 'FINAL' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                                {exam.type === 'FINAL' ? 'F' : 'M'}
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{exam.name}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[0.75rem] text-text-muted flex items-center gap-1.5 font-medium">
                                                        <Calendar size={14} className="opacity-50" /> {exam.academicYear}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`text-[0.7rem] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border ${
                                                exam.status === 'PUBLISHED' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-primary/5 text-primary border-primary/20'
                                            }`}>
                                                {exam.status}
                                            </span>
                                            <ChevronRight size={20} className="text-text-muted opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                                <PlusCircle className="text-indigo-500" /> Subject Schedule
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {isScheduleLoading ? (
                                    <div className="text-center py-20 opacity-40">Syncing Schedule...</div>
                                ) : (schedule?.papers?.length === 0 || !schedule?.papers) ? (
                                    <div className="glass p-12 text-center rounded-[32px] border-dashed border-2 border-border-custom">
                                        <Book size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="text-text-muted text-sm font-medium">No subjects scheduled for this exam event.</p>
                                        <button onClick={() => setIsScheduleModalOpen(true)} className="mt-4 bg-indigo-500/10 text-indigo-500 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer">
                                            Schedule First Paper
                                        </button>
                                    </div>
                                ) : schedule?.papers?.map(sub => (
                                    <div key={sub.id} className="glass p-5 rounded-2xl border border-border-custom/30 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-bold">
                                                {sub.subject?.code?.[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-text-main text-[0.9rem]">{sub.subject?.name}</span>
                                                <span className="text-[0.65rem] text-text-muted font-black tracking-widest uppercase">{sub.subject?.code}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-bold text-text-main">{new Date(sub.examDate).toLocaleDateString()}</span>
                                                <span className="text-[0.65rem] text-text-muted font-medium">{sub.startTime?.slice(0,5)} - {sub.endTime?.slice(0,5)}</span>
                                            </div>
                                            <div className="flex flex-col items-end min-w-[100px]">
                                                <span className="text-sm font-bold text-indigo-500">Room {sub.hallAssignments?.[0]?.hall?.name || 'TBD'}</span>
                                                <span className="text-[0.65rem] text-text-muted font-medium uppercase tracking-tighter">Venue Allocation</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <aside className="flex flex-col gap-6">
                    <div className="glass p-8 rounded-[32px] border border-border-custom/30 bg-bg-card/20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Clock size={120} />
                        </div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Clock className="text-amber-500" /> Upcoming Deadlines
                        </h4>
                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center bg-bg-card border border-border-custom rounded-xl p-2 min-w-[50px]">
                                    <span className="text-[0.6rem] font-bold text-text-muted uppercase">Mar</span>
                                    <span className="text-lg font-bold">12</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-text-main">Internal Marks Entry</span>
                                    <span className="text-[0.75rem] text-text-muted italic">Odd Semester 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[32px] border border-border-custom/30 bg-primary/5">
                        <CheckCircle className="text-emerald-500 mb-4" />
                        <h4 className="text-[0.95rem] font-bold mb-2 text-text-main">Result Readiness</h4>
                        <p className="text-[0.8rem] text-text-muted leading-relaxed mb-6 font-medium">
                            Internal audit metrics indicate high faculty compliance. Review finalized data for result processing.
                        </p>
                        <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all border-none cursor-pointer">
                            <Upload size={16} /> Bulk Upload Results
                        </button>
                    </div>
                </aside>
            </div>

            <ExamMutationModal 
                isOpen={isMutationModalOpen}
                onClose={() => setIsMutationModalOpen(false)}
            />

            <ExamScheduleModal 
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                examId={selectedExamId}
            />
        </div>
    );
};

export default ExamConsole;
