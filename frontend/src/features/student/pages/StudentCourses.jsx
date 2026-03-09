import React from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { useStudentCourses } from '../hooks/useStudentDashboard';
import CourseCard from '../components/CourseCard';

const StudentCourses = () => {
    const { data: courses, isLoading } = useStudentCourses();

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

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        My <span className="text-primary italic">Courses</span>
                    </h1>
                    <p className="text-text-muted font-medium">Your current active learning pathways and academic subjects.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            className="bg-black/5 dark:bg-white/5 border border-border-custom/50 rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:border-primary/50 transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="p-3 bg-black/5 dark:bg-white/5 border border-border-custom/50 rounded-2xl text-text-muted hover:text-primary transition-all border-none cursor-pointer">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {courses?.length > 0 ? (
                    courses.map((course, i) => (
                        <CourseCard key={course.id} course={{
                            ...course,
                            attendance: 75 + i * 5,
                            progress: 40 + i * 12,
                            faculty: 'Professor Aris Thorne'
                        }} />
                    ))
                ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center glass-card border-dashed border-2 border-border-custom/30 bg-black/5 dark:bg-white/5">
                        <BookOpen size={80} className="text-text-muted mb-6 opacity-20" />
                        <h3 className="text-2xl font-black text-text-main italic tracking-tight uppercase">No Courses Found</h3>
                        <p className="text-text-muted font-medium mt-2 max-w-sm text-center">It seems you aren't enrolled in any courses for the current semester yet.</p>
                    </div>
                )}
            </div>

            {/* Stats Summary Footer */}
            {courses?.length > 0 && (
                <div className="mt-12 p-8 glass-card bg-primary/5 border-primary/10 flex flex-wrap justify-around gap-8">
                    <div className="text-center">
                        <span className="block text-3xl font-black text-primary italic leading-none">{courses.length}</span>
                        <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.2em] mt-2 block">Total Subjects</span>
                    </div>
                    <div className="w-px h-12 bg-border-custom/50 hidden md:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl font-black text-emerald-500 italic leading-none">82%</span>
                        <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.2em] mt-2 block">Avg. Attendance</span>
                    </div>
                    <div className="w-px h-12 bg-border-custom/50 hidden md:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl font-black text-amber-500 italic leading-none">12.5</span>
                        <span className="text-[0.65rem] font-bold text-text-muted uppercase tracking-[0.2em] mt-2 block">Weekly Load</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCourses;
