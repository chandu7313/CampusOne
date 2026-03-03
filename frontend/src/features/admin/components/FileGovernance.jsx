import React from 'react';
import { useActivityLogs } from '../hooks/useAdminStats';
import { FileText, Shield, AlertTriangle, Eye, Trash2, ShieldCheck } from 'lucide-react';

const FileGovernance = () => {
    // We repurpose activity logs to show file-related events
    const { data: logsData, isLoading } = useActivityLogs({ action: 'FILE_UPLOAD' });
    const logs = logsData?.logs || [];

    if (isLoading) return <div className="text-center p-16 text-text-muted opacity-40">Loading Governance Audit...</div>;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold m-0 text-text-main">File Governance & Integrity</h2>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[0.85rem] font-semibold">
                    <ShieldCheck size={18} /> Role-Based Access Active
                </div>
            </header>

            <div className="glass bg-bg-card/30 backdrop-blur-md border border-border-custom rounded-3xl overflow-hidden">
                <div className="px-6 py-5 border-b border-border-custom/50">
                    <h3 className="m-0 text-[1.1rem] font-semibold text-text-main">Recent File Operations</h3>
                </div>
                <div className="flex flex-col">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-center gap-4 px-6 py-4 border-b border-border-custom/30 last:border-0 transition-colors hover:bg-bg-card/20">
                            <div className="w-10 h-10 bg-bg-card/50 rounded-lg flex items-center justify-center text-primary">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="m-0 text-[0.95rem] text-text-main opacity-90">
                                    <strong className="text-text-main font-semibold">{log.user?.name}</strong> uploaded <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary font-mono text-sm">{log.metadata?.fileName || 'document.pdf'}</code>
                                </p>
                                <span className="text-[0.8rem] text-text-muted opacity-60">{new Date(log.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-bg-card/50 border-none text-text-muted opacity-60 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-bg-card hover:text-text-main" title="View"><Eye size={16} /></button>
                                <button className="bg-bg-card/50 border-none text-text-muted opacity-60 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-500" title="Flag for deletion"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center p-16 text-text-muted opacity-40">No recent file operations flagged.</p>}
                </div>
            </div>
        </div>
    );
};

export default FileGovernance;
