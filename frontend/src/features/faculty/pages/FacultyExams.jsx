import React, { useState } from 'react';
import { useFacultyExams, useFacultyExamResults, useUploadResults } from '../../../hooks/useExams';
import { Award, UploadCloud, Users, FileBarChart, PlayCircle } from 'lucide-react';

const FacultyExams = () => {
    const { data: exams, isLoading: loadingExams } = useFacultyExams();
    const [selectedPaperId, setSelectedPaperId] = useState(null);

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-120px)]">
            
            {/* Left Panel: Exam List */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6 h-full overflow-y-auto pr-4 custom-scrollbar shrink-0">
                <header className="border-b border-border-custom/50 pb-4">
                    <h1 className="text-3xl font-black italic tracking-tighter text-text-main uppercase">
                        Exams & <span className="text-primary">Grading</span>
                    </h1>
                    <p className="text-sm font-medium text-text-muted mt-1">Manage results for your papers.</p>
                </header>

                {loadingExams ? (
                    <div className="animate-pulse text-center p-10 text-primary font-bold">Loading Exams...</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {exams?.map(exam => (
                            <div key={exam.id} className="glass-card p-4 border border-border-custom hover:border-primary/50 transition-colors">
                                <h3 className="font-bold text-lg text-text-main leading-tight mb-1">{exam.name}</h3>
                                <div className="flex items-center justify-between text-xs font-bold text-text-muted mb-3">
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-wider">{exam.type}</span>
                                    <span>{exam.academicYear}</span>
                                </div>
                                <div className="flex flex-col gap-2 relative z-10">
                                    {exam.papers?.map(paper => (
                                        <button 
                                            key={paper.id}
                                            onClick={() => setSelectedPaperId(paper.id)}
                                            className={`text-left text-sm font-medium p-2 rounded-lg transition-colors flex items-center gap-2 group ${selectedPaperId === paper.id ? 'bg-primary text-white shadow-md' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-main'}`}
                                        >
                                            <PlayCircle size={14} className={selectedPaperId === paper.id ? "text-white/70" : "text-primary group-hover:scale-110 transition-transform"} />
                                            <span className="truncate">{paper.subject?.code} - {paper.subject?.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {exams?.length === 0 && (
                            <div className="text-center p-10 text-text-muted/50 border border-dashed rounded-3xl">
                                <FileBarChart size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium">No active exams found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Panel: Grading/Results View */}
            <div className="flex-1 glass-card rounded-3xl border border-border-custom/50 overflow-hidden flex flex-col h-full bg-gradient-to-br from-transparent to-black/5 dark:to-white/5">
                {selectedPaperId ? (
                    <GradingWorkspace subjectExamId={selectedPaperId} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted/40 p-10 text-center">
                        <Award size={64} className="mb-4 opacity-20" />
                        <h3 className="text-2xl font-black text-text-main/50 mb-2">Grading Workspace</h3>
                        <p className="max-w-sm">Select a specific paper from the left panel to begin uploading marks or reviewing student results.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const GradingWorkspace = ({ subjectExamId }) => {
    const { data: results, isLoading } = useFacultyExamResults(subjectExamId);
    const uploadMutation = useUploadResults();
    
    // In a real app, this state would hold the edited marks before saving.
    // For this demo, we'll assume a workflow where faculty might edit inline or bulk upload.
    const [marksDraft, setMarksDraft] = useState({});

    if (isLoading) return <div className="flex-1 p-20 text-center animate-pulse font-bold text-primary">Loading Student Roster...</div>;

    const handleMarksChange = (studentId, value) => {
        setMarksDraft(prev => ({
            ...prev,
            [studentId]: Number(value)
        }));
    };

    const handleSave = () => {
        const payloadResults = Object.entries(marksDraft).map(([studentId, marksObtained]) => ({
            studentId,
            marksObtained
        }));

        if (payloadResults.length === 0) return alert("No changes to save.");

        uploadMutation.mutate({
            subjectExamId,
            results: payloadResults
        }, {
            onSuccess: () => {
                alert("Results uploaded successfully!");
                setMarksDraft({});
            }
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border-custom bg-black/5 dark:bg-white/5 flex justify-between items-center shrink-0">
                <div>
                     <h2 className="text-2xl font-bold text-text-main flex items-center gap-3">
                         <span className="p-2 bg-primary/20 text-primary rounded-xl"><Users size={20} /></span>
                         Student Roster
                     </h2>
                     <p className="text-sm text-text-muted font-medium mt-1 ml-11">Enter marks out of 100 for each student.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={uploadMutation.isPending || Object.keys(marksDraft).length === 0}
                    className="btn-primary flex items-center gap-2"
                >
                    <UploadCloud size={18} />
                    {uploadMutation.isPending ? 'Saving...' : 'Save & Publish Marks'}
                </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                {results?.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {results.map((result) => {
                            const isEdited = marksDraft[result.student.id] !== undefined;
                            const displayValue = isEdited ? marksDraft[result.student.id] : result.marksObtained;
                            const hasGrade = !!result.grade;

                            return (
                                <div key={result.student.id} className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${isEdited ? 'border-primary/50 bg-primary/5 shadow-sm' : 'border-border-custom/50 bg-black/5 dark:bg-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                                            {result.student.firstName[0]}{result.student.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main">{result.student.firstName} {result.student.lastName}</p>
                                            <p className="text-xs text-text-muted font-medium">{result.student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {hasGrade && !isEdited && (
                                            <div className="text-center px-3 py-1 bg-black/5 dark:bg-white/5 rounded-lg">
                                                <span className="block text-xs uppercase tracking-widest text-text-muted font-bold">Grade</span>
                                                <span className={`text-lg font-black ${result.grade === 'F' ? 'text-red-500' : 'text-green-500'}`}>{result.grade}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col items-end gap-1">
                                            <label className="text-[0.65rem] uppercase font-bold tracking-widest text-text-muted">Marks</label>
                                            <input 
                                                type="number" 
                                                className={`w-20 text-center font-bold px-3 py-2 rounded-xl border outline-none transition-all ${isEdited ? 'border-primary text-primary bg-transparent' : 'border-border-custom text-text-main bg-black/5 dark:bg-white/5 focus:border-primary/50'}`}
                                                placeholder="---"
                                                min="0" max="100" // Assuming 100 for this demo, would come from subjectExam.totalMarks
                                                value={displayValue || ''}
                                                onChange={(e) => handleMarksChange(result.student.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted/50 text-center max-w-sm mx-auto p-6">
                        <Users size={48} className="mb-4 opacity-20" />
                        <h3 className="font-bold mb-1">No Students Enrolled</h3>
                        <p className="text-sm">There are no students listed for this specific examination paper yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyExams;
