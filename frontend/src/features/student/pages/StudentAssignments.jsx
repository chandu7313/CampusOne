import React, { useState } from 'react';
import { useStudentAssignments, useSubmitAssignment } from '../../../hooks/useAssignments';
import { FileText, UploadCloud, Clock, CheckCircle } from 'lucide-react';

const StudentAssignments = () => {
    const { data: assignments, isLoading } = useStudentAssignments();
    const submitMutation = useSubmitAssignment();
    
    // Simplistic local state for URL submission (Replace with actual Cloudinary widget in prod)
    const [submissionUrls, setSubmissionUrls] = useState({});

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

    const handleUrlChange = (id, value) => {
        setSubmissionUrls(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (assignmentId) => {
        const url = submissionUrls[assignmentId];
        if (!url) return alert("Please provide a submission URL or file link.");
        
        submitMutation.mutate({
            assignmentId,
            submissionUrl: url
        });
    };

    const pendingAssignments = assignments?.filter(a => !a.submissions?.length || a.submissions[0].status === 'LATE') || [];
    const completedAssignments = assignments?.filter(a => a.submissions?.length > 0 && a.submissions[0].status !== 'LATE') || [];

    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        My <span className="text-primary italic">Assignments</span>
                    </h1>
                    <p className="text-text-muted font-medium">Manage and submit your pending coursework.</p>
                </div>
                
                <div className="flex items-center gap-4">
                     <div className="p-3 bg-primary/10 rounded-xl flex items-center gap-3 border border-primary/20">
                         <div className="text-right">
                             <p className="text-[0.65rem] uppercase tracking-widest text-text-muted font-bold mb-1">Pending Total</p>
                             <h2 className="text-xl font-black text-primary">{pendingAssignments.length} Tasks</h2>
                         </div>
                     </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Pending Tasks */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">Pending</h2>
                        <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">{pendingAssignments.length}</span>
                    </div>

                    {pendingAssignments.map(assignment => (
                        <div key={assignment.id} className="glass-card p-6 border-l-4 border-l-orange-500 hover:border-l-primary transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{assignment.title}</h3>
                                    <p className="text-sm text-text-muted">{assignment.subject?.name}</p>
                                </div>
                                <span className="text-xs font-bold bg-black/5 dark:bg-white/5 py-1 px-3 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                                    <Clock size={12} className="text-orange-500"/> 
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <p className="text-sm text-text-muted line-clamp-2 mb-5">{assignment.description || 'No description provided.'}</p>
                            
                            <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl flex flex-col gap-3 border border-border-custom">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Submission Link (e.g. Google Drive, Cloudinary)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="url" 
                                        placeholder="https://..."
                                        className="flex-1 input-custom text-sm"
                                        value={submissionUrls[assignment.id] || ''}
                                        onChange={(e) => handleUrlChange(assignment.id, e.target.value)}
                                    />
                                    <button 
                                        disabled={submitMutation.isPending}
                                        onClick={() => handleSubmit(assignment.id)}
                                        className="btn-primary text-sm px-4 flex items-center gap-2"
                                    >
                                        <UploadCloud size={16} /> Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {pendingAssignments.length === 0 && (
                        <div className="glass-card p-10 flex flex-col items-center justify-center text-center text-text-muted">
                            <CheckCircle size={48} className="mb-4 text-green-500 opacity-50" />
                            <h3 className="text-lg font-bold">All caught up!</h3>
                            <p className="text-sm mt-1">You have no pending assignments.</p>
                        </div>
                    )}
                </div>

                {/* Completed Tasks */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-text-main">Completed</h2>
                        <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-0.5 rounded-full">{completedAssignments.length}</span>
                    </div>

                    {completedAssignments.map(assignment => {
                        const submission = assignment.submissions[0];
                        return (
                            <div key={assignment.id} className="glass-card p-6 border-l-4 border-l-green-500 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-main">{assignment.title}</h3>
                                        <p className="text-sm text-text-muted">{assignment.subject?.name}</p>
                                    </div>
                                    {submission.status === 'GRADED' ? (
                                        <div className="text-right">
                                            <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Score</span>
                                            <p className="text-xl font-black text-green-500">{submission.marksObtained} <span className="text-sm text-text-muted font-medium">/ {assignment.totalMarks}</span></p>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-bold bg-green-500/10 text-green-500 py-1 px-3 rounded-full flex items-center gap-1.5">
                                            <CheckCircle size={12} /> Under Review
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-4 items-center text-xs font-medium text-text-muted">
                                    <span className="flex items-center gap-1"><FileText size={14}/> Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                                    {submission.submissionUrl && (
                                        <a href={submission.submissionUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                            View Submission
                                        </a>
                                    )}
                                </div>
                                {submission.feedback && (
                                    <div className="mt-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-border-custom text-sm italic text-text-muted">
                                        "{submission.feedback}"
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {completedAssignments.length === 0 && (
                        <div className="glass-card p-10 flex flex-col items-center justify-center text-center text-text-muted border border-dashed">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">No completed assignments yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAssignments;
