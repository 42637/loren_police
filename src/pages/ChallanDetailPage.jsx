import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import DetailRow from '../components/DetailRow';
import EvidenceCard from '../components/EvidenceCard';
import Timeline from '../components/Timeline';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ShieldCheck
} from 'lucide-react';

export default function ChallanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { challans, verifyChallan, rejectChallan } = useApp();
  const { user } = useAuth();

  const caseData = challans.find((c) => c.id === id);

  // Dialog States
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Wrong vehicle detected');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [modalError, setModalError] = useState('');

  if (!caseData) {
    return (
      <div className="page-wrapper">
        <button onClick={() => navigate('/app/challans')} className="btn-secondary" style={{ marginBottom: '16px' }}>
          <ArrowLeft size={16} /> Back to Challans
        </button>
        <div className="empty-state-container">
          <h3>Challan Record Not Found</h3>
          <p>The requested complaint ID {id} does not exist.</p>
        </div>
      </div>
    );
  }

  const isMismatch = caseData.challanVehicle !== caseData.claimedVehicle;
  const isPending = caseData.status === 'PENDING REVIEW' || caseData.status === 'UNDER REVIEW';

  const handleConfirmVerify = () => {
    verifyChallan(caseData.id, "Verified by Officer");
    setShowVerifyModal(false);
  };

  const handleConfirmReject = () => {
    if (rejectReason === 'Other' && !rejectRemarks.trim()) {
      setModalError('Please specify remarks for rejection reason "Other".');
      return;
    }
    setModalError('');
    rejectChallan(caseData.id, rejectReason, rejectRemarks);
    setShowRejectModal(false);
  };

  return (
    <div className="challan-detail-page">
      {/* Top Back Navigation */}
      <div className="detail-top-nav">
        <Link to="/app/challans" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Verification List</span>
        </Link>
        <StatusBadge status={caseData.status} />
      </div>

      {/* Main Case Header */}
      <div className="case-main-header card">
        <div className="case-title-row">
          <div>
            <span className="case-id-badge">{caseData.id}</span>
            <h1 className="case-challan-no">{caseData.challanNo}</h1>
          </div>
          <div className="priority-pill-large">
            <span>Priority:</span>
            <strong className={caseData.priority?.toLowerCase()}>{caseData.priority}</strong>
          </div>
        </div>
        <div className="violation-summary">
          <strong>Violation:</strong> {caseData.violation}
        </div>
      </div>

      {/* VEHICLE NUMBER COMPARISON (MAJOR FEATURE) */}
      <section className="card comparison-section">
        <div className="form-section-title">VEHICLE NUMBER COMPARISON</div>
        <div className="comparison-boxes">
          <div className="plate-box">
            <div className="plate-label">RECORDED CHALLAN VEHICLE</div>
            <div className="plate-number">{caseData.challanVehicle}</div>
          </div>
          <div className="vs-badge">VS</div>
          <div className={`plate-box claimed ${isMismatch ? 'mismatch' : ''}`}>
            <div className="plate-label">DISPUTED / CLAIMED VEHICLE</div>
            <div className="plate-number">{caseData.claimedVehicle}</div>
          </div>
        </div>

        {isMismatch ? (
          <div className="mismatch-alert-banner">
            <AlertCircle size={18} />
            <div>
              <strong>VEHICLE NUMBER MISMATCH DETECTED</strong>
              <div style={{ fontSize: '0.8rem', fontWeight: '400', marginTop: '2px' }}>
                Potential Cause: {caseData.mismatchReason || 'Technical / Camera / OCR Read Error'}
              </div>
            </div>
          </div>
        ) : (
          <div className="match-banner" style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#16803C', padding: '10px', borderRadius: '4px', marginTop: '12px', fontSize: '0.85rem' }}>
            <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Vehicle numbers match. Review owner dispute claim documents.
          </div>
        )}
      </section>

      {/* EVIDENCE CARD */}
      <EvidenceCard evidence={caseData.evidence} />

      {/* TWO COLUMN GRID FOR INFO SECTIONS */}
      <div className="grid-2">
        {/* COMPLAINT & OWNER INFO */}
        <div className="card">
          <div className="form-section-title">COMPLAINT INFORMATION</div>
          <div className="detail-grid">
            <DetailRow label="Complaint ID" value={caseData.id} />
            <DetailRow label="Reported Date" value={caseData.reportedDate} />
            <DetailRow label="Reported Time" value={caseData.reportedTime} />
            <DetailRow label="Complainant Owner" value={caseData.ownerName} />
            <DetailRow label="Contact Phone" value={caseData.ownerPhone} />
          </div>
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Citizen Complaint Statement / Description:</strong>
            <p style={{
              marginTop: '6px',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              fontStyle: 'italic',
              background: 'var(--very-light-blue, #f8fafc)',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid var(--border-light, #e2e8f0)',
              wordBreak: 'break-word'
            }}>
              "{caseData.description || caseData.mismatchReason || 'No detailed statement provided.'}"
            </p>
          </div>
        </div>

        {/* CHALLAN & LOCATION INFO */}
        <div className="card">
          <div className="form-section-title">CHALLAN INFORMATION</div>
          <div className="detail-grid">
            <DetailRow label="Challan Number" value={caseData.challanNo} />
            <DetailRow label="Vehicle Type" value={caseData.vehicleType} />
            <DetailRow label="Violation Spot" value={caseData.location} />
            <DetailRow label="Assigned Zone" value="Zone A - Bhimavaram Traffic PS" />
          </div>
        </div>
      </div>

      {/* OFFICER REVIEW & DECISION ACTIONS */}
      <section className="card review-decision-card">
        <div className="form-section-title">OFFICER REVIEW & DECISION</div>

        <div className="detail-grid" style={{ marginBottom: '16px' }}>
          <DetailRow label="Review Status" value={caseData.status} />
          <DetailRow label="Reviewing Officer" value={caseData.officerReview?.assignedOfficer || user?.name} />
          <DetailRow label="Police ID" value={caseData.officerReview?.policeId || user?.policeId} />
          <DetailRow label="Review Date" value={caseData.officerReview?.reviewDate || 'Pending Action'} />
        </div>

        {caseData.officerReview?.remarks && (
          <div className="remarks-box">
            <strong>Officer Remarks:</strong>
            <p>{caseData.officerReview.remarks}</p>
          </div>
        )}

        {isPending ? (
          <div className="action-buttons-group">
            <button
              className="btn-primary btn-action-verify"
              onClick={() => setShowVerifyModal(true)}
            >
              <CheckCircle size={18} />
              <span>VERIFY CHALLAN (ACCEPT CLAIM)</span>
            </button>
            <button
              className="btn-danger btn-action-reject"
              onClick={() => setShowRejectModal(true)}
            >
              <XCircle size={18} />
              <span>REJECT COMPLAINT</span>
            </button>
          </div>
        ) : (
          <div className="decision-completed-banner">
            <ShieldCheck size={18} />
            <span>Decision recorded by officer. Case status is final.</span>
          </div>
        )}
      </section>

      {/* CASE TIMELINE */}
      <section className="card timeline-section">
        <div className="form-section-title">CASE TIMELINE HISTORY</div>
        <Timeline items={caseData.timeline} />
      </section>

      {/* VERIFY CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={showVerifyModal}
        title="Verify Challan Dispute?"
        message={`You are about to accept the vehicle owner's dispute and mark Challan ${caseData.challanNo} as VERIFIED (Cancelled due to mismatch/OCR error).`}
        confirmText="Confirm Verification"
        cancelText="Cancel"
        onConfirm={handleConfirmVerify}
        onCancel={() => setShowVerifyModal(false)}
      />

      {/* REJECT MODAL WITH REASON SELECTOR */}
      {showRejectModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--color-danger)' }}>
                Reject Dispute Complaint
              </h3>
              <button onClick={() => setShowRejectModal(false)}>
                <XCircle size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ margin: '16px 0' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                Please select the official police rejection reason for complaint <strong>{caseData.id}</strong>:
              </p>

              {modalError && (
                <div className="login-error-alert" style={{ marginBottom: '12px' }}>
                  <AlertCircle size={14} />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Rejection Reason <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                >
                  <option value="Wrong vehicle detected">Wrong vehicle detected / False Claim</option>
                  <option value="OCR error not applicable">OCR error claim invalid upon manual check</option>
                  <option value="Camera error claim rejected">Camera speed radar verified accurate</option>
                  <option value="Insufficient evidence">Insufficient evidence provided by complainant</option>
                  <option value="Duplicate challan dispute">Duplicate dispute submission</option>
                  <option value="Other">Other (Requires detailed remarks)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Officer Remarks</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter detailed officer remarks..."
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleConfirmReject}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .challan-detail-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary-blue);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .case-main-header {
          border-left: 4px solid var(--primary-blue);
        }

        .case-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .case-id-badge {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .case-challan-no {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary-blue);
        }

        .priority-pill-large {
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .violation-summary {
          font-size: 0.9rem;
          color: var(--text-primary);
          padding-top: 8px;
          border-top: 1px solid var(--border-light);
        }

        .remarks-box {
          background: var(--very-light-blue);
          border: 1px solid var(--border-light);
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 0.875rem;
        }

        .action-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (min-width: 600px) {
          .action-buttons-group {
            flex-direction: row;
          }
          .btn-action-verify, .btn-action-reject {
            flex: 1;
            padding: 12px;
            justify-content: center;
          }
        }

        .btn-action-verify {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }

        .btn-action-reject {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }

        .decision-completed-banner {
          background: var(--color-success-bg);
          border: 1px solid var(--color-success-border);
          color: var(--color-success);
          padding: 12px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}
