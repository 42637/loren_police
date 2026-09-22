import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import DetailRow from '../components/DetailRow';
import MockMap from '../components/MockMap';
import { ArrowLeft, ShieldAlert, Camera } from 'lucide-react';

export default function StolenVehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stolenVehicles } = useApp();

  const vehicle = stolenVehicles.find((s) => s.id === id);

  if (!vehicle) {
    return (
      <div className="page-wrapper">
        <button onClick={() => navigate('/app/stolen')} className="btn-secondary" style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Stolen Vehicles
        </button>
        <div className="empty-state-container">
          <h3>Stolen Vehicle Record Not Found</h3>
          <p>The record ID {id} could not be located in the database.</p>
        </div>
      </div>
    );
  }

  const mapMarkers = [
    {
      top: '40%',
      left: '50%',
      label: `LAST KNOWN: ${vehicle.registrationNo}`,
      type: 'stolen'
    }
  ];

  return (
    <div className="stolen-detail-page">
      <div className="detail-top-nav">
        <Link to="/app/stolen" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Stolen Vehicles</span>
        </Link>
        <StatusBadge status={vehicle.status} />
      </div>

      {/* Main Vehicle Card */}
      <div className="card vehicle-main-card">
        <div className="card-header">
          <div>
            <span className="card-id-tag">RECORD ID: {vehicle.id}</span>
            <h1 className="vehicle-plate-large">{vehicle.registrationNo}</h1>
            <div className="vehicle-make-large">
              {vehicle.make} {vehicle.model} {vehicle.variant} • <strong>{vehicle.color}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* POTENTIAL MATCH ALERT IF DETECTED */}
      {vehicle.detections && vehicle.detections.length > 0 && (
        <div className="potential-match-card card">
          <div className="potential-header">
            <ShieldAlert size={20} color="#E65100" />
            <div>
              <h3>POTENTIAL STOLEN VEHICLE MATCH DETECTED</h3>
              <p>Camera ANPR logged automatic match. Officer physical verification required.</p>
            </div>
          </div>

          <div className="detection-match-snippet">
            <div className="detail-grid">
              <DetailRow label="Detected At" value={vehicle.detections[0].location} />
              <DetailRow label="Camera ID" value={vehicle.detections[0].cameraId} />
              <DetailRow label="Detection Time" value={vehicle.detections[0].timestamp} />
              <DetailRow label="Match Confidence" value={`${vehicle.detections[0].confidence}%`} />
            </div>

            <Link
              to={`/app/detected/${vehicle.detections[0].detectionId}`}
              className="btn-primary"
              style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Camera size={16} />
              <span>REVIEW CAMERA DETECTION RECORD</span>
            </Link>
          </div>
        </div>
      )}

      {/* MAP & LAST LOCATION */}
      <div className="card">
        <div className="form-section-title">LAST KNOWN LOCATION & MAP</div>
        <MockMap markers={mapMarkers} height="220px" />
        <div style={{ marginTop: '12px' }}>
          <DetailRow label="Last Reported Spot" value={vehicle.lastKnownLocation} highlight={true} />
        </div>
      </div>

      {/* TWO COLUMN GRID FOR DETAILS */}
      <div className="grid-2">
        <div className="card">
          <div className="form-section-title">REPORT & FIR INFORMATION</div>
          <div className="detail-grid">
            <DetailRow label="FIR Number" value={vehicle.firNumber} />
            <DetailRow label="Complaint ID" value={vehicle.complaintId} />
            <DetailRow label="Police Station" value={vehicle.policeStation} />
            <DetailRow label="District & Zone" value={`${vehicle.district} (${vehicle.zone})`} />
            <DetailRow label="Reported Date" value={`${vehicle.reportDate} (${vehicle.reportTime})`} />
          </div>
        </div>

        <div className="card">
          <div className="form-section-title">OWNER & VEHICLE DETAILS</div>
          <div className="detail-grid">
            <DetailRow label="Owner Name" value={vehicle.ownerName} />
            <DetailRow label="Contact Phone" value={vehicle.ownerContact} />
            <DetailRow label="Fuel Type" value={vehicle.fuelType} />
            <DetailRow label="Color" value={vehicle.color} />
          </div>
        </div>
      </div>

      {/* IDENTIFYING FEATURES */}
      <div className="card">
        <div className="form-section-title">UNIQUE IDENTIFYING FEATURES</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', background: 'var(--color-neutral-bg)', padding: '12px', borderRadius: '4px' }}>
          {vehicle.identifyingFeatures || 'No specific marks or scratches recorded.'}
        </p>
      </div>

      <style>{`
        .stolen-detail-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .vehicle-plate-large {
          font-family: monospace;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-blue);
          letter-spacing: 2px;
        }

        .vehicle-make-large {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .potential-match-card {
          border-left: 5px solid #E65100;
          background: #FFF8E1;
        }

        .potential-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .potential-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #E65100;
        }

        .potential-header p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .detection-match-snippet {
          background: #FFFFFF;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #FFE0B2;
        }
      `}</style>
    </div>
  );
}
