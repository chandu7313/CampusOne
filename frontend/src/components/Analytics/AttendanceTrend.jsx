import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', attendance: 85, target: 75 },
  { month: 'Feb', attendance: 88, target: 75 },
  { month: 'Mar', attendance: 92, target: 75 },
  { month: 'Apr', attendance: 82, target: 75 },
  { month: 'May', attendance: 78, target: 75 },
  { month: 'Jun', attendance: 95, target: 75 },
];

const AttendanceTrend = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', fontWeight: '600' }}>Attendance Trend (%)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
          />
          <YAxis 
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
          <Legend verticalAlign="top" height={36}/>
          <Line 
            type="monotone" 
            dataKey="attendance" 
            name="Actual Attendance"
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#6366f1' }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            name="Target (75%)"
            stroke="#f43f5e" 
            strokeDasharray="5 5" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrend;
