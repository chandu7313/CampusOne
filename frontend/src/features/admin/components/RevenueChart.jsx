import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 95000 },
  { month: 'Feb', revenue: 105000 },
  { month: 'Mar', revenue: 98000 },
  { month: 'Apr', revenue: 115000 },
  { month: 'May', revenue: 125000 },
  { month: 'Jun', revenue: 140000 },
  { month: 'Jul', revenue: 135000 },
  { month: 'Aug', revenue: 145000 },
  { month: 'Sep', revenue: 160000 },
  { month: 'Oct', revenue: 155000 },
  { month: 'Nov', revenue: 170000 },
  { month: 'Dec', revenue: 185000 },
];

const RevenueChart = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px', height: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Revenue Analytics</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monthly Revenue Trend (Jan-Dec)</p>
        </div>
        <select style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '8px' }}>
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            tickFormatter={(value) => `$${value/1000}k`}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border)',
              borderRadius: '8px',
              color: 'var(--text-main)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#2563eb" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRev)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
