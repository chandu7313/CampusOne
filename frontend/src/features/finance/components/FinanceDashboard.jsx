import { DollarSign, TrendingUp, AlertCircle, FileCheck } from 'lucide-react';
import TransactionTable from './TransactionTable';
import InstallmentTracker from './InstallmentTracker';

const FinanceCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="glass" style={{ padding: '24px', borderRadius: '16px', flex: 1, minWidth: '280px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ padding: '12px', background: `${color}15`, color: color, borderRadius: '12px' }}>
        <Icon size={24} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{value}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{label}</p>
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px' }}>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtext}</p>
    </div>
  </div>
);

const FinanceDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Finance Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Revenue Tracking & Fee Management</p>
      </header>

      <section style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <FinanceCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value="$2.4M" 
          subtext="+12.5% from last year" 
          color="#10b981" 
        />
        <FinanceCard 
          icon={TrendingUp} 
          label="Collected This Month" 
          value="$185k" 
          subtext="Target: $200k (92%)" 
          color="#6366f1" 
        />
        <FinanceCard 
          icon={AlertCircle} 
          label="Pending Payments" 
          value="$45k" 
          subtext="24 accounts overdue" 
          color="#f43f5e" 
        />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }}>
        <TransactionTable />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <InstallmentTracker />
          <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <button style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}>Manage Invoices</button>
              <button style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}>Payroll Management</button>
              <button style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', cursor: 'pointer' }}>Financial Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
