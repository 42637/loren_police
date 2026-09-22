import { Link } from 'react-router-dom';
import { AlertCircle, MapPin, Calendar, FileText, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ChallanCard({ challan }) {
  const isMismatch = challan.challanVehicle !== challan.claimedVehicle;

  return (
    <div className="card challan-card">
      <div className="card-header">
        <div>
          <span className="card-id-tag">{challan.id}</span>
          <h3 className="challan-card-no">{challan.challanNo}</h3>
        </div>
        <StatusBadge status={challan.status} />
      </div>

      <div className="card-body">
        <div className="vehicle-compare-snippet">
          <div className="plate-tag">
            <span className="plate-sub">Challan:</span>
            <span className="plate-val">{challan.challanVehicle}</span>
          </div>
          <span className="vs-sep">vs</span>
          <div className="plate-tag claimed">
            <span className="plate-sub">Claimed:</span>
            <span className="plate-val">{challan.claimedVehicle}</span>
          </div>
        </div>

        {isMismatch && (
          <div className="mismatch-mini-alert">
            <AlertCircle size={13} />
            <span>Vehicle Number Mismatch</span>
          </div>
        )}

        <div className="challan-info-list">
          <div className="info-item">
            <FileText size={14} className="info-icon" />
            <span><strong>Violation:</strong> {challan.violation}</span>
          </div>
          <div className="info-item">
            <MapPin size={14} className="info-icon" />
            <span><strong>Location:</strong> {challan.location}</span>
          </div>
          <div className="info-item">
            <Calendar size={14} className="info-icon" />
            <span><strong>Reported:</strong> {challan.reportedDate}</span>
          </div>
          <div className="info-item" style={{ alignItems: 'flex-start' }}>
            <FileText size={14} className="info-icon" style={{ marginTop: '2px' }} />
            <span><strong>Statement:</strong> {challan.description || challan.mismatchReason}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="priority-container">
          <span className="priority-label">Priority:</span>
          <span className={`priority-pill ${challan.priority?.toLowerCase()}`}>
            {challan.priority}
          </span>
        </div>
        <Link to={`/app/challans/${challan.id}`} className="btn-view-case">
          <span>VIEW CASE</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        .challan-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-id-tag {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .challan-card-no {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-blue);
        }

        .vehicle-compare-snippet {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-neutral-bg);
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .plate-tag {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .plate-sub {
          font-size: 0.65rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
        }

        .plate-val {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .vs-sep {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
        }

        .mismatch-mini-alert {
          background: var(--color-danger-bg);
          color: var(--color-danger);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }

        .challan-info-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-icon {
          color: var(--primary-blue);
          flex-shrink: 0;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
          margin-top: 4px;
        }

        .priority-container {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
        }

        .btn-view-case {
          background-color: var(--primary-blue);
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s ease;
        }

        .btn-view-case:hover {
          background-color: var(--primary-blue-hover);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
