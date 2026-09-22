import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Activity } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function CameraCard({ camera }) {
  return (
    <div className="card camera-card">
      <div className="card-header">
        <div>
          <span className="camera-zone-tag">{camera.zone}</span>
          <h3 className="camera-id-title">{camera.id}</h3>
        </div>
        <StatusBadge status={camera.status} />
      </div>

      <div className="camera-info-body">
        <div className="camera-name">{camera.name}</div>
        <div className="info-item">
          <MapPin size={14} className="info-icon" />
          <span>{camera.location}</span>
        </div>
        <div className="info-item">
          <Clock size={14} className="info-icon" />
          <span><strong>Last Signal:</strong> {camera.lastSignal}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="detections-stat">
          <Activity size={14} />
          <span><strong>{camera.detectionsToday}</strong> today</span>
        </div>
        <Link to={`/app/cameras/${camera.id}`} className="btn-view-camera">
          <span>VIEW CAMERA</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        .camera-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .camera-zone-tag {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
        }

        .camera-id-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-blue);
        }

        .camera-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .camera-info-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .detections-stat {
          font-size: 0.775rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-view-camera {
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

        .btn-view-camera:hover {
          background-color: var(--primary-blue-hover);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
