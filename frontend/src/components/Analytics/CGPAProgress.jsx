import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { semester: 'Sem 1', gpa: 3.4 },
  { semester: 'Sem 2', gpa: 3.6 },
  { semester: 'Sem 3', gpa: 3.5 },
  { semester: 'Sem 4', gpa: 3.8 },
  { semester: 'Sem 5', gpa: 3.9 },
  { semester: 'Sem 6', gpa: 4.0 },
];

const CGPAProgress = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600' }}>Academic Progress (GPA)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="semester" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
          />
          <YAxis 
            domain={[0, 4.5]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border)', 
              borderRadius: '8px',
              color: 'var(--text-main)'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="gpa" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorGpa)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CGPAProgress;
