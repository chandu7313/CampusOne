import React, { useState } from 'react';
import { useFacultyAssignments, useCreateAssignment, useAssignmentSubmissions, useGradeSubmission } from '../../../hooks/useAssignments';
import { Plus, Users, CheckCircle, FileText, DownloadCloud } from 'lucide-react';

const FacultyAssignments = () => {
    // Mock subject for now - real app would select this from faculty's courses
    const mockSubjectId = "d5afbbf1-ecee-41d3-ad08-ad096c4491de"; 
    
    const { data: assignments, isLoading } = useFacultyAssignments(mockSubjectId);
    const createMutation = useCreateAssignment();
    
    const [isCreating, setIsCreating] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        totalMarks: 100,
        type: 'HOMEWORK'
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createMutation.mutate({
            subjectId: mockSubjectId,
            ...formData
        }, {
            onSuccess: () => {
                setIsCreating(false);
                setFormData({ title: '', description: '', dueDate: '', totalMarks: 100, type: 'HOMEWORK' });
            }
        });
    };

    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center p-20 animate-pulse text-primary font-bold">Loading Assignments...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-120px)]">
            
            {/* Left Panel: Assignment List & Creation */}
            <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-6 h-full overflow-y-auto pr-4 custom-scrollbar">
                <header className="flex justify-between items-end border-b border-border-custom/50 pb-4">
                    <div>
                        <h1 className="text-3xl font-black italic tracking-tighter text-text-main uppercase">
                            Assignments
                        </h1>
                        <p className="text-sm font-medium text-text-muted mt-1">Manage coursework & grades.</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(!isCreating)}
                        className="btn-primary rounded-full w-10 h-10 flex flex-col items-center justify-center p-0"
                    >
                        <Plus size={20} className={isCreating ? "rotate-45 transition-transform" : "transition-transform"} />
                    </button>
                </header>

                {isCreating && (
                    <form onSubmit={handleCreate} className="glass-card p-5 flex flex-col gap-4 border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.2)]">
                        <h3 className="font-bold text-text-main mb-2">Create New Assignment</h3>
                        
                        <input 
                            required type="text" placeholder="Assignment Title" className="input-custom"
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                        
                        <textarea 
                            required placeholder="Description and Instructions..." className="input-custom resize-none min-h-[80px]"
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                        
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-text-muted font-bold ml-1 mb-1 block">Due Date</label>
                                <input 
                                    required type="date" className="input-custom w-full"
                                    value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs text-text-muted font-bold ml-1 mb-1 block">Marks</label>
                                <input 
                                    required type="number" min="1" max="100" className="input-custom w-full"
                                    value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        <select 
                            className="input-custom"
                            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="HOMEWORK">Homework</option>
                            <option value="PROJECT">Project</option>
                            <option value="QUIZ">Quiz / Lab</option>
                        </select>

                        <button type="submit" disabled={createMutation.isPending} className="btn-primary w-full mt-2">
                            {createMutation.isPending ? 'Publishing...' : 'Publish Assignment'}
                        </button>
                    </form>
                )}

                <div className="flex flex-col gap-4">
                    {assignments?.map(assignment => (
                        <div 
                            key={assignment.id} 
                            onClick={() => setSelectedAssignmentId(assignment.id)}
                            className={`glass-card p-5 cursor-pointer transition-all border-l-4 ${selectedAssignmentId === assignment.id ? 'border-primary shadow-[0_4px_20px_rgba(var(--color-primary),0.15)] scale-[1.02]' : 'border-transparent hover:border-text-muted/30 hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-text-main line-clamp-1">{assignment.title}</h4>
                                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-primary/10 text-primary">
                                    {assignment.type.substring(0,4)}
                                </span>
                            </div>
                            <p className="text-sm text-text-muted line-clamp-2 mb-4">{assignment.description}</p>
                            <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-text-muted">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                <span className="text-text-main bg-black/5 dark:bg-white/10 px-2 py-1 rounded">{assignment.totalMarks} Marks</span>
                            </div>
                        </div>
                    ))}
                    
                    {assignments?.length === 0 && !isCreating && (
                        <div className="text-center p-10 text-text-muted/50 border border-dashed rounded-3xl">
                            <FileText size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">No assignments created yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Submissions & Grading */}
            <div className="w-full md:w-1/2 lg:w-2/3 glass-card rounded-3xl border border-border-custom/50 overflow-hidden flex flex-col h-full hidden md:flex">
                {selectedAssignmentId ? (
                    <SubmissionsView assignmentId={selectedAssignmentId} assignments={assignments} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted/40 p-10 text-center">
                        <Users size={64} className="mb-4 opacity-20" />
                        <h3 className="text-2xl font-black text-text-main/50 mb-2">Submissions Area</h3>
                        <p className="max-w-xs">Select an assignment from the list to view student submissions and begin grading.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Extracted View for Submissions to isolate data fetching
const SubmissionsView = ({ assignmentId, assignments }) => {
    const assignment = assignments?.find(a => a.id === assignmentId);
    const { data: submissions, isLoading } = useAssignmentSubmissions(assignmentId);
    const gradeMutation = useGradeSubmission();

    const [gradingState, setGradingState] = useState({});

    const handleGradeChange = (subId, field, value) => {
        setGradingState(prev => ({
            ...prev,
            [subId]: { ...(prev[subId] || {}), [field]: value }
        }));
    };

    const submitGrade = (submission) => {
        const state = gradingState[submission.id];
        if (!state?.marks) return alert("Please enter marks");
        if (state.marks > assignment.totalMarks) return alert("Marks cannot exceed total marks.");

        gradeMutation.mutate({
            submissionId: submission.id,
            payload: {
                marksObtained: state.marks,
                feedback: state.feedback || ''
            }
        });
    };

    if (isLoading) return <div className="flex-1 p-10 text-center text-primary font-bold animate-pulse">Loading submissions...</div>;

    const submittedCount = submissions?.length || 0;

    return (
        <>
            <div className="p-6 border-b border-border-custom bg-black/5 dark:bg-white/5 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-text-main">{assignment?.title}</h2>
                    <p className="text-sm text-text-muted font-medium mt-1">Total Marks: {assignment?.totalMarks} | Due: {new Date(assignment?.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                    <span className="block text-3xl font-black text-primary leading-none">{submittedCount}</span>
                    <span className="text-[0.6rem] uppercase tracking-widest font-bold text-text-muted">Turned In</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 custom-scrollbar">
                {submissions?.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {submissions.map(sub => {
                            const isGraded = sub.status === 'GRADED';
                            const state = gradingState[sub.id] || {};

                            return (
                                <div key={sub.id} className={`glass-card p-5 border relative overflow-hidden group ${isGraded ? 'border-green-500/30' : 'border-border-custom'}`}>
                                    {/* Submitter Info */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {sub.student.firstName[0]}{sub.student.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-main text-sm">{sub.student.firstName} {sub.student.lastName}</p>
                                                <p className="text-xs text-text-muted">{sub.student.email}</p>
                                            </div>
                                        </div>
                                        {isGraded ? (
                                            <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                                <CheckCircle size={14} /> {sub.marksObtained}/{assignment.totalMarks}
                                            </span>
                                        ) : (
                                            <span className="bg-orange-500/10 text-orange-500 text-xs font-bold px-2 py-1 rounded">Needs Grading</span>
                                        )}
                                    </div>

                                    {/* Submission Content */}
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border-custom/50">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg"><FileText size={20} /></div>
                                        <div className="flex-1 truncate">
                                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-0.5">Submitted File / Link</p>
                                            <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-text-main hover:text-primary transition-colors truncate block">
                                                {sub.submissionUrl}
                                            </a>
                                        </div>
                                        <a href={sub.submissionUrl} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors p-2">
                                            <DownloadCloud size={20} />
                                        </a>
                                    </div>

                                    {/* Grading Area */}
                                    {!isGraded ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-3">
                                                <input 
                                                    type="number" placeholder="Marks" className="input-custom w-24 text-center font-bold text-lg" 
                                                    max={assignment.totalMarks}
                                                    value={state.marks || ''} onChange={e => handleGradeChange(sub.id, 'marks', Number(e.target.value))}
                                                />
                                                <input 
                                                    type="text" placeholder="Remarks & Feedback..." className="input-custom flex-1 text-sm"
                                                    value={state.feedback || ''} onChange={e => handleGradeChange(sub.id, 'feedback', e.target.value)}
                                                />
                                            </div>
                                            <button 
                                                className="btn-primary w-full text-sm py-2"
                                                onClick={() => submitGrade(sub)}
                                                disabled={gradeMutation.isPending}
                                            >
                                                Save Grade
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-sm italic text-text-muted p-2 border-l-2 border-green-500/50 pl-3">
                                            "{sub.feedback || 'No remarks provided.'}"
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted/50">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">No students have submitted this assignment yet.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default FacultyAssignments;
