import React from 'react';
import { Activity, Shield, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const getLogIcon = (action) => {
    switch (action) {
        case 'LOGIN_SUCCESS': return <LogIn size={16} className="text-blue-500" />;
        case 'USER_CREATE': return <UserPlus size={16} className="text-emerald-500" />;
        case 'CONFIG_UPDATE': return <Shield size={16} className="text-purple-500" />;
        case 'LOGIN_FAIL': return <AlertCircle size={16} className="text-rose-500" />;
        default: return <Activity size={16} className="text-text-muted opacity-40" />;
    }
};

const SystemLogs = ({ logs = [] }) => (
    <div className="glass rounded-[20px] h-[400px] overflow-hidden flex flex-col">
        <h3 className="text-[1.1rem] font-semibold text-text-main p-5 pb-2.5">System Activity Logs</h3>
        <div className="flex-1 overflow-y-auto scroller p-[0_20px_20px]">
            {logs.length > 0 ? logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-3 border-b border-border-custom last:border-0">
                    <div className="shrink-0">
                        {getLogIcon(log.action)}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-text-main m-0">
                            {log.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-text-muted m-0">
                            {log.user?.name || 'System'} • {new Date(log.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            )) : (
                <p className="text-text-muted text-center pt-10">
                    No recent activities
                </p>
            )}
        </div>
    </div>
);

export default SystemLogs;
