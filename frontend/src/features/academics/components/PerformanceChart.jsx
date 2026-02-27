import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { semester: 'Sem 1', gpa: 8.8 },
  { semester: 'Sem 2', gpa: 8.9 },
  { semester: 'Sem 3', gpa: 9.1 },
  { semester: 'Sem 4', gpa: 9.2 },
  { semester: 'Sem 5', gpa: 9.3 },
  { semester: 'Sem 6', gpa: 9.2 },
];

const PerformanceChart = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Academic Performance</h3>
        <select style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '4px 8px', borderRadius: '4px' }}>
          <option>Overall CGPA: 9.2</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="semester" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={[8, 10]} 
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
            stroke="var(--primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorGpa)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
