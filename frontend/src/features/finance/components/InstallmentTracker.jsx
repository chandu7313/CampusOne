const installments = [
  { term: 'Term 1', progress: 100, status: 'Completed', color: '#10b981' },
  { term: 'Term 2', progress: 40, status: 'In Progress', color: '#f59e0b' },
  { term: 'Term 3', progress: 0, status: 'Upcoming', color: '#6366f1' },
];

const InstallmentTracker = () => {
  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '24px' }}>Installment Progress</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {installments.map((item, index) => (
          <div key={index} style={{ borderLeft: `2px solid ${item.progress > 0 ? item.color : 'var(--border)'}`, paddingLeft: '20px', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: '-7px', 
              top: '0', 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: item.progress > 0 ? item.color : 'var(--border)' 
            }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{item.term}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.status}</span>
            </div>
            
            <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${item.progress}%`, 
                height: '100%', 
                background: item.color,
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
            
            <div style={{ marginTop: '4px', textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: item.color }}>{item.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      <button style={{ 
        width: '100%', 
        padding: '12px', 
        marginTop: '32px', 
        borderRadius: '8px', 
        background: '#10b981',
        color: 'white',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        Collect Payment
      </button>
    </div>
  );
};

export default InstallmentTracker;
