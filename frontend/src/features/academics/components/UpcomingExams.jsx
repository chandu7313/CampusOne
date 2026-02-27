import { Calendar, Clock, MapPin } from 'lucide-react';

const exams = [
  { subject: 'Data Structures (Final)', date: 'Mar 08, 2024', time: '10:00 AM' },
  { subject: 'DBMS (Midterm)', date: 'Mar 12, 2024', time: '02:00 PM' },
  { subject: 'AI Fundamentals', date: 'Mar 15, 2024', time: '09:00 AM' },
  { subject: 'Software Eng. (Project)', date: 'Mar 20, 2024', time: '11:30 AM' },
];

const UpcomingExams = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '20px' }}>Upcoming Exams</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {exams.map((exam, index) => (
          <div key={index} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: index !== exams.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '10px', 
              background: 'rgba(37, 99, 235, 0.1)', 
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calendar size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>{exam.subject}</p>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {exam.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {exam.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingExams;
