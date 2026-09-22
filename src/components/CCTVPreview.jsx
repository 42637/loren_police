import { useState, useEffect } from 'react';
import { Camera, Radio, AlertCircle } from 'lucide-react';

export default function CCTVPreview({ camera }) {
  const [timeStr, setTimeStr] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOnline = camera?.status === 'ONLINE';

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
              <Radio size={10} /> LIVE
            </span>
          ) : (
            <span className="cctv-offline-tag">
              <AlertCircle size={10} /> {camera?.status || 'OFFLINE'}
            </span>
          )}
        </div>
      </div>

      <div className="cctv-canvas-mock">
        <div className="cctv-grid-lines" />
        
        {isOnline ? (
          <>
            <div className="cctv-detected-box-overlay">
              <div>AUTOMATIC ANPR SCANNING...</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                DETECTED: AP37AB4567 [96% CONFIDENCE]
              </div>
            </div>
            <div className="cctv-timestamp-box">
              21 AUG 2026 {timeStr}
            </div>
          </>
        ) : (
          <div className="cctv-offline-message">
            <AlertCircle size={28} />
            <div>NO LIVE FEED - CAMERA {camera?.status || 'OFFLINE'}</div>
          </div>
        )}

        <div className="cctv-demo-overlay">DEMO STREAM</div>
      </div>

      <style>{`
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

        .cctv-timestamp-box {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.75);
          color: #00FF66;
          font-family: monospace;
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 2px;
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
