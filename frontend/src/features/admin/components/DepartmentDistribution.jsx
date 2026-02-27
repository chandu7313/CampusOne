import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Engineering', value: 2400, color: '#2563eb' },
  { name: 'Business', value: 1200, color: '#8b5cf6' },
  { name: 'Medicine', value: 800, color: '#10b981' },
  { name: 'Arts & Science', value: 450, color: '#f59e0b' },
];

const DepartmentDistribution = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '400px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px' }}>Department Distribution</h3>
      
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border)',
              borderRadius: '8px'
            }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Students: <b>4,850</b></p>
      </div>
    </div>
  );
};

export default DepartmentDistribution;
