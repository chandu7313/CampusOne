import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { category: 'Tuition', amount: 850000, color: '#6366f1' },
  { category: 'Exam Fees', amount: 150000, color: '#8b5cf6' },
  { category: 'Library', amount: 45000, color: '#ec4899' },
  { category: 'Events', amount: 32000, color: '#f43f5e' },
  { category: 'Others', amount: 25000, color: '#f59e0b' },
];

const RevenueBreakdown = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600' }}>Revenue Breakdown ($)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" axisLine={false} tickLine={false} hide />
          <YAxis 
            type="category" 
            dataKey="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'var(--primary-10)' }}
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border)', 
              borderRadius: '8px',
              color: 'var(--text-main)'
            }} 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBreakdown;
