import React, { useState } from 'react';
import {
    usePlacementOpportunities,
    useCreatePlacementOpportunity,
    useOpportunityApplications,
    useUpdateApplicationStatus
} from '../../../hooks/usePlacements';
import { Users, FileText, CheckCircle, XCircle, ChevronRight, Building } from 'lucide-react';

const FacultyPlacements = () => {
    const { data: opportunities, isLoading: loadingOpps } = usePlacementOpportunities();
    const [selectedOppId, setSelectedOppId] = useState(null);

    return (
        <div className="flex flex-col md:flex-row gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-120px)] mt-4 md:mt-0">
            
            {/* Left Panel: Drives List */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6 h-full overflow-y-auto pr-4 custom-scrollbar shrink-0">
                <header className="border-b border-border-custom/50 pb-4">
                    <h1 className="text-3xl font-black italic tracking-tighter text-text-main uppercase">
                        Drive <span className="text-primary">Management</span>
                    </h1>
                    <p className="text-sm font-medium text-text-muted mt-1">Review student applications.</p>
                </header>

                {loadingOpps ? (
                    <div className="animate-pulse text-center p-10 text-primary font-bold">Loading Drives...</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {opportunities?.map(opp => (
                            <button 
                                key={opp.id}
                                onClick={() => setSelectedOppId(opp.id)}
                                className={`glass-card p-5 text-left border transition-all flex flex-col gap-3 group shrink-0 ${selectedOppId === opp.id ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-border-custom hover:border-primary/50'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-black text-lg transition-colors leading-tight ${selectedOppId === opp.id ? 'text-primary' : 'text-text-main'}`}>
                                        {opp.companyName}
                                    </h3>
                                    <ChevronRight size={16} className={`transition-transform ${selectedOppId === opp.id ? 'text-primary rotate-90' : 'text-text-muted'}`} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-text-main">{opp.title}</p>
                                    <p className="text-xs font-medium text-text-muted italic">Deadline: {new Date(opp.lastDateToApply).toLocaleDateString()}</p>
                                </div>
                            </button>
                        ))}

                        {opportunities?.length === 0 && (
                            <div className="text-center p-10 text-text-muted/50 border border-dashed rounded-3xl">
                                <Building size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium">No active drives found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Panel: Applications List */}
            <div className="flex-1 glass-card rounded-3xl border border-border-custom/50 overflow-hidden flex flex-col h-full bg-gradient-to-br from-transparent to-black/5 dark:to-white/5">
                {selectedOppId ? (
                    <ApplicationsReview opportunityId={selectedOppId} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted/40 p-10 text-center">
                        <Users size={64} className="mb-4 opacity-20" />
                        <h3 className="text-2xl font-black text-text-main/50 mb-2">Review Applications</h3>
                        <p className="max-w-sm">Select a recruitment drive from the left panel to review and shortlist student applications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ApplicationsReview = ({ opportunityId }) => {
    const { data: applications, isLoading } = useOpportunityApplications(opportunityId);
    const updateStatusMutation = useUpdateApplicationStatus();

    if (isLoading) return <div className="flex-1 p-20 text-center animate-pulse font-bold text-primary">Loading Applicants...</div>;

    const handleStatusUpdate = (appId, status) => {
        updateStatusMutation.mutate({ id: appId, status });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border-custom bg-black/5 dark:bg-white/5 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-black text-text-main flex items-center gap-3 italic uppercase tracking-tighter">
                    <span className="p-2 bg-primary/20 text-primary rounded-xl shrink-0"><Users size={20} /></span>
                    Applicant Roster
                </h2>
                <span className="text-xs font-black text-text-muted uppercase tracking-widest bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full">
                    {applications?.length || 0} Total
                </span>
            </div>
            
            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                {applications?.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {applications.map((app) => (
                            <div key={app.id} className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row items-center justify-between border border-border-custom/50 bg-black/5 dark:bg-white/5 hover:border-primary/30 transition-all gap-6">
                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl shrink-0">
                                        {app.student?.firstName?.[0]}{app.student?.lastName?.[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-lg text-text-main truncate leading-tight">{app.student?.firstName} {app.student?.lastName}</p>
                                        <p className="text-xs text-text-muted font-bold tracking-tight truncate">{app.student?.email}</p>
                                        <button className="flex items-center gap-1.5 text-xs text-primary font-black uppercase tracking-widest mt-2 hover:underline">
                                            <FileText size={14} /> View Resume
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    <div className={`px-4 py-1.5 rounded-xl text-[0.65rem] font-black uppercase tracking-widest border shrink-0
                                        ${app.status === 'Selected' || app.status === 'Shortlisted' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                          'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                        {app.status}
                                    </div>
                                    
                                    <div className="flex gap-2 shrink-0">
                                        <button 
                                            onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                                            disabled={updateStatusMutation.isPending}
                                            className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all shadow-sm"
                                            title="Shortlist"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                            disabled={updateStatusMutation.isPending}
                                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                            title="Reject"
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted/50 text-center max-w-sm mx-auto p-6">
                        <Users size={48} className="mb-4 opacity-20" />
                        <h3 className="font-bold mb-1 uppercase tracking-wider">No Applicants</h3>
                        <p className="text-sm font-medium">No students have applied for this drive yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyPlacements;
