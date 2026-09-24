import { useState, useEffect } from 'react';
import { Camera, Radio, AlertCircle } from 'lucide-react';

export default function CCTVPreview({ camera, height = "280px" }) {
  const [timeStr, setTimeStr] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = camera?.status === 'ONLINE' || !camera?.status || camera?.status === 'ACTIVE';

  const cctvFeeds = [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80'
  ];

  const hash = (camera?.id || 'CAM102')
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const feedImage = cctvFeeds[hash % cctvFeeds.length];

  return (
    <div className="cctv-preview-box">
      <div className="cctv-header-bar">
        <div className="cctv-cam-title">
          <Camera size={14} style={{ display: 'inline', marginRight: '6px' }} />
          <strong>{camera?.id || 'CAM102'}</strong> - {camera?.name || 'Traffic Camera'}
        </div>
        <div className="cctv-status-right">
          {isOnline ? (
            <span className="cctv-live-tag">
              <Radio size={10} /> LIVE STREAM
            </span>
          ) : (
            <span className="cctv-offline-tag">
              <AlertCircle size={10} /> {camera?.status || 'OFFLINE'}
            </span>
          )}
        </div>
      </div>

      <div className="cctv-canvas-container" style={{ height }}>
        {isOnline ? (
          <>
            <img src={feedImage} alt="CCTV Live Stream" className="cctv-live-feed-img" />
            <div className="cctv-scan-grid" />
            <div className="cctv-detected-box-overlay">
              <div className="anpr-scan-label">ANPR AUTOMATIC SCANNING...</div>
              <div className="anpr-detected-val">
                DETECTED: <strong>AP37AB4567</strong> [96% CONFIDENCE]
              </div>
            </div>
            <div className="cctv-timestamp-box">
              <span className="live-rec-dot"></span>
              <span>21 AUG 2026 {timeStr}</span>
            </div>
          </>
        ) : (
          <div className="cctv-offline-message">
            <AlertCircle size={32} color="#94A3B8" />
            <div>NO LIVE FEED - CAMERA {camera?.status || 'OFFLINE'}</div>
          </div>
        )}

        <div className="cctv-demo-overlay">AP POLICE CCTV FEED</div>
      </div>

      <style>{`
        .cctv-preview-box {
          width: 100%;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          background: #0B192C;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .cctv-header-bar {
          background: #061933;
          color: #FFFFFF;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1E293B;
          font-size: 0.85rem;
        }

        .cctv-live-tag {
          background: rgba(34, 197, 94, 0.2);
          color: #4ADE80;
          border: 1px solid #22C55E;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cctv-offline-tag {
          background: var(--color-neutral);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cctv-canvas-container {
          position: relative;
          width: 100%;
          background: #000000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cctv-live-feed-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.9) contrast(1.1);
        }

        .cctv-scan-grid {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
          z-index: 1;
        }

        .cctv-timestamp-box {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: #00FF66;
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 255, 102, 0.4);
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-rec-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #EF4444;
          box-shadow: 0 0 6px #EF4444;
          animation: recBlink 1.2s infinite ease-in-out;
        }

        .cctv-detected-box-overlay {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(6, 25, 51, 0.88);
          border: 1.5px dashed #22C55E;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 6px;
          font-family: monospace;
          z-index: 2;
        }

        .anpr-scan-label {
          font-size: 0.65rem;
          color: #4ADE80;
          letter-spacing: 0.5px;
        }

        .anpr-detected-val {
          font-size: 0.78rem;
          margin-top: 2px;
        }

        .anpr-detected-val strong {
          color: #F0C342;
        }

        .cctv-demo-overlay {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(240, 195, 66, 0.2);
          border: 1px solid #F0C342;
          color: #F0C342;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 3px 6px;
          border-radius: 3px;
          letter-spacing: 0.5px;
          z-index: 2;
        }

        .cctv-offline-message {
          color: #94A3B8;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
