const schedule = [
  { time: '09:00 AM', subject: 'CS 401: Data Structures', location: 'Hall A10', color: '#8b5cf6' },
  { time: '11:30 AM', subject: 'MA 302: Statistics', location: 'Room 202', color: '#2563eb' },
  { time: '02:00 PM', subject: 'HU 105: Communication', location: 'Lab B3', color: '#10b981' },
];

const TimetableWidget = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Weekly Timetable</h3>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Mon - Feb 26, 2024</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {schedule.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', minWidth: '80px', color: 'var(--text-muted)' }}>{item.time}</span>
            <div style={{ width: '4px', height: '30px', background: item.color, borderRadius: '2px' }}></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.925rem', fontWeight: '600' }}>{item.subject}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableWidget;
