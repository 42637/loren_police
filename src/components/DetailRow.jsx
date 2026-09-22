export default function DetailRow({ label, value, highlight = false }) {
  if (value === undefined || value === null) return null;

  return (
    <div className={`detail-row ${highlight ? 'highlight-row' : ''}`}>
      <span className="detail-label">{label}</span>
      <span className={`detail-value ${highlight ? 'value-highlight' : ''}`}>{value}</span>
      <style>{`
        .highlight-row {
          background-color: var(--very-light-blue);
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid var(--primary-blue);
        }
        .value-highlight {
          color: var(--primary-blue);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
