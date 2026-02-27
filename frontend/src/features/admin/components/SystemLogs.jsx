import { CheckCircle, AlertCircle, RefreshCw, User, Shield } from 'lucide-react';

const logs = [
  { time: '14:02', message: 'Backup completed successfully', type: 'success', icon: CheckCircle },
  { time: '13:58', message: 'User login: Prof. Evans', type: 'info', icon: User },
  { time: '13:45', message: 'Security alert: Minor', type: 'warning', icon: AlertCircle },
  { time: '13:20', message: 'Database sync complete', type: 'success', icon: RefreshCw },
  { time: '12:55', message: 'Server load stabilized', type: 'success', icon: CheckCircle },
  { time: '12:10', message: 'API request failed (Retry successful)', type: 'warning', icon: AlertCircle },
];

const SystemLogs = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>System Logs</h3>
        <Shield size={18} style={{ color: 'var(--text-muted)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {logs.map((log, index) => {
          const Icon = log.icon;
          const color = log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : '#2563eb';
          
          return (
            <div key={index} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: `${color}15`, 
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>{log.message}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <button style={{ 
        width: '100%', 
        padding: '12px', 
        marginTop: '24px', 
        borderRadius: '8px', 
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-main)',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer'
      }}>
        View All Logs
      </button>
    </div>
  );
};

export default SystemLogs;
