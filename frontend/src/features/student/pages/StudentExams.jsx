import React, { useState } from 'react';
import { useStudentExams, useStudentResults } from '../../../hooks/useExams';
import { Calendar, Award, Clock, MapPin, Search } from 'lucide-react';

const StudentExams = () => {
    const [activeTab, setActiveTab] = useState('SCHEDULE'); // SCHEDULE or RESULTS
    
    const { data: scheduleData, isLoading: loadingSchedule } = useStudentExams();
    const { data: resultsData, isLoading: loadingResults } = useStudentResults();

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        Examination <span className="text-primary italic">Portal</span>
                    </h1>
                    <p className="text-text-muted font-medium">View your upcoming schedules and past results.</p>
                </div>
                
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl self-start md:self-end">
                    <button 
                        onClick={() => setActiveTab('SCHEDULE')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'SCHEDULE' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        Schedule
                    </button>
                    <button 
                        onClick={() => setActiveTab('RESULTS')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'RESULTS' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        Results
                    </button>
                </div>
            </header>

            {activeTab === 'SCHEDULE' && (
                <ScheduleView scheduleData={scheduleData} isLoading={loadingSchedule} />
            )}

            {activeTab === 'RESULTS' && (
                <ResultsView resultsData={resultsData} isLoading={loadingResults} />
            )}
        </div>
    );
};

const ScheduleView = ({ scheduleData, isLoading }) => {
    if (isLoading) return <div className="text-center p-20 animate-pulse text-primary font-bold">Loading Schedule...</div>;

    if (!scheduleData || scheduleData.length === 0) {
        return (
            <div className="glass-card p-20 flex flex-col items-center justify-center text-text-muted">
                <Calendar size={64} className="mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-text-main">No Upcoming Exams</h3>
                <p>Your examination schedule has not been published yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            {scheduleData.map(exam => (
                <div key={exam.id} className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <h2 className="text-2xl font-black text-text-main">{exam.name}</h2>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{exam.type}</span>
                        <span className="text-sm font-bold text-text-muted ml-auto">{exam.academicYear}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {exam.papers?.map(paper => {
                            const hallAssignment = paper.hallAssignments?.[0]; // Usually one hall for a student, simplified here
                            return (
                                <div key={paper.id} className="glass-card p-6 border-l-4 border-l-primary hover:-translate-y-1 transition-transform group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{paper.subject?.name}</h3>
                                            <p className="text-sm text-text-muted font-medium">{paper.subject?.code}</p>
                                        </div>
                                        <div className="text-right bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                                            <span className="block text-2xl font-black text-primary leading-none">{new Date(paper.examDate).getDate()}</span>
                                            <span className="text-[0.65rem] uppercase font-bold text-text-muted tracking-widest">
                                                {new Date(paper.examDate).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-6">
                                        <div className="flex items-center gap-3 text-sm text-text-muted font-medium bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border-custom/50">
                                            <Clock size={16} className="text-primary" />
                                            <span>{paper.startTime.slice(0,5)} - {paper.endTime.slice(0,5)}</span>
                                        </div>
                                        {hallAssignment ? (
                                            <div className="flex items-center gap-3 text-sm text-text-muted font-medium bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border-custom/50">
                                                <MapPin size={16} className="text-primary" />
                                                <span>Hall: <strong className="text-text-main">{hallAssignment.hall?.name}</strong></span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 text-sm text-orange-500 font-medium bg-orange-500/10 p-3 rounded-xl">
                                                <MapPin size={16} />
                                                <span>Hall TBA</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ResultsView = ({ resultsData, isLoading }) => {
    if (isLoading) return <div className="text-center p-20 animate-pulse text-primary font-bold">Loading Results...</div>;

    if (!resultsData || resultsData.length === 0) {
        return (
            <div className="glass-card p-20 flex flex-col items-center justify-center text-text-muted">
                <Award size={64} className="mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-text-main">No Results Found</h3>
                <p>Your examination results are not yet available.</p>
            </div>
        );
    }

    // Group by Exam Name
    const groupedResults = resultsData.reduce((acc, result) => {
        const examName = result.paper?.exam?.name || 'Other';
        if (!acc[examName]) acc[examName] = [];
        acc[examName].push(result);
        return acc;
    }, {});

    return (
        <div className="flex flex-col gap-10">
            {Object.entries(groupedResults).map(([examName, results]) => {
                const totalCredits = results.reduce((acc, r) => acc + (r.paper?.subject?.credits || 0), 0);
                
                // Simple SGPA calculation mock (assuming 10 point scale)
                const gradePoints = { 'O': 10, 'A+': 9, 'A': 8, 'B': 7, 'C': 6, 'P': 5, 'F': 0 };
                let totalPoints = 0;
                results.forEach(r => {
                    const credits = r.paper?.subject?.credits || 0;
                    const points = gradePoints[r.grade] || 0;
                    totalPoints += (credits * points);
                });
                const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';

                return (
                    <div key={examName} className="glass-card overflow-hidden">
                        <div className="bg-primary/5 border-b border-border-custom p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-text-main">{examName}</h3>
                                <p className="text-sm font-medium text-text-muted">{results[0]?.paper?.exam?.academicYear}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-3xl font-black text-primary leading-none">{sgpa}</span>
                                <span className="text-[0.6rem] uppercase font-bold tracking-widest text-text-muted">Overall GPA</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/5 dark:bg-white/5">
                                        <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-xs">Subject Code</th>
                                        <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-xs">Subject Name</th>
                                        <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-xs text-center">Marks</th>
                                        <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-xs text-center">Grade</th>
                                        <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-xs">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-custom/30 text-text-main">
                                    {results.map((result, idx) => (
                                        <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium">{result.paper?.subject?.code}</td>
                                            <td className="p-4 font-bold">{result.paper?.subject?.name}</td>
                                            <td className="p-4 text-center font-bold">
                                                {result.isAbsent ? '-' : result.marksObtained}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm
                                                    ${result.grade === 'F' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {result.isAbsent ? 'AB' : result.grade}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {result.isAbsent ? (
                                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Absent</span>
                                                ) : result.grade === 'F' ? (
                                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Fail</span>
                                                ) : (
                                                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Pass</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default StudentExams;
