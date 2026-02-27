import { Users, GraduationCap, DollarSign, Activity } from 'lucide-react';
import RevenueChart from './RevenueChart';
import DepartmentDistribution from './DepartmentDistribution';
import SystemLogs from './SystemLogs';

const MetricCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass" style={{ padding: '24px', borderRadius: '16px', flex: 1, minWidth: '260px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
      <div style={{ padding: '12px', background: `${color}15`, color: color, borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          color: trend.startsWith('+') ? '#10b981' : '#f43f5e' 
        }}>
          {trend}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>vs last month</span>
      </div>
    </div>
    <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>{value}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</p>
  </div>
);

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>System Overview & Institutional Analytics</p>
      </header>

      <section style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <MetricCard icon={Users} label="Total Students" value="4,850" trend="+3.1%" color="#2563eb" />
        <MetricCard icon={GraduationCap} label="Total Faculty" value="248" trend="+1.8%" color="#8b5cf6" />
        <MetricCard icon={DollarSign} label="Total Revenue" value="$1.2M" trend="+5.6%" color="#10b981" />
        <MetricCard icon={Activity} label="System Health" value="Optimal" trend="100%" color="#f59e0b" />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <RevenueChart />
          <DepartmentDistribution />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <SystemLogs />
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {['Add Student', 'Generate Report', 'Manage Roles', 'Audit Trail'].map(action => (
                <button key={action} style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
