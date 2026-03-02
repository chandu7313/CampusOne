import { ArrowUpRight, ArrowDownRight, Clock, FileText } from 'lucide-react';

const transactions = [
  { id: '1', date: 'Oct 24, 2026', description: 'Tuition Fee (Alice Johnson)', amount: '+$1,200', status: 'Completed', type: 'income' },
  { id: '2', date: 'Oct 23, 2026', description: 'Lab Supplies', amount: '-$450', status: 'Pending', type: 'expense' },
  { id: '3', date: 'Oct 22, 2026', description: 'Salary Payment (Staff)', amount: '-$15,000', status: 'Completed', type: 'expense' },
  { id: '4', date: 'Oct 21, 2026', description: 'Tuition Fee (Bob Smith)', amount: '+$1,200', status: 'Completed', type: 'income' },
  { id: '5', date: 'Oct 20, 2026', description: 'Canteen Maintenance', amount: '-$800', status: 'Completed', type: 'expense' },
];

const TransactionTable = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Transactions</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ 
            padding: '8px 16px', 
            borderRadius: '8px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-main)',
            color: 'var(--text-main)',
            fontSize: '0.875rem'
          }}>
            Filter
          </button>
          <button style={{ 
            padding: '8px 16px', 
            borderRadius: '8px', 
            border: 'none', 
            background: '#10b981',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Date</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Description</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Amount</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 12px', fontSize: '0.875rem' }}>{tx.date}</td>
                <td style={{ padding: '16px 12px', fontSize: '0.875rem', fontWeight: '500' }}>{tx.description}</td>
                <td style={{ 
                  padding: '16px 12px', 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  color: tx.type === 'income' ? '#10b981' : '#f43f5e'
                }}>
                  {tx.amount}
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem',
                    background: tx.status === 'Completed' ? '#10b98120' : '#f59e0b20',
                    color: tx.status === 'Completed' ? '#10b981' : '#f59e0b'
                  }}>
                    {tx.status}
                  </span>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
