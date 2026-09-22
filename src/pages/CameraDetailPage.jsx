import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import DetailRow from '../components/DetailRow';
import CCTVPreview from '../components/CCTVPreview';
import DetectionCard from '../components/DetectionCard';
import MockMap from '../components/MockMap';
import { ArrowLeft, Activity } from 'lucide-react';

export default function CameraDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cameras, detections } = useApp();

  const camera = cameras.find((c) => c.id === id);

  if (!camera) {
    return (
      <div className="page-wrapper">
        <button onClick={() => navigate('/app/cameras')} className="btn-secondary" style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Cameras
        </button>
        <div className="empty-state-container">
          <h3>Camera Record Not Found</h3>
          <p>Camera ID {id} does not exist in the traffic CCTV network.</p>
        </div>
      </div>
    );
  }

  const cameraDetections = detections.filter(d => d.cameraId === camera.id);

  const mapMarkers = [
    {
      top: '50%',
      left: '50%',
      label: `${camera.id}: ${camera.name}`,
      type: 'camera'
    }
  ];

  return (
    <div className="camera-detail-page">
      <div className="detail-top-nav">
        <Link to="/app/cameras" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Cameras</span>
        </Link>
        <StatusBadge status={camera.status} />
      </div>

      {/* Main Camera Header */}
      <div className="card camera-main-card">
        <div className="card-header">
          <div>
            <span className="card-id-tag">{camera.zone} • IP: {camera.ipAddress}</span>
            <h1 className="camera-title-large">{camera.id} - {camera.name}</h1>
            <div className="camera-location-sub">{camera.location}</div>
          </div>
        </div>
      </div>

      {/* LIVE CCTV PREVIEW */}
      <section className="card cctv-section-card">
        <div className="form-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>LIVE CCTV PREVIEW</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STREAM ID: {camera.id}_FEED</span>
        </div>
        <CCTVPreview camera={camera} />
      </section>

      {/* TWO COLUMN GRID FOR TECHNICAL DETAILS & MAP */}
      <div className="grid-2">
        <div className="card">
          <div className="form-section-title">CAMERA TECHNICAL PARAMETERS</div>
          <div className="detail-grid">
            <DetailRow label="Camera ID" value={camera.id} />
            <DetailRow label="Camera Model" value={camera.model} />
            <DetailRow label="IP Address" value={camera.ipAddress} />
            <DetailRow label="Zone & Sector" value={camera.zone} />
            <DetailRow label="GPS Coordinates" value={`${camera.lat}, ${camera.lng}`} />
            <DetailRow label="Last Signal Heartbeat" value={camera.lastSignal} />
            <DetailRow label="Detections Logged Today" value={camera.detectionsToday} highlight={true} />
          </div>
        </div>

        <div className="card">
          <div className="form-section-title">CAMERA GEOGRAPHIC LOCATION</div>
          <MockMap markers={mapMarkers} height="220px" />
        </div>
      </div>

      {/* RECENT DETECTIONS LOGGED BY THIS CAMERA */}
      <section className="card camera-detections-card">
        <div className="form-section-title">
          <Activity size={16} style={{ display: 'inline', marginRight: '6px' }} />
          RECENT DETECTIONS LOGGED BY THIS CAMERA ({cameraDetections.length})
        </div>

        {cameraDetections.length > 0 ? (
          <div className="grid-2" style={{ marginTop: '12px' }}>
            {cameraDetections.map((det) => (
              <DetectionCard key={det.id} detection={det} />
            ))}
          </div>
        ) : (
          <div className="empty-state-container" style={{ padding: '20px' }}>
            <p>No recent detections logged by {camera.id} in the current session.</p>
          </div>
        )}
      </section>

      <style>{`
        .camera-detail-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .camera-title-large {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--primary-blue);
        }

        .camera-location-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
