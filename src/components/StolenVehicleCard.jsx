import { Link } from 'react-router-dom';
import { FileText, MapPin, Calendar, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function StolenVehicleCard({ vehicle }) {
  return (
    <div className="card stolen-card">
      <div className="card-header">
        <div>
          <h3 className="stolen-reg-no">{vehicle.registrationNo}</h3>
          <div className="stolen-make-model">
            {vehicle.make} {vehicle.model} • <span className="vehicle-color">{vehicle.color}</span>
          </div>
        </div>
        <StatusBadge status={vehicle.status} />
      </div>

      <div className="stolen-info-list">
        <div className="info-item">
          <FileText size={14} className="info-icon" />
          <span><strong>FIR:</strong> {vehicle.firNumber}</span>
        </div>
        <div className="info-item">
          <MapPin size={14} className="info-icon" />
          <span><strong>Last Location:</strong> {vehicle.lastKnownLocation}</span>
        </div>
        <div className="info-item">
          <Calendar size={14} className="info-icon" />
          <span><strong>Reported:</strong> {vehicle.reportDate} ({vehicle.reportTime})</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="station-tag">{vehicle.policeStation}</span>
        <Link to={`/app/stolen/${vehicle.id}`} className="btn-view-stolen">
          <span>VIEW</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        .stolen-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stolen-reg-no {
          font-family: monospace;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--primary-blue);
        }

        .stolen-make-model {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .vehicle-color {
          color: var(--text-primary);
        }

        .stolen-info-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .station-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .btn-view-stolen {
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

        .btn-view-stolen:hover {
          background-color: var(--primary-blue-hover);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
