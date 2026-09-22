import { Link } from 'react-router-dom';
import { Camera, MapPin, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DetectionCard({ detection }) {
  return (
    <div className="card detection-card">
      <div className="card-header">
        <div>
          <span className="detection-id-tag">{detection.id}</span>
          <h3 className="detected-veh-no">{detection.vehicleNo}</h3>
        </div>
        <StatusBadge status={detection.status} />
      </div>

      {detection.status === 'POTENTIAL MATCH' && (
        <div className="potential-match-alert">
          <ShieldAlert size={14} />
          <span>Matches Stolen Vehicle FIR ({detection.matchedStolenId || 'Active Alert'})</span>
        </div>
      )}

      <div className="detection-info-list">
        <div className="info-item">
          <Camera size={14} className="info-icon" />
          <span><strong>Camera:</strong> {detection.cameraId} ({detection.cameraName})</span>
        </div>
        <div className="info-item">
          <MapPin size={14} className="info-icon" />
          <span><strong>Location:</strong> {detection.location}</span>
        </div>
        <div className="info-item">
          <Clock size={14} className="info-icon" />
          <span><strong>Time:</strong> {detection.timestamp}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="confidence-pill">
          <span>OCR Confidence:</span>
          <strong>{detection.ocrConfidence}%</strong>
        </div>
        <Link to={`/app/detected/${detection.id}`} className="btn-view-detection">
          <span>VIEW DETECTION</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        .detection-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detection-id-tag {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .detected-veh-no {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-blue);
          letter-spacing: 1px;
        }

        .potential-match-alert {
          background: #FFF3E0;
          border: 1px solid #FFE0B2;
          color: #E65100;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .detection-info-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .confidence-pill {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-view-detection {
          background-color: var(--primary-blue);
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-view-detection:hover {
          background-color: var(--primary-blue-hover);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
