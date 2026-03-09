import React from 'react';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { useMyTimetable } from '../../../hooks/useMyTimetable';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetablePage = () => {
    const { data: entries, isLoading } = useMyTimetable();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Group entries by day
    const timetableByDay = DAYS.reduce((acc, day) => {
        acc[day] = entries?.filter(e => e.timeSlot?.dayOfWeek === day) || [];
        return acc;
    }, {});

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        My <span className="text-primary italic">Timetable</span>
                    </h1>
                    <p className="text-text-muted font-medium">Your weekly schedule and class timings.</p>
                </div>
                
                <div className="flex items-center gap-4 hidden sm:flex">
                     <div className="p-3 bg-primary/10 rounded-xl flex items-center gap-3">
                         <Calendar className="text-primary" size={24} />
                         <div>
                             <p className="text-[0.6rem] uppercase tracking-widest text-text-muted font-bold">Current Term</p>
                             <p className="text-sm font-bold text-primary">Fall 2026</p>
                         </div>
                     </div>
                </div>
            </header>

            {/* Timetable Grid View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {DAYS.map(day => (
                    <div key={day} className="glass-card p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-border-custom/30 pb-3">
                            <h3 className="text-xl font-bold tracking-tight text-text-main">{day}</h3>
                            <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
                                {timetableByDay[day].length} Classes
                            </span>
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-3 min-h-[150px]">
                            {timetableByDay[day].length > 0 ? (
                                timetableByDay[day].map((entry, idx) => (
                                    <div key={idx} className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-transparent hover:border-primary/30 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-text-main text-sm truncate pr-2 group-hover:text-primary transition-colors">
                                                {entry.subject?.name || 'Unknown Subject'}
                                            </h4>
                                            <span className="text-xs font-semibold text-text-muted flex items-center gap-1 shrink-0 bg-white/50 dark:bg-black/50 px-2 py-0.5 rounded-md">
                                                <Clock size={12} />
                                                {entry.timeSlot?.startTime} - {entry.timeSlot?.endTime}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1.5 mt-3">
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <MapPin size={14} className="opacity-70" />
                                                <span>{entry.classroom?.name || 'TBA'}</span>
                                            </div>
                                            {entry.faculty && (
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <User size={14} className="opacity-70" />
                                                    <span>{entry.faculty.firstName} {entry.faculty.lastName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-text-muted/50 py-6">
                                    <BookOpen size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm font-medium">No classes scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetablePage;
