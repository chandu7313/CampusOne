import React, { useState } from 'react';
import { usePlacementOpportunities, useStudentApplications, useApplyForOpportunity } from '../../../hooks/usePlacements';
import { Briefcase, Building, Calendar, DollarSign, FileText, Send, CheckCircle, Clock } from 'lucide-react';

const PlacementPortal = () => {
    const [activeTab, setActiveTab] = useState('OPPORTUNITIES'); // OPPORTUNITIES, MY_APPLICATIONS
    
    const { data: opportunities, isLoading: loadingOpps } = usePlacementOpportunities();
    const { data: applications, isLoading: loadingApps } = useStudentApplications();
    const applyMutation = useApplyForOpportunity();

    return (
        <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-custom/50 pb-8 px-2 mt-4 md:mt-0">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-text-main uppercase">
                        Placement <span className="text-primary italic">Portal</span>
                    </h1>
                    <p className="text-text-muted font-medium">Bridge the gap between campus and career.</p>
                </div>
                
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl self-start md:self-end">
                    <button 
                        onClick={() => setActiveTab('OPPORTUNITIES')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'OPPORTUNITIES' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        Opportunities
                    </button>
                    <button 
                        onClick={() => setActiveTab('MY_APPLICATIONS')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'MY_APPLICATIONS' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        My Applications
                    </button>
                </div>
            </header>

            {activeTab === 'OPPORTUNITIES' ? (
                <OpportunitiesView 
                    opportunities={opportunities} 
                    applications={applications}
                    isLoading={loadingOpps} 
                    onApply={(payload) => applyMutation.mutate(payload)}
                    isApplying={applyMutation.isPending}
                />
            ) : (
                <ApplicationsView applications={applications} isLoading={loadingApps} />
            )}
        </div>
    );
};

const OpportunitiesView = ({ opportunities, applications, isLoading, onApply, isApplying }) => {
    if (isLoading) return <div className="text-center p-20 animate-pulse text-primary font-bold">Loading Opportunities...</div>;

    const appliedIds = new Set(applications?.map(app => app.opportunityId));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {opportunities?.length > 0 ? opportunities.map((opp) => (
                <div key={opp.id} className="glass-card flex flex-col border border-border-custom hover:border-primary/50 transition-all p-6 group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Building size={32} />
                        </div>
                        <div className="text-right">
                            <span className="block text-xl font-black text-text-main leading-tight">{opp.companyName}</span>
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{opp.status}</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">{opp.title}</h3>
                    <p className="text-sm text-text-muted font-medium line-clamp-3 mb-6 flex-1">
                        {opp.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border-custom/50 flex flex-col gap-1">
                            <span className="text-[0.6rem] uppercase font-bold text-text-muted tracking-widest flex items-center gap-1.5 line-clamp-1">
                                <DollarSign size={10} className="text-primary" /> Expected Package
                            </span>
                            <span className="text-sm font-black text-text-main truncate">{opp.packageExpected || 'N/A'}</span>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border-custom/50 flex flex-col gap-1">
                            <span className="text-[0.6rem] uppercase font-bold text-text-muted tracking-widest flex items-center gap-1.5 line-clamp-1">
                                <Calendar size={10} className="text-primary" /> Deadline
                            </span>
                            <span className="text-sm font-black text-text-main truncate">{new Date(opp.lastDateToApply).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {appliedIds.has(opp.id) ? (
                        <div className="w-full py-3 rounded-xl bg-green-500/10 text-green-500 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-green-500/20">
                            <CheckCircle size={18} /> Applied
                        </div>
                    ) : (
                        <button 
                            onClick={() => onApply({ opportunityId: opp.id, resumeUrl: 'MOCK_URL' })}
                            disabled={isApplying}
                            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
                        >
                            <Send size={18} /> {isApplying ? 'Applying...' : 'Apply Now'}
                        </button>
                    )}
                </div>
            )) : (
                <div className="col-span-full glass-card p-20 flex flex-col items-center justify-center text-center text-text-muted border-dashed">
                    <Briefcase size={64} className="mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-text-main">No Open Opportunities</h3>
                    <p className="text-sm font-medium mt-1">Check back later for new placement drives.</p>
                </div>
            )}
        </div>
    );
};

const ApplicationsView = ({ applications, isLoading }) => {
    if (isLoading) return <div className="text-center p-20 animate-pulse text-primary font-bold">Loading Applications...</div>;

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black/5 dark:bg-white/5 border-b border-border-custom">
                            <th className="p-6 font-bold text-text-muted uppercase tracking-wider text-xs">Company</th>
                            <th className="p-6 font-bold text-text-muted uppercase tracking-wider text-xs">Role</th>
                            <th className="p-6 font-bold text-text-muted uppercase tracking-wider text-xs">Applied On</th>
                            <th className="p-6 font-bold text-text-muted uppercase tracking-wider text-xs text-center">Status</th>
                            <th className="p-6 font-bold text-text-muted uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom/30 text-text-main">
                        {applications?.length > 0 ? applications.map((app) => (
                            <tr key={app.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                            {app.opportunity?.companyName?.[0]}
                                        </div>
                                        <span className="font-bold">{app.opportunity?.companyName}</span>
                                    </div>
                                </td>
                                <td className="p-6 font-medium">{app.opportunity?.title}</td>
                                <td className="p-6 text-sm font-medium text-text-muted">
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest
                                        ${app.status === 'Selected' ? 'bg-green-500/10 text-green-500' : 
                                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                          app.status === 'Applied' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="text-primary hover:underline text-xs font-bold uppercase tracking-wider">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-16 text-center text-text-muted/50 italic font-medium">
                                    You haven't applied for any opportunities yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlacementPortal;
