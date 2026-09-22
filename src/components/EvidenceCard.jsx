import { Camera, MapPin, Clock, AlertTriangle } from 'lucide-react';

export default function EvidenceCard({ evidence }) {
  if (!evidence) return null;

  return (
    <div className="card evidence-card">
      <div className="card-header">
        <div className="evidence-title">
          <Camera size={18} color="var(--primary-blue)" />
          <h3>CCTV EVIDENCE FRAME</h3>
        </div>
        <div className="ocr-score-badge">
          <span>OCR Confidence:</span>
          <strong>{evidence.ocrConfidence}%</strong>
        </div>
      </div>

      <div className="evidence-media-mock">
        <div className="camera-watermark">{evidence.cameraId} • {evidence.timestamp}</div>
        <div className="detected-box-overlay">
          <span>ANPR DETECTED:</span>
          <strong>{evidence.detectedVehicleNumber}</strong>
        </div>
        <div className="media-placeholder-text">
          [ AUTOMATIC CAMERA SNAPSHOT FRAME ]
        </div>
      </div>

      <div className="evidence-details-grid">
        <div className="ev-detail-item">
          <Camera size={14} />
          <span><strong>Camera ID:</strong> {evidence.cameraId}</span>
        </div>
        <div className="ev-detail-item">
          <MapPin size={14} />
          <span><strong>Location:</strong> {evidence.cameraLocation}</span>
        </div>
        <div className="ev-detail-item">
          <Clock size={14} />
          <span><strong>Timestamp:</strong> {evidence.timestamp}</span>
        </div>
      </div>

      <div className="disclaimer-banner">
        <AlertTriangle size={15} className="disclaimer-icon" />
        <span>
          <strong>DISCLAIMER:</strong> AI/CCTV information is provided for officer review and does not constitute final verification.
        </span>
      </div>

      <style>{`
        .evidence-card {
          margin-bottom: 16px;
        }

        .evidence-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .evidence-title h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-blue);
        }

        .ocr-score-badge {
          font-size: 0.775rem;
          color: var(--primary-blue);
          background: var(--very-light-blue);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .evidence-media-mock {
          width: 100%;
          height: 180px;
          background: #1E293B;
          border-radius: var(--border-radius);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          font-size: 0.85rem;
          margin-bottom: 12px;
          overflow: hidden;
          border: 1px solid #334155;
        }

        .camera-watermark {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: #FFFFFF;
          font-family: monospace;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 2px;
        }

        .detected-box-overlay {
          position: absolute;
          bottom: 8px;
          right: 8px;
          border: 1px dashed #22C55E;
          background: rgba(34, 197, 94, 0.15);
          color: #4ADE80;
          font-family: monospace;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 3px;
        }

        .evidence-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          font-size: 0.85rem;
          margin-bottom: 12px;
        }

        @media (min-width: 600px) {
          .evidence-details-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .ev-detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .disclaimer-banner {
          background-color: #FFF8E1;
          border: 1px solid #FFE082;
          color: var(--color-warning);
          font-size: 0.775rem;
          padding: 8px 12px;
          border-radius: 4px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .disclaimer-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
}
