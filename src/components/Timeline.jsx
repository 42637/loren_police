export default function Timeline({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="timeline">
      {items.map((item, idx) => (
        <div key={idx} className="timeline-item">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-time">{item.date} • {item.time}</div>
            <div className="timeline-title">{item.title}</div>
            {item.description && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {item.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
