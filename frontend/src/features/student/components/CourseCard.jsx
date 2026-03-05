import React from 'react';
import { MoreVertical, User, MapPin, Clock, BarChart3 } from 'lucide-react';

const CourseCard = ({ course }) => {
    // Randomized slight imperfection in rotation for "handcrafted" look if desired
    // const rotation = Math.random() * 1 - 0.5;

    return (
        <div className="group relative bg-bg-card hover:bg-black/5 dark:hover:bg-[#1A1B1E] border border-border-custom rounded-[28px] p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/5 cursor-pointer flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-border-custom/50">
                        {course.code?.[0]}
                    </div>
                    <button className="p-1 px-2 text-text-muted hover:text-text-main transition-colors bg-transparent border-none">
                        <MoreVertical size={18} />
                    </button>
                </div>

                <div className="space-y-0.5 mb-4">
                    <span className="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em]">{course.code}</span>
                    <h3 className="text-lg font-bold text-text-main line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{course.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-custom text-text-muted">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-border-custom/30 shrink-0">
                            <User size={12} />
                        </div>
                        <span className="text-[0.7rem] font-bold truncate">{course.faculty || 'Dr. Amara Singh'}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-border-custom/30 shrink-0">
                            <MapPin size={12} />
                        </div>
                        <span className="text-[0.7rem] font-bold truncate">{course.room || 'B-302'}</span>
                    </div>
                </div>
            </div>

            {/* Attendance & Progress Indicators */}
            <div className="mt-6 space-y-3">
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-text-muted/60 px-1">
                        <span className="flex items-center gap-1"><BarChart3 size={10} /> Attendance</span>
                        <span className={`font-black ${course.attendance >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>{course.attendance}%</span>
                    </div>
                    <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-border-custom/20">
                        <div 
                            className={`h-full transition-all duration-1000 ${course.attendance >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${course.attendance}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[0.6rem] font-black uppercase tracking-widest text-text-muted/60 px-1">
                        <span className="flex items-center gap-1"><Clock size={10} /> Syllabus</span>
                        <span className="font-black text-primary">{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden border border-border-custom/20">
                        <div 
                            className="h-full bg-primary transition-all duration-1500"
                            style={{ width: `${course.progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
