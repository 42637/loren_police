import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import DetailRow from '../components/DetailRow';
import EvidenceCard from '../components/EvidenceCard';
import MockMap from '../components/MockMap';
import ConfirmDialog from '../components/ConfirmDialog';
import { ArrowLeft, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function DetectedVehicleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detections, stolenVehicles, verifyDetection } = useApp();

  const detection = detections.find((d) => d.id === id);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (!detection) {
    return (
      <div className="page-wrapper">
        <button onClick={() => navigate('/app/detected')} className="btn-secondary" style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Detected Vehicles
        </button>
        <div className="empty-state-container">
          <h3>Detection Record Not Found</h3>
          <p>Detection ID {id} does not exist in the camera logs.</p>
        </div>
      </div>
    );
  }

  const isPotentialMatch = detection.status === 'POTENTIAL MATCH';
  const matchedStolen = stolenVehicles.find(s => s.registrationNo === detection.vehicleNo);

  const evidenceMock = {
    cameraId: detection.cameraId,
    cameraLocation: detection.location,
    timestamp: detection.timestamp,
    detectedVehicleNumber: detection.vehicleNo,
    ocrConfidence: detection.ocrConfidence
  };

  const mapMarkers = [
    {
      top: '45%',
      left: '50%',
      label: `${detection.cameraId}: ${detection.vehicleNo}`,
      type: isPotentialMatch ? 'stolen' : 'camera'
    }
  ];

  const handleConfirmMatch = () => {
    verifyDetection(detection.id, true);
    setShowConfirmModal(false);
  };

  const handleRejectMatch = () => {
    verifyDetection(detection.id, false);
    setShowRejectModal(false);
  };

  return (
    <div className="detected-detail-page">
      <div className="detail-top-nav">
        <Link to="/app/detected" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Detected Vehicles</span>
        </Link>
        <StatusBadge status={detection.status} />
      </div>

      {/* Main Detection Card */}
      <div className="card detection-main-card">
        <div className="card-header">
          <div>
            <span className="card-id-tag">DETECTION ID: {detection.id}</span>
            <h1 className="detected-plate-large">{detection.vehicleNo}</h1>
          </div>
          <div className="confidence-badge-large">
            <span>OCR Confidence:</span>
            <strong>{detection.ocrConfidence}%</strong>
          </div>
        </div>
      </div>

      {/* POTENTIAL MATCH WARNING & VERIFICATION BANNER */}
      {isPotentialMatch && (
        <section className="card potential-match-verification-card">
          <div className="potential-verify-header">
            <ShieldAlert size={24} color="#E65100" />
            <div>
              <h2>POTENTIAL STOLEN VEHICLE MATCH</h2>
              <p>
                ANPR automatic match against active FIR ({matchedStolen?.firNumber || 'FIR-2026-00231'}).
              </p>
            </div>
          </div>

          <div className="match-comparison-grid">
            <div className="detail-grid">
              <DetailRow label="Detected Plate" value={detection.vehicleNo} highlight={true} />
              <DetailRow label="Matched FIR Record" value={matchedStolen?.registrationNo || detection.vehicleNo} />
              <DetailRow label="FIR Model & Color" value={matchedStolen ? `${matchedStolen.make} ${matchedStolen.model} (${matchedStolen.color})` : detection.matchedModel} />
              <DetailRow label="Verification Status" value={detection.verificationStatus} />
            </div>
          </div>

          <div className="disclaimer-banner" style={{ margin: '14px 0' }}>
            <ShieldAlert size={16} className="disclaimer-icon" />
            <span>
              <strong>POLICE DIRECTIVE:</strong> Never automatically mark a vehicle as recovered. Always maintain <strong>POTENTIAL MATCH</strong> status until verified on-ground by an authorized officer.
            </span>
          </div>

          {detection.verificationStatus === 'OFFICER VERIFICATION REQUIRED' || detection.verificationStatus === 'UNVERIFIED' ? (
            <div className="action-buttons-group">
              <button
                className="btn-primary"
                onClick={() => setShowConfirmModal(true)}
                style={{ background: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flex: 1, padding: '12px' }}
              >
                <CheckCircle size={18} />
                <span>CONFIRM STOLEN MATCH</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => setShowRejectModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flex: 1, padding: '12px' }}
              >
                <XCircle size={18} />
                <span>DISMISS / REJECT MATCH</span>
              </button>
            </div>
          ) : (
            <div className="decision-completed-banner">
              <CheckCircle size={18} />
              <span>Officer Verification Recorded: {detection.verificationStatus}</span>
            </div>
          )}
        </section>
      )}

      {/* CCTV SNAPSHOT FRAME */}
      <EvidenceCard evidence={evidenceMock} />

      {/* MAP & CAMERA DETAILS */}
      <div className="grid-2">
        <div className="card">
          <div className="form-section-title">CAMERA INFORMATION</div>
          <div className="detail-grid">
            <DetailRow label="Camera ID" value={detection.cameraId} />
            <DetailRow label="Camera Name" value={detection.cameraName} />
            <DetailRow label="Location" value={detection.location} />
            <DetailRow label="Camera Zone" value="Zone A" />
            <DetailRow label="Coordinates" value={`${detection.cameraLat}, ${detection.cameraLng}`} />
          </div>
        </div>

        <div className="card">
          <div className="form-section-title">DETECTION LOCATION MAP</div>
          <MockMap markers={mapMarkers} height="200px" />
        </div>
      </div>

      {/* CONFIRM MATCH DIALOG */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        title="Confirm Stolen Vehicle Match?"
        message={`Are you sure you want to verify vehicle ${detection.vehicleNo} detected at ${detection.location} as a CONFIRMED match for FIR ${matchedStolen?.firNumber || 'record'}? Ground traffic patrol units will be notified.`}
        confirmText="Confirm Stolen Match"
        cancelText="Cancel"
        onConfirm={handleConfirmMatch}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* REJECT MATCH DIALOG */}
      <ConfirmDialog
        isOpen={showRejectModal}
        title="Reject Stolen Match Alert?"
        message={`This will dismiss the potential match alert for vehicle ${detection.vehicleNo} detected at ${detection.location}.`}
        confirmText="Dismiss Match Alert"
        cancelText="Cancel"
        onConfirm={handleRejectMatch}
        onCancel={() => setShowRejectModal(false)}
        isDanger={true}
      />

      <style>{`
        .detected-detail-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detected-plate-large {
          font-family: monospace;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-blue);
          letter-spacing: 2px;
        }

        .confidence-badge-large {
          font-size: 0.8rem;
          background: var(--very-light-blue);
          color: var(--primary-blue);
          padding: 6px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .potential-match-verification-card {
          border-left: 5px solid #E65100;
          background: #FFF8E1;
        }

        .potential-verify-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .potential-verify-header h2 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #E65100;
        }

        .potential-verify-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .match-comparison-grid {
          background: #FFFFFF;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #FFE0B2;
        }
      `}</style>
    </div>
  );
}
