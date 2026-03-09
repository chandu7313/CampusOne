import React from 'react';
import { ClipboardCheck, PieChart, TrendingUp, AlertCircle } from 'lucide-react';
import { useMyAttendance } from '../../../hooks/useAttendance';

const StudentAttendance = () => {
    const { data: attendanceStats, isLoading } = useMyAttendance();

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

    const overallPercentage = attendanceStats?.length > 0
        ? attendanceStats.reduce((acc, curr) => acc + curr.percentage, 0) / attendanceStats.length
        : 0;

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        Attendance <span className="text-primary italic">Stats</span>
                    </h1>
                    <p className="text-text-muted font-medium">Track your presence across all enrolled subjects.</p>
                </div>
                
                <div className="flex items-center gap-6 hidden sm:flex">
                     <div className="flex flex-col items-end">
                         <p className="text-[0.65rem] uppercase tracking-widest text-text-muted font-bold mb-1">Overall Attendance</p>
                         <h2 className={`text-4xl font-black ${overallPercentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                             {overallPercentage.toFixed(1)}%
                         </h2>
                     </div>
                </div>
            </header>

            {overallPercentage < 75 && overallPercentage > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4">
                    <div className="bg-red-500/20 p-2 rounded-xl text-red-500">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-500">Shortage Warning</h4>
                        <p className="text-sm text-red-500/80">Your overall attendance is below the mandatory 75% threshold.</p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {attendanceStats?.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 flex flex-col gap-5 relative overflow-hidden group">
                        
                        {/* Status bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/5">
                            <div 
                                className={`h-full transition-all duration-1000 ${
                                    stat.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${stat.percentage}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-start pt-2">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors">
                                    {stat.subject?.name}
                                </h3>
                                <p className="text-sm text-text-muted font-medium mt-1">{stat.subject?.code}</p>
                            </div>
                            <div className={`text-2xl font-black ${stat.percentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.percentage.toFixed(0)}%
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Present</span>
                                <span className="text-xl font-black text-text-main">{stat.present}</span>
                            </div>
                            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl flex flex-col">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Absent</span>
                                <span className="text-xl font-black text-text-main">{stat.absent}</span>
                            </div>
                        </div>

                    </div>
                ))}

                {(!attendanceStats || attendanceStats.length === 0) && (
                    <div className="col-span-full flex flex-col items-center justify-center text-text-muted/50 py-20 px-4 text-center glass-card">
                        <ClipboardCheck size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-text-main">No Data Available</h3>
                        <p className="text-sm mt-2 max-w-md">Attendance data has not been recorded for your classes yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentAttendance;
