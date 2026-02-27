import { Users, GraduationCap, BookOpen, CreditCard } from 'lucide-react';
import PerformanceChart from './PerformanceChart';
import TimetableWidget from './TimetableWidget';
import UpcomingExams from './UpcomingExams';

const MetricCard = ({ icon: Icon, label, value, subtext, color, trend }) => (
  <div className="glass" style={{ padding: '24px', borderRadius: '16px', flex: 1, minWidth: '280px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
      <div style={{ padding: '12px', background: `${color}15`, color: color, borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      {trend && (
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: '700', 
          padding: '4px 8px', 
          borderRadius: '20px', 
          background: trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
          color: trend.startsWith('+') ? '#10b981' : '#f43f5e' 
        }}>
          {trend}
        </span>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</h3>
      <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{label.includes('Attendance') ? '%' : ''}</span>
    </div>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{label}</p>
    <p style={{ color: color, fontSize: '0.75rem', fontWeight: '500', marginTop: '8px' }}>{subtext}</p>
  </div>
);

const StudentDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Welcome back, Sarah!</h1>
        <p style={{ color: 'var(--text-muted)' }}>B.Tech Computer Science • 6th Semester</p>
      </header>

      <section style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <MetricCard 
          icon={Users} 
          label="Attendance" 
          value="88" 
          subtext="8% above minimum" 
          color="#10b981" 
          trend="+2.1%" 
        />
        <MetricCard 
          icon={GraduationCap} 
          label="CGPA" 
          value="9.2" 
          subtext="Dean's List Student" 
          color="#8b5cf6" 
          trend="+0.3" 
        />
        <MetricCard 
          icon={CreditCard} 
          label="Fee Status" 
          value="Paid" 
          subtext="No pending dues" 
          color="#2563eb" 
        />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PerformanceChart />
          <TimetableWidget />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <UpcomingExams />
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '16px' }}>Recent Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.875rem', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                New assignment posted in <b>AI Fundamentals</b>.
              </p>
              <p style={{ fontSize: '0.875rem', borderLeft: '3px solid #f59e0b', paddingLeft: '12px' }}>
                Exam schedule for Sem 6 Finals released.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
