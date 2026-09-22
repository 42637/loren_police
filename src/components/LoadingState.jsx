export default function LoadingState({ count = 3 }) {
  return (
    <div className="skeleton-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton-line title" />
          <div className="skeleton-line text" />
          <div className="skeleton-line text short" />
        </div>
      ))}

      <style>{`
        .skeleton-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-line {
          background: linear-gradient(90deg, #E2E8F0 25%, #EDF2F7 50%, #E2E8F0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-line.title {
          height: 20px;
          width: 40%;
        }

        .skeleton-line.text {
          height: 14px;
          width: 85%;
        }

        .skeleton-line.text.short {
          height: 14px;
          width: 60%;
        }

        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
