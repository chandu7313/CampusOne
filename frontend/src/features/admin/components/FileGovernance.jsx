import React from 'react';
import { useActivityLogs } from '../hooks/useAdminStats';
import { FileText, Shield, AlertTriangle, Eye, Trash2, ShieldCheck } from 'lucide-react';

const FileGovernance = () => {
    // We repurpose activity logs to show file-related events
    const { data: logsData, isLoading } = useActivityLogs({ action: 'FILE_UPLOAD' });
    const logs = logsData?.logs || [];

    if (isLoading) return <div className="text-center p-16 text-white/40">Loading Governance Audit...</div>;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold m-0 text-white">File Governance & Integrity</h2>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[0.85rem] font-semibold">
                    <ShieldCheck size={18} /> Role-Based Access Active
                </div>
            </header>

            <div className="glass bg-white/3 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
                <div className="px-6 py-5 border-b border-white/5">
                    <h3 className="m-0 text-[1.1rem] font-semibold text-white">Recent File Operations</h3>
                </div>
                <div className="flex flex-col">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.02] last:border-0 transition-colors hover:bg-white/[0.01]">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-blue-500">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="m-0 text-[0.95rem] text-white/90">
                                    <strong className="text-white font-semibold">{log.user?.name}</strong> uploaded <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-sm">{log.metadata?.fileName || 'document.pdf'}</code>
                                </p>
                                <span className="text-[0.8rem] text-white/40">{new Date(log.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-white/5 border-none text-white/60 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-white" title="View"><Eye size={16} /></button>
                                <button className="bg-white/5 border-none text-white/60 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-500" title="Flag for deletion"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center p-16 text-white/40">No recent file operations flagged.</p>}
                </div>
            </div>
        </div>
    );
};

export default FileGovernance;
